import type { SupabaseClient } from '@supabase/supabase-js';
import type { Event, CreateEventInput, UpdateEventInput, EventReminder, CreateEventReminderInput } from '$lib/types/event';

export async function getAllEvents(supabase: SupabaseClient): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch events: ${error.message}`);
  }

  return data || [];
}

export async function getActiveEvents(supabase: SupabaseClient): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch active events: ${error.message}`);
  }

  return data || [];
}

export async function getEventById(supabase: SupabaseClient, eventId: string): Promise<Event | null> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // No rows returned
    }
    throw new Error(`Failed to fetch event: ${error.message}`);
  }

  return data;
}

export async function createEvent(supabase: SupabaseClient, userId: string, eventData: CreateEventInput): Promise<Event> {
  const { data, error } = await supabase
    .from('events')
    .insert({
      ...eventData,
      created_by: userId
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create event: ${error.message}`);
  }

  return data;
}

export async function updateEvent(supabase: SupabaseClient, eventId: string, updates: UpdateEventInput): Promise<Event> {
  const { data, error } = await supabase
    .from('events')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', eventId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update event: ${error.message}`);
  }

  return data;
}

export async function deleteEvent(supabase: SupabaseClient, eventId: string): Promise<void> {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId);

  if (error) {
    throw new Error(`Failed to delete event: ${error.message}`);
  }
}

export async function toggleEventActive(supabase: SupabaseClient, eventId: string, isActive: boolean): Promise<Event> {
  const { data, error } = await supabase
    .from('events')
    .update({
      is_active: isActive,
      updated_at: new Date().toISOString()
    })
    .eq('id', eventId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to toggle event active status: ${error.message}`);
  }

  return data;
}

// Event Reminder Functions
export async function createEventReminder(supabase: SupabaseClient, userId: string, reminderData: CreateEventReminderInput): Promise<EventReminder> {
  const { data, error } = await supabase
    .from('event_reminders')
    .insert({
      event_id: reminderData.event_id,
      reminder_time: reminderData.reminder_time,
      user_id: userId
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create event reminder: ${error.message}`);
  }

  return data;
}

export async function getUserEventReminders(supabase: SupabaseClient, userId: string): Promise<EventReminder[]> {
  const { data, error } = await supabase
    .from('event_reminders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch user event reminders: ${error.message}`);
  }

  return data || [];
}

export async function getEventReminderByEvent(supabase: SupabaseClient, userId: string, eventId: string): Promise<EventReminder | null> {
  const { data, error } = await supabase
    .from('event_reminders')
    .select('*')
    .eq('user_id', userId)
    .eq('event_id', eventId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // No rows returned
    }
    throw new Error(`Failed to fetch event reminder: ${error.message}`);
  }

  return data;
}

export async function deleteEventReminder(supabase: SupabaseClient, reminderId: string): Promise<void> {
  const { error } = await supabase
    .from('event_reminders')
    .delete()
    .eq('id', reminderId);

  if (error) {
    throw new Error(`Failed to delete event reminder: ${error.message}`);
  }
}
