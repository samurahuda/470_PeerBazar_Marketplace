import type { SupabaseClient } from '@supabase/supabase-js';
import type { Event, CreateEventInput, UpdateEventInput, EventReminder, CreateEventReminderInput } from '$lib/types/event';
import * as eventRepository from '$lib/repositories/event.repository';
import { NotificationService } from './notification.service';

export class EventService {
  private notificationService: NotificationService;

  constructor(private supabase: SupabaseClient) {
    this.notificationService = new NotificationService(supabase);
  }

  async getAllEvents(): Promise<Event[]> {
    return await eventRepository.getAllEvents(this.supabase);
  }

  async getActiveEvents(): Promise<Event[]> {
    return await eventRepository.getActiveEvents(this.supabase);
  }

  async getEventById(eventId: string): Promise<Event | null> {
    return await eventRepository.getEventById(this.supabase, eventId);
  }

  async createEvent(userId: string, eventData: CreateEventInput): Promise<Event> {
    // Business logic validation
    if (!eventData.title.trim()) {
      throw new Error('Event title is required');
    }

    if (eventData.event_date) {
      const eventDate = new Date(eventData.event_date);
      if (isNaN(eventDate.getTime())) {
        throw new Error('Invalid event date');
      }
    }

    return await eventRepository.createEvent(this.supabase, userId, eventData);
  }

  async updateEvent(eventId: string, updates: UpdateEventInput): Promise<Event> {
    // Business logic validation
    if (updates.title && !updates.title.trim()) {
      throw new Error('Event title cannot be empty');
    }

    if (updates.event_date) {
      const eventDate = new Date(updates.event_date);
      if (isNaN(eventDate.getTime())) {
        throw new Error('Invalid event date');
      }
    }

    return await eventRepository.updateEvent(this.supabase, eventId, updates);
  }

  async deleteEvent(eventId: string): Promise<void> {
    return await eventRepository.deleteEvent(this.supabase, eventId);
  }

  async toggleEventActive(eventId: string, isActive: boolean): Promise<Event> {
    return await eventRepository.toggleEventActive(this.supabase, eventId, isActive);
  }

  async getEventsByType(eventType: 'event' | 'ad' | 'announcement'): Promise<Event[]> {
    const allEvents = await this.getAllEvents();
    return allEvents.filter(event => event.event_type === eventType);
  }

  // Event Reminder Methods
  async createEventReminder(userId: string, reminderData: CreateEventReminderInput): Promise<EventReminder> {
    // Business logic validation
    if (!reminderData.event_id) {
      throw new Error('Event ID is required');
    }

    if (!reminderData.reminder_time) {
      throw new Error('Reminder time is required');
    }

    const reminderDate = new Date(reminderData.reminder_time);
    if (isNaN(reminderDate.getTime())) {
      throw new Error('Invalid reminder time');
    }

    // Check if event exists
    const event = await this.getEventById(reminderData.event_id);
    if (!event) {
      throw new Error('Event not found');
    }

    // Check if user already has a reminder for this event
    const existingReminder = await eventRepository.getEventReminderByEvent(this.supabase, userId, reminderData.event_id);
    if (existingReminder) {
      throw new Error('You already have a reminder set for this event');
    }

    // Create the reminder
    const reminder = await eventRepository.createEventReminder(this.supabase, userId, reminderData);

    // Create a notification for the reminder
    await this.notificationService.createEventReminderNotification(userId, reminderData.event_id, reminderData.reminder_time);

    return reminder;
  }

  async getUserEventReminders(userId: string): Promise<EventReminder[]> {
    return await eventRepository.getUserEventReminders(this.supabase, userId);
  }

  async getEventReminderByEvent(userId: string, eventId: string): Promise<EventReminder | null> {
    return await eventRepository.getEventReminderByEvent(this.supabase, userId, eventId);
  }

  async deleteEventReminder(reminderId: string): Promise<void> {
    return await eventRepository.deleteEventReminder(this.supabase, reminderId);
  }
}
