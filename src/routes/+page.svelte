<!-- <h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<form method="POST" action="?/logout" style="margin-top: 1rem;">
  <button type="submit" style="padding: 0.5rem 1rem; border: 1px solid hsl(215 25% 27%); border-radius: 8px; background: hsl(215 25% 72%);">
    Mock Logout
  </button>
  <p style="font-size: 0.85rem; color: #555; margin-top: 0.25rem;">Temporary button to sign out and test different users.</p>
</form> -->


<script lang="ts">
  import { Button } from "$lib/components/ui/button";
</script>

<svelte:head>
  <title>Universe - PeerBazar</title>
  <meta name="description" content="Welcome to Universe, your comprehensive platform for peer-to-peer marketplace and learning" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-hsl(220 13% 91%) to-hsl(220 13% 95%) flex items-center justify-center">
  <div class="max-w-4xl mx-auto px-6 py-12 text-center">
    <!-- Hero Section -->
    <div class="mb-12">
      <h1 class="text-5xl md:text-6xl font-bold text-hsl(220 13% 9%) mb-6">
        Welcome to <span class="text-hsl(220 13% 45%)">Universe</span>
      </h1>
      <p class="text-xl md:text-2xl text-hsl(220 13% 35%) mb-8 max-w-2xl mx-auto">
        Your comprehensive digital library and learning platform. Discover, learn, and grow with our vast collection of resources.
      </p>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
      <Button 
        href="/auth/login" 
        variant="default" 
        size="lg"
        class="w-full sm:w-auto px-8 py-3 text-lg"
      >
        Sign In
      </Button>
      
      <Button 
        href="/marketplace" 
        variant="default" 
        size="lg"
        class="w-full sm:w-auto px-8 py-3 text-lg"
      >
        PeerBazar
      </Button>
    </div>

    <!-- Features Section -->
    <div class="grid md:grid-cols-3 gap-8 mt-16">
      <div class="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-hsl(220 13% 85%)">
        <div class="w-12 h-12 bg-hsl(220 13% 85%) rounded-lg flex items-center justify-center mb-4 mx-auto">
          <svg class="w-6 h-6 text-hsl(220 13% 35%)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-hsl(220 13% 9%) mb-2">Diverse Listings</h3>
        <p class="text-hsl(220 13% 35%)">Discover a wide range of products and services from peers</p>
      </div>

      <div class="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-hsl(220 13% 85%)">
        <div class="w-12 h-12 bg-hsl(220 13% 85%) rounded-lg flex items-center justify-center mb-4 mx-auto">
          <svg class="w-6 h-6 text-hsl(220 13% 35%)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-hsl(220 13% 9%) mb-2">Easy Access</h3>
        <p class="text-hsl(220 13% 35%)">Simple and intuitive interface for seamless browsing</p>
      </div>

      <div class="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-hsl(220 13% 85%)">
        <div class="w-12 h-12 bg-hsl(220 13% 85%) rounded-lg flex items-center justify-center mb-4 mx-auto">
          <svg class="w-6 h-6 text-hsl(220 13% 35%)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-hsl(220 13% 9%) mb-2">Fast & Secure</h3>
        <p class="text-hsl(220 13% 35%)">Quick loading times with secure authentication</p>
      </div>
    </div>

    <!-- Temporary Logout Button (for testing) -->
    <div class="mt-16 pt-8 border-t border-hsl(220 13% 85%)">
      <form method="POST" action="?/logout">
        <Button 
          type="submit" 
          variant="ghost" 
          size="sm"
          class="text-hsl(220 13% 45%) hover:text-hsl(220 13% 25%)"
        >
          Mock Logout
        </Button>
      </form>
      <p class="text-sm text-hsl(220 13% 45%) mt-2">Temporary button to sign out and test different users.</p>
    </div>
  </div>
</div>
