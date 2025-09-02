import type { SupabaseClient } from '@supabase/supabase-js';
import type { Notification, CreateNotificationInput } from '$lib/types/event';
import * as notificationRepository from '$lib/repositories/marketplace-notifications.repository';
import * as eventRepository from '$lib/repositories/event.repository';

export class NotificationService {
  constructor(private supabase: SupabaseClient) {}

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return await notificationRepository.getUserNotifications(this.supabase, userId);
  }

  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    return await notificationRepository.getUnreadNotifications(this.supabase, userId);
  }

  async getNotificationCount(userId: string): Promise<number> {
    return await notificationRepository.getNotificationCount(this.supabase, userId);
  }

  async createNotification(userId: string, notificationData: CreateNotificationInput): Promise<Notification> {
    // Business logic validation
    if (!notificationData.title.trim()) {
      throw new Error('Notification title is required');
    }

    if (!notificationData.message.trim()) {
      throw new Error('Notification message is required');
    }

    return await notificationRepository.createNotification(this.supabase, userId, notificationData);
  }

  async markNotificationAsRead(notificationId: string): Promise<Notification> {
    return await notificationRepository.markNotificationAsRead(this.supabase, notificationId);
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    return await notificationRepository.markAllNotificationsAsRead(this.supabase, userId);
  }

  async deleteNotification(notificationId: string): Promise<void> {
    // First, get the notification to find the event_id
    const { data: notification, error: fetchError } = await this.supabase
      .from('notifications')
      .select('*')
      .eq('id', notificationId)
      .single();

    if (fetchError) {
      console.error('Error fetching notification:', fetchError);
      throw new Error('Failed to fetch notification');
    }

    if (!notification) {
      throw new Error('Notification not found');
    }

    // Check if this is an event reminder notification
    if (notification.type === 'event' && notification.title?.startsWith('Event Reminder:')) {
      // Extract event ID from action_url
      const eventIdMatch = notification.action_url?.match(/eventId=([^&]+)/);
      const eventId = eventIdMatch ? eventIdMatch[1] : null;
      
      if (eventId) {
        // Delete the corresponding event reminder using the event ID
        const { error: reminderError } = await this.supabase
          .from('event_reminders')
          .delete()
          .eq('event_id', eventId)
          .eq('user_id', notification.user_id);

        if (reminderError) {
          console.error('Error deleting event reminder:', reminderError);
        } else {
          console.log('Successfully deleted event reminder for event:', eventId);
        }
      } else {
        console.warn('Could not extract event ID from notification action_url:', notification.action_url);
      }
    }

    // Delete the notification
    return await notificationRepository.deleteNotification(this.supabase, notificationId);
  }

  async createEventReminderNotification(userId: string, eventId: string, reminderTime: string): Promise<Notification> {
    // Get event details for the notification
    const event = await eventRepository.getEventById(this.supabase, eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    // Use the actual event date instead of reminder time
    const eventDate = event.event_date ? new Date(event.event_date) : new Date();
    const formattedEventTime = eventDate.toLocaleString();

    const notificationData: CreateNotificationInput = {
      title: `Event Reminder: ${event.title}`,
      message: `Don't forget! ${event.title} is happening on ${formattedEventTime}. ${event.description ? event.description.substring(0, 100) + '...' : ''}`,
      type: 'event',
      action_url: `/myspace?eventId=${eventId}`, // Include event ID in action_url for easy reference
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Expire after 7 days
    };

    return await this.createNotification(userId, notificationData);
  }

  // New method to process overdue event reminders
  async processOverdueEventReminders(): Promise<{ processed: number; errors: string[] }> {
    const errors: string[] = [];
    let processed = 0;

    try {
      console.log('Checking for overdue reminders...');
      console.log('Current time:', new Date().toISOString());
      
      // Check current user context
      const { data: { user }, error: userError } = await this.supabase.auth.getUser();
      console.log('Current user context:', user?.id);
      if (userError) console.error('User context error:', userError);
      
      // First, let's see ALL reminders for debugging
      const { data: allReminders, error: allError } = await this.supabase
        .from('event_reminders')
        .select('*');
      
      if (allError) {
        console.error('Error fetching all reminders:', allError);
      } else {
        console.log('All reminders in database:', allReminders);
      }
      
      // Get all overdue reminders that haven't been sent yet
      const { data: overdueReminders, error } = await this.supabase
        .from('event_reminders')
        .select('*')
        .lte('reminder_time', new Date().toISOString())
        .eq('is_sent', false);

      if (error) {
        throw new Error(`Failed to fetch overdue reminders: ${error.message}`);
      }

      console.log('Found overdue reminders:', overdueReminders);

      if (!overdueReminders || overdueReminders.length === 0) {
        console.log('No overdue reminders found');
        return { processed: 0, errors: [] };
      }

      // Process each overdue reminder
      for (const reminder of overdueReminders) {
        try {
          console.log('Processing reminder:', reminder);
          
          // Create notification for the reminder
          const notification = await this.createEventReminderNotification(
            reminder.user_id,
            reminder.event_id,
            reminder.reminder_time
          );
          
          console.log('Created notification:', notification);

          // Mark the reminder as sent
          const { error: updateError } = await this.supabase
            .from('event_reminders')
            .update({ is_sent: true })
            .eq('id', reminder.id);

          if (updateError) {
            errors.push(`Failed to mark reminder ${reminder.id} as sent: ${updateError.message}`);
            console.error('Failed to mark reminder as sent:', updateError);
          } else {
            processed++;
            console.log('Successfully processed reminder:', reminder.id);
          }
        } catch (reminderError) {
          const errorMsg = `Failed to process reminder ${reminder.id}: ${reminderError instanceof Error ? reminderError.message : 'Unknown error'}`;
          errors.push(errorMsg);
          console.error(errorMsg, reminderError);
        }
      }

      console.log('Processing complete. Processed:', processed, 'Errors:', errors);
      return { processed, errors };
    } catch (error) {
      const errorMsg = `Failed to process overdue reminders: ${error instanceof Error ? error.message : 'Unknown error'}`;
      errors.push(errorMsg);
      console.error(errorMsg, error);
      return { processed, errors };
    }
  }
}
