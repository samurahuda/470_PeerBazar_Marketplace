import type { PurchaseHistory, JobApplication, ProductListing } from '$lib/types/marketplace';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Notification, CreateNotificationInput } from '$lib/types/event'; // Import Notification types







export async function createPurchase(supabase: SupabaseClient, purchase: Omit<PurchaseHistory, 'id' | 'purchase_date' | 'status'>): Promise<PurchaseHistory> {
  const { data, error } = await supabase
    .from('purchase_history')
    .insert(purchase)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create purchase: ${error.message}`);
  }

  return data;
}

// --- Notification functions ---

export async function getUserNotifications(supabase: SupabaseClient, userId: string): Promise<Notification[]> {
  // Fetch general notifications that are giveaway claims
  const { data: giveawayNotifications, error: giveawayError } = await supabase
    .from('notifications')
    .select(`
      *,
      giveaway_claims(claimer_phone_number)
    `)
    .eq('user_id', userId)
    .eq('type', 'general')
    .ilike('title', '%Giveaway Claimed!%') // Case-insensitive search for the title
    .order('created_at', { ascending: false });

  if (giveawayError) {
    throw new Error(`Failed to fetch giveaway notifications: ${giveawayError.message}`);
  }

  // Fetch other notifications (excluding general ones to avoid duplicates if they are not giveaway claims)
  const { data: otherNotifications, error: otherError } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .not('type', 'eq', 'general') // Exclude 'general' type
    .order('created_at', { ascending: false });

  if (otherError) {
    throw new Error(`Failed to fetch other notifications: ${otherError.message}`);
  }

  // Combine and return all notifications
  // We need to flatten the giveaway_claims relationship if it exists
  const combinedNotifications = [...giveawayNotifications, ...otherNotifications].map(n => {
    if (n.type === 'general' && n.title?.includes('Giveaway Claimed!') && n.giveaway_claims && n.giveaway_claims.length > 0) {
      return {
        ...n,
        claimer_phone_number: n.giveaway_claims[0].claimer_phone_number // Extract phone number
      };
    }
    return n;
  });

  return combinedNotifications as Notification[] || [];
}

export async function getUnreadNotifications(supabase: SupabaseClient, userId: string): Promise<Notification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .eq('is_read', false)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch unread notifications: ${error.message}`);
  }
  return data as Notification[] || [];
}

export async function getNotificationCount(supabase: SupabaseClient, userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) {
    throw new Error(`Failed to fetch notification count: ${error.message}`);
  }
  return count || 0;
}

export async function createNotification(supabase: SupabaseClient, userId: string, notificationData: CreateNotificationInput): Promise<Notification> {
  const { data, error } = await supabase
    .from('notifications')
    .insert({ ...notificationData, user_id: userId })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create notification: ${error.message}`);
  }
  return data as Notification;
}

export async function markNotificationAsRead(supabase: SupabaseClient, notificationId: string): Promise<Notification> {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to mark notification as read: ${error.message}`);
  }
  return data as Notification;
}

export async function markAllNotificationsAsRead(supabase: SupabaseClient, userId: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false); // Only mark unread as read

  if (error) {
    throw new Error(`Failed to mark all notifications as read: ${error.message}`);
  }
}

export async function deleteNotification(supabase: SupabaseClient, notificationId: string): Promise<void> {
  const { error } = await supabase
    .from('seller_notifications')
    .delete()
    .eq('id', notificationId);

  if (error) {
    throw new Error(`Failed to delete notification: ${error.message}`);
  }
}
