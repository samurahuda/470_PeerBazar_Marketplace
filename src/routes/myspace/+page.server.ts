import { supabase } from '$lib/supabase';
import { EventController } from '$lib/controllers/event.controller';
import { NotificationController } from '$lib/controllers/notification.controller';
import type { PageServerLoad } from './$types';
import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, parent }) => {
  const eventController = new EventController(supabase);
  
  // Get session data from parent layout
  const { session } = await parent();
  
  // Get only active events for the carousel
  const result = await eventController.getAllEvents();
  
  // Filter to only show active events
  const activeEvents = result.success && result.data
    ? result.data.filter(event => event.is_active)
    : [];

  // Get user reminders if user is authenticated
  let userReminders: any[] = [];
  if (session?.user) {
    const remindersResult = await eventController.getUserEventReminders(session.user.id);
    userReminders = remindersResult.success && remindersResult.data ? remindersResult.data : [];
  }
  
  return {
    events: activeEvents,
    userReminders,
    session,
    error: result.success ? null : result.error
  };
};

// Server action to create event reminder
export const actions = {
  createReminder: async ({ request, locals }: RequestEvent) => {
    const formData = await request.formData();
    const eventId = formData.get('eventId') as string;
    const reminderTime = formData.get('reminderTime') as string;
    
    console.log('Server action - eventId:', eventId, 'reminderTime:', reminderTime); // Debug log
    
    const session = await locals.getSession();
    console.log('Server action - session:', session); // Debug log
    
    if (!session?.user) {
      console.log('Server action - user not authenticated'); // Debug log
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const eventController = new EventController(locals.supabase);
      const result = await eventController.createEventReminder(session.user.id, {
        event_id: eventId,
        reminder_time: reminderTime
      });

      console.log('Server action - result:', result); // Debug log
      
      // If reminder was created successfully, process overdue reminders
      if (result.success) {
        console.log('Reminder created successfully, processing overdue reminders...');
        const notificationController = new NotificationController(locals.supabase);
        const reminderResult = await notificationController.processOverdueEventReminders();
        console.log('Overdue reminders processing result:', reminderResult);
      }
      
      return result;
    } catch (error) {
      console.error('Server action - error:', error); // Debug log
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      };
    }
  }
};
