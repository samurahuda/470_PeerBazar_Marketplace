import { supabase } from '$lib/supabase';
import { EventController } from '$lib/controllers/event.controller';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
  const eventController = new EventController(supabase);
  
  // Get all events for admin view
  const result = await eventController.getAllEvents();
  
  return {
    events: result.success ? result.data : [],
    error: result.success ? null : result.error
  };
};

export const actions: Actions = {
  createEvent: async ({ request, locals }) => {
    console.log('createEvent action started');
    
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const eventType = formData.get('eventType') as 'event' | 'ad' | 'announcement';
    const date = formData.get('date') as string;
    const time = formData.get('time') as string;
    const location = formData.get('location') as string;
    const imageFile = formData.get('imageFile') as File;

    console.log('Form data received:', { title, eventType, date, time, location, hasImage: !!imageFile });

    // Get current user from session
    const { data: { session } } = await locals.supabase.auth.getSession();
    if (!session?.user) {
      console.log('No session found, returning unauthorized');
      return fail(401, { error: 'Unauthorized' });
    }

    const user = session.user;
    console.log('User authenticated:', user.id);

    // Check if user is admin using the database function
    const { data: userRole, error: roleError } = await locals.supabase.rpc('get_user_role', {
      user_id: user.id
    });

    console.log('User role check:', { userRole, roleError });

    if (roleError || userRole !== 'admin') {
      console.log('User is not admin, returning forbidden');
      return fail(403, { error: 'Admin access required' });
    }

    console.log('User is admin, proceeding with event creation');

    // Handle image upload to Supabase Storage
    let imageUrl: string | undefined = undefined;
    if (imageFile && imageFile.size > 0) {
      try {
        console.log('Processing image upload');
        
        // Validate file type
        if (!imageFile.type.startsWith('image/')) {
          console.log('Invalid file type:', imageFile.type);
          return fail(400, { error: 'Please upload a valid image file' });
        }

        // Validate file size (max 5MB)
        if (imageFile.size > 5 * 1024 * 1024) {
          console.log('File too large:', imageFile.size);
          return fail(400, { error: 'Image file size must be less than 5MB' });
        }

        // Generate unique filename
        const fileExtension = imageFile.name.split('.').pop();
        const fileName = `event_${Date.now()}.${fileExtension}`;

        console.log('Uploading file:', fileName);

        // Convert file to buffer
        const arrayBuffer = await imageFile.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await locals.supabase.storage
          .from('event-images')
          .upload(fileName, fileBuffer, {
            contentType: imageFile.type,
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          return fail(500, { error: 'Failed to upload image to storage' });
        }

        console.log('File uploaded successfully');

        // Get public URL for the uploaded image
        const { data: { publicUrl } } = locals.supabase.storage
          .from('event-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
        console.log('Image URL generated:', imageUrl);
      } catch (error) {
        console.error('Image upload error:', error);
        return fail(500, { error: 'Failed to upload image' });
      }
    } else {
      console.log('No image file provided');
    }

    // Combine date and time
    let eventDate: string | undefined = undefined;
    if (date && time) {
      eventDate = new Date(`${date}T${time}`).toISOString();
    } else if (date) {
      eventDate = new Date(date).toISOString();
    }

    console.log('Event date:', eventDate);

    const eventController = new EventController(locals.supabase);
    const result = await eventController.createEvent(user.id, {
      title,
      description: description || undefined,
      event_type: eventType,
      event_date: eventDate,
      location: location || undefined,
      image_url: imageUrl || undefined
    });

    console.log('Event creation result:', result);

    if (result.success) {
      console.log('Event created successfully, returning success');
      return { success: true, event: result.data };
    } else {
      console.log('Event creation failed:', result.error);
      return fail(400, { error: result.error });
    }
  },

  deleteEvent: async ({ request, locals }) => {
    const formData = await request.formData();
    const eventId = formData.get('eventId') as string;

    // Get current user and check admin status
    const { data: { session } } = await locals.supabase.auth.getSession();
    if (!session?.user) {
      return fail(401, { error: 'Unauthorized' });
    }

    const user = session.user;
    const { data: userRole, error: roleError } = await locals.supabase.rpc('get_user_role', {
      user_id: user.id
    });

    if (roleError || userRole !== 'admin') {
      return fail(403, { error: 'Admin access required' });
    }

    const eventController = new EventController(locals.supabase);
    const result = await eventController.deleteEvent(eventId);

    if (result.success) {
      return { success: true };
    } else {
      return fail(400, { error: result.error });
    }
  },

  toggleEventActive: async ({ request, locals }) => {
    const formData = await request.formData();
    const eventId = formData.get('eventId') as string;
    const isActive = formData.get('isActive') === 'true';

    // Get current user and check admin status
    const { data: { session } } = await locals.supabase.auth.getSession();
    if (!session?.user) {
      return fail(401, { error: 'Unauthorized' });
    }

    const user = session.user;
    const { data: userRole, error: roleError } = await locals.supabase.rpc('get_user_role', {
      user_id: user.id
    });

    if (roleError || userRole !== 'admin') {
      return fail(403, { error: 'Admin access required' });
    }

    const eventController = new EventController(locals.supabase);
    const result = await eventController.toggleEventActive(eventId, isActive);

    if (result.success) {
      return { success: true, event: result.data };
    } else {
      return fail(400, { error: result.error });
    }
  }
};
