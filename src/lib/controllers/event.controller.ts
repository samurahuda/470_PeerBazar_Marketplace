import type { SupabaseClient } from '@supabase/supabase-js';
import type { CreateEventInput, UpdateEventInput, CreateEventReminderInput } from '$lib/types/event';
import { EventService } from '$lib/services/event.service';

export class EventController {
  private eventService: EventService;

  constructor(supabase: SupabaseClient) {
    this.eventService = new EventService(supabase);
  }

  async getAllEvents() {
    try {
      const events = await this.eventService.getAllEvents();
      return { success: true, data: events };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  async getActiveEvents() {
    try {
      const events = await this.eventService.getActiveEvents();
      return { success: true, data: events };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  async getEventById(eventId: string) {
    try {
      const event = await this.eventService.getEventById(eventId);
      if (!event) {
        return { success: false, error: 'Event not found' };
      }
      return { success: true, data: event };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  async createEvent(userId: string, eventData: CreateEventInput) {
    try {
      const event = await this.eventService.createEvent(userId, eventData);
      return { success: true, data: event };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  async updateEvent(eventId: string, updates: UpdateEventInput) {
    try {
      const event = await this.eventService.updateEvent(eventId, updates);
      return { success: true, data: event };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  async deleteEvent(eventId: string) {
    try {
      await this.eventService.deleteEvent(eventId);
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  async toggleEventActive(eventId: string, isActive: boolean) {
    try {
      const event = await this.eventService.toggleEventActive(eventId, isActive);
      return { success: true, data: event };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  // Event Reminder Methods
  async createEventReminder(userId: string, reminderData: CreateEventReminderInput) {
    try {
      const reminder = await this.eventService.createEventReminder(userId, reminderData);
      return { success: true, data: reminder };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  async getUserEventReminders(userId: string) {
    try {
      const reminders = await this.eventService.getUserEventReminders(userId);
      return { success: true, data: reminders };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  async getEventReminderByEvent(userId: string, eventId: string) {
    try {
      const reminder = await this.eventService.getEventReminderByEvent(userId, eventId);
      return { success: true, data: reminder };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  async deleteEventReminder(reminderId: string) {
    try {
      await this.eventService.deleteEventReminder(reminderId);
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }
}
