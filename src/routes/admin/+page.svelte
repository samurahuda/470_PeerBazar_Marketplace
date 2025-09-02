<script lang="ts">
    import { onMount } from 'svelte';
  </script>
  
  <svelte:head>
    <title>Admin Dashboard</title>
  </svelte:head>
  
  <div class="min-h-screen bg-white text-gray-900">
    <!-- Universe Link -->
    <a href="/" class="absolute top-4 left-4 z-10 text-sm font-extrabold leading-tight text-gray-900 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/60">
      UNI<br/>VERSE
    </a>
    
    <div class="pt-16 px-6 py-8">
      <div class="max-w-7xl mx-auto space-y-6">
        <!-- Welcome Section -->
        <div class="bg-white shadow rounded-lg p-6 border border-gray-200">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome to Admin Dashboard</h1>
          <p class="text-gray-600">Manage your platform's content and events</p>
        </div>
        
        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <a 
            href="/admin/events"
            class="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow border border-gray-200 hover:border-gray-300"
          >
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">Events</h3>
                <p class="text-gray-600">Create and manage events</p>
              </div>
            </div>
          </a>
          
          <a 
            href="/admin/library"
            class="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow border border-gray-200 hover:border-gray-300"
          >
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">Library Management</h3>
                <p class="text-gray-600">Manage books and library resources</p>
              </div>
            </div>
          </a>
          
          <!-- Add more admin sections here as needed -->
        </div>
      </div>
    </div>
  </div>