import { NotificationController } from '$lib/controllers/notification.controller';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, locals: { supabase } }) => {
  const { data: { user: sessionUser } } = await supabase.auth.getUser();
  if (!sessionUser) {
    return { notifications: [], error: 'You must be logged in to view notifications.' };
  }

  const notificationController = new NotificationController(supabase);

  try {
    const { data: notifications, error } = await notificationController.getUserNotifications(sessionUser.id);
    if (error) {
      throw new Error(error);
    }
    return { notifications };
  } catch (error: any) {
    return { notifications: [], error: error.message };
  }
};

export const actions = {
  markAsRead: async ({ request, locals }: RequestEvent) => {
    const formData = await request.formData();
    const notificationId = formData.get('notificationId') as string;

    console.log('Mark as read - notificationId:', notificationId);

    const session = await locals.getSession();
    if (!session?.user) {
      console.log('Mark as read - user not authenticated');
      return { success: false, error: 'User not authenticated' };
    }

    console.log('Mark as read - user:', session.user.id);

    try {
      const notificationController = new NotificationController(locals.supabase);
      const result = await notificationController.markNotificationAsRead(notificationId);
      console.log('Mark as read - result:', result);
      return result;
    } catch (error) {
      console.error('Mark as read - error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred'
      };
    }
  },

  markAllAsRead: async ({ request, locals }: RequestEvent) => {
    const session = await locals.getSession();
    if (!session?.user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const notificationController = new NotificationController(locals.supabase);
      const result = await notificationController.markAllNotificationsAsRead(session.user.id);
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred'
      };
    }
  },

  deleteNotification: async ({ request, locals }: RequestEvent) => {
    const formData = await request.formData();
    const notificationId = formData.get('notificationId') as string;

    console.log('Delete notification - notificationId:', notificationId);

    const session = await locals.getSession();
    if (!session?.user) {
      console.log('Delete notification - user not authenticated');
      return { success: false, error: 'User not authenticated' };
    }

    console.log('Delete notification - user:', session.user.id);

    try {
      const notificationController = new NotificationController(locals.supabase);
      const result = await notificationController.deleteNotification(notificationId);
      console.log('Delete notification - result:', result);
      return result;
    } catch (error) {
      console.error('Delete notification - error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred'
      };
    }
  }
};
