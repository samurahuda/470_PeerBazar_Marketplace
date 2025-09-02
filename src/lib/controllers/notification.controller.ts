import type { SupabaseClient } from '@supabase/supabase-js';
import { NotificationService } from '$lib/services/notification.service';
import type { CreateNotificationInput } from '$lib/types/event';

export class NotificationController {
  private notificationService: NotificationService;

  constructor(private supabase: SupabaseClient) {
    this.notificationService = new NotificationService(supabase);
  }

  async getUserNotifications(userId: string) {
    try {
      const notifications = await this.notificationService.getUserNotifications(userId);
      return { success: true, data: notifications };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getUnreadNotifications(userId: string) {
    try {
      const notifications = await this.notificationService.getUnreadNotifications(userId);
      return { success: true, data: notifications };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getNotificationCount(userId: string) {
    try {
      const count = await this.notificationService.getNotificationCount(userId);
      return { success: true, data: count };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async createNotification(userId: string, notificationData: CreateNotificationInput) {
    try {
      const notification = await this.notificationService.createNotification(userId, notificationData);
      return { success: true, data: notification };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async markNotificationAsRead(notificationId: string) {
    try {
      const notification = await this.notificationService.markNotificationAsRead(notificationId);
      return { success: true, data: notification };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async markAllNotificationsAsRead(userId: string) {
    try {
      await this.notificationService.markAllNotificationsAsRead(userId);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async deleteNotification(notificationId: string) {
    try {
      await this.notificationService.deleteNotification(notificationId);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async processOverdueEventReminders() {
    try {
      const result = await this.notificationService.processOverdueEventReminders();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}
