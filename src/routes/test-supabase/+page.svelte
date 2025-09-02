<script lang="ts">
  import { onMount } from 'svelte'
  import { testConnection, testDatabaseAccess } from '$lib/test-supabase'
  
  let connectionStatus = 'Testing...'
  let databaseStatus = 'Testing...'
  let isLoading = true
  
  onMount(async () => {
    try {
      // Test basic connection
      const connResult = await testConnection()
      if (connResult.success) {
        connectionStatus = 'âœ… Supabase client connection successful!'
      } else {
        connectionStatus = `âŒ Connection failed: ${connResult.error?.message || 'Unknown error'}`
      }
      
      // Test database access
      const dbResult = await testDatabaseAccess()
      if (dbResult.success) {
        databaseStatus = `âœ… ${dbResult.message || 'Database connection successful!'}`
      } else {
        databaseStatus = `âŒ Database failed: ${dbResult.error?.message || 'Unknown error'}`
      }
      
    } catch (err) {
      connectionStatus = `âŒ Error: ${err}`
      databaseStatus = `âŒ Error: ${err}`
    } finally {
      isLoading = false
    }
  })
</script>

<div class="p-8">
  <h1 class="text-2xl font-bold mb-4">Supabase Connection Test</h1>
  
  {#if isLoading}
    <p class="text-blue-600">í´„ Testing connections...</p>
  {:else}
    <div class="space-y-4">
      <div>
        <h2 class="text-lg font-semibold">Client Connection:</h2>
        <p class="text-lg">{connectionStatus}</p>
      </div>
      
      <div>
        <h2 class="text-lg font-semibold">Database Access:</h2>
        <p class="text-lg">{databaseStatus}</p>
      </div>
      
      {#if connectionStatus.includes('âœ…')}
        <div class="mt-6 p-4 bg-green-100 rounded-lg">
          <h3 class="text-green-800 font-semibold">í¾‰ Setup Complete!</h3>
          <p class="text-green-700">Your Supabase is ready to use. You can now:</p>
          <ul class="text-green-700 mt-2 ml-4 list-disc">
            <li>Create database tables</li>
            <li>Implement authentication</li>
            <li>Build your application features</li>
          </ul>
        </div>
      {/if}
    </div>
  {/if}
  
  <div class="mt-6">
    <a href="/" class="text-blue-500 hover:underline">â† Back to Home</a>
  </div>
</div>
