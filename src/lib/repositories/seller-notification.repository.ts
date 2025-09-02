import { supabaseAdmin } from '../server/supabaseAdmin';
import type { SupabaseClient } from '@supabase/supabase-js';

// Define a type for seller notifications
export interface SellerNotification {
  id: string;
  user_id: string; // The seller's user ID
  title: string;
  message: string;
  type: 'product_purchase' | 'job_application' | 'general'; // Specific types for marketplace
  is_read: boolean;
  action_url?: string;
  created_at: string;
  product_id?: string; // Optional: ID of the product involved
  job_id?: string;    // Optional: ID of the job involved
}

export interface CreateSellerNotificationInput {
  user_id: string;
  title: string;
  message: string;
  type: 'product_purchase' | 'job_application' | 'general';
  action_url?: string;
  product_id?: string;
  job_id?: string;
}

export async function getSellerNotifications(supabase: SupabaseClient, userId: string): Promise<SellerNotification[]> {
  const { data, error } = await supabase
    .from('seller_notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch seller notifications: ${error.message}`);
  }
  return data as SellerNotification[] || [];
}

export async function createSellerNotification(notificationData: CreateSellerNotificationInput): Promise<SellerNotification> {
  console.log('Inside createSellerNotification. Data:', notificationData); // Log data being inserted
  const { data, error } = await supabaseAdmin
    .from('seller_notifications')
    .insert(notificationData)
    .select()
    .single();

  if (error) {
    console.error('Error inserting into seller_notifications:', error); // Log insertion error
    throw new Error(`Failed to create seller notification: ${error.message}`);
  }
  console.log('Successfully inserted into seller_notifications. Data:', data); // Log successful insertion
  return data as SellerNotification;
}

// You might also want to add markAsRead, delete, etc. later if needed.