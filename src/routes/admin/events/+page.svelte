<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  import type { PageData } from './$types';
  
  export let data: PageData;
  
  let eventForm = {
    title: '',
    description: '',
    eventType: 'event' as 'event' | 'ad' | 'announcement',
    date: '',
    time: '',
    location: ''
  };
  
  let imageFile: FileList | null = null;
  let isSubmitting = false;
  let events = data.events || [];
  
  function resetForm() {
    eventForm = {
      title: '',
      description: '',
      eventType: 'event',
      date: '',
      time: '',
      location: ''
    };
    imageFile = null;
  }
  
  function handleDeleteEvent(eventId: string) {
    if (confirm('Are you sure you want to delete this event?')) {
      const form = new FormData();
      form.append('eventId', eventId);
      
      fetch('?/deleteEvent', {
        method: 'POST',
        body: form
      }).then(() => {
        // Refresh the page to update the events list
        window.location.reload();
      });
    }
  }
  
  function handleToggleEvent(eventId: string, currentStatus: boolean) {
    const form = new FormData();
    form.append('eventId', eventId);
    form.append('isActive', (!currentStatus).toString());
    
    fetch('?/toggleEventActive', {
      method: 'POST',
      body: form
    }).then(() => {
      // Refresh the page to update the events list
      window.location.reload();
    });
  }
</script>

<svelte:head>
  <title>Admin - Events Management</title>
</svelte:head>

<div class="min-h-screen bg-white text-gray-900">
  <!-- Universe Link -->
  <a href="/" class="absolute top-4 left-4 z-10 text-sm font-extrabold leading-tight text-gray-900 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/60">
    UNI<br/>VERSE
  </a>
  
  <div class="pt-16 px-6 py-8">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header -->
      <div class="bg-white shadow rounded-lg p-6 border border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Events Management</h2>
        <p class="text-gray-600">Create and manage events for your platform</p>
      </div>
  
      <!-- Create Event Form -->
      <div class="bg-white shadow rounded-lg p-6 border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Create New Event</h3>
        
        <!-- Success/Error Messages -->
        {#if (data as any).success}
          <div class="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p class="text-green-800">Event created successfully! Redirecting to dashboard...</p>
          </div>
        {:else if (data as any).error}
          <div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p class="text-red-800">Error: {(data as any).error}</p>
          </div>
        {/if}
        
        <form method="POST" action="?/createEvent" enctype="multipart/form-data" data-form-id="create-event-form" use:enhance={() => {
          isSubmitting = true;
          console.log('Form submission started');
          return async ({ result }) => {
            isSubmitting = false;
            console.log('Form submission result:', result);
            
            if (result.type === 'success') {
              console.log('Event created successfully');
              resetForm();
              // Redirect to admin dashboard after 2 seconds
              setTimeout(() => {
                window.location.href = '/admin';
              }, 2000);
            } else if (result.type === 'failure') {
              console.error('Form submission failed:', result.data);
            }
          };
        }} class="space-y-6">
          <!-- Event Title -->
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
              Event Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              bind:value={eventForm.title}
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white text-gray-900 placeholder-gray-500"
              placeholder="Enter event title"
            />
          </div>
          
          <!-- Event Type -->
          <div>
            <label for="eventType" class="block text-sm font-medium text-gray-700 mb-2">
              Event Type *
            </label>
            <select
              id="eventType"
              name="eventType"
              bind:value={eventForm.eventType}
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white text-gray-900"
            >
              <option value="event">Event</option>
              <option value="ad">Advertisement</option>
              <option value="announcement">Announcement</option>
            </select>
          </div>
          
          <!-- Event Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              bind:value={eventForm.description}
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white text-gray-900 placeholder-gray-500"
              placeholder="Enter event description"
            ></textarea>
          </div>
          
          <!-- Date and Time -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="date" class="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                id="date"
                name="date"
                type="date"
                bind:value={eventForm.date}
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white text-gray-900"
              />
            </div>
            
            <div>
              <label for="time" class="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <input
                id="time"
                name="time"
                type="time"
                bind:value={eventForm.time}
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white text-gray-900"
              />
            </div>
          </div>
          
          <!-- Location -->
          <div>
            <label for="location" class="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              bind:value={eventForm.location}
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white text-gray-900 placeholder-gray-500"
              placeholder="Enter event location"
            />
          </div>
          
          <!-- Image Upload -->
          <div>
            <label for="imageFile" class="block text-sm font-medium text-gray-700 mb-2">
              Event Image
            </label>
            <input
              id="imageFile"
              name="imageFile"
              type="file"
              accept="image/*"
              bind:files={imageFile}
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white text-gray-900"
            />
            <p class="mt-1 text-sm text-gray-500">Upload an image file (JPG, PNG, GIF) - Max 5MB</p>
          </div>
          
          <!-- Submit Button -->
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              on:click={resetForm}
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-100 bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
      
      <!-- Events List -->
      <div class="bg-white shadow rounded-lg p-6 border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">All Events</h3>
        
        {#if events.length === 0}
          <p class="text-gray-500 text-center py-8">No events created yet.</p>
        {:else}
          <div class="space-y-4">
            {#each events as event (event.id)}
              <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div class="flex items-start justify-between">
                  <div class="flex items-start space-x-4">
                    {#if event.image_url}
                      <img 
                        src={event.image_url} 
                        alt={event.title}
                        class="w-16 h-16 object-cover rounded-md"
                      />
                    {/if}
                    <div class="flex-1">
                      <div class="flex items-center space-x-2 mb-1">
                        <h4 class="font-semibold text-gray-900">{event.title}</h4>
                        <span class="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                          {event.event_type}
                        </span>
                        <span class="px-2 py-1 text-xs rounded-full {event.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                          {event.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p class="text-gray-600 text-sm">{event.description}</p>
                      {#if event.event_date}
                        <p class="text-gray-600 text-sm mt-2">
                          {new Date(event.event_date).toLocaleDateString()} 
                          {new Date(event.event_date).toLocaleTimeString()}
                        </p>
                      {/if}
                      {#if event.location}
                        <p class="text-gray-600 text-sm">📍 {event.location}</p>
                      {/if}
                    </div>
                  </div>
                  <div class="flex space-x-2">
                    <button
                      on:click={() => handleToggleEvent(event.id, event.is_active)}
                      class="px-3 py-1 text-xs rounded border {event.is_active ? 'border-red-300 text-red-700 hover:bg-red-50' : 'border-green-300 text-green-700 hover:bg-green-50'}"
                    >
                      {event.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      on:click={() => handleDeleteEvent(event.id)}
                      class="px-3 py-1 text-xs rounded border border-red-300 text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>