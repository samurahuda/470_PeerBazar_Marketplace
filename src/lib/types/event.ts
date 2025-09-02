export interface Event {
    id: string;
    title: string;
    description: string | null;
    event_type: 'event' | 'ad' | 'announcement';
    event_date: string | null;
    location: string | null;
    image_url: string | null;
    created_by: string;
    created_at: string;
    updated_at: string;
    is_active: boolean;
  }
  
  export interface CreateEventInput {
    title: string;
    description?: string;
    event_type: 'event' | 'ad' | 'announcement';
    event_date?: string;
    location?: string;
    image_url?: string;
  }
  
  export interface UpdateEventInput {
    title?: string;
    description?: string;
    event_type?: 'event' | 'ad' | 'announcement';
    event_date?: string;
    location?: string;
    image_url?: string;
    is_active?: boolean;
  }

  export interface EventReminder {
    id: string;
    user_id: string;
    event_id: string;
    reminder_time: string;
    is_sent: boolean;
    created_at: string;
  }

  export interface CreateEventReminderInput {
    event_id: string;
    reminder_time: string;
  }

  export interface Notification {
    id: string;
    user_id: string;
    title: string;
    message: string;
    type: 'study_room' | 'event' | 'transaction' | 'food_order' | 'general' | 'banner_request';
    is_read: boolean;
    action_url?: string;
    created_at: string;
    expires_at?: string;
  }

  export interface CreateNotificationInput {
    title: string;
    message: string;
    type: 'study_room' | 'event' | 'transaction' | 'food_order' | 'general' | 'banner_request' | 'product_purchase' | 'job_application';
    action_url?: string;
    expires_at?: string;
  }