<script lang="ts">
  import type { PageData } from './$types';
  import * as Card from '$lib/components/ui/card';

  export let data: PageData;

  $: ({ wishlist, error } = data);
</script>

<div class="space-y-4">
  <h2 class="text-xl font-semibold">My Wishlist</h2>

  {#if error}
    <p class="text-red-500">{error}</p>
  {/if}

  {#if wishlist && wishlist.length > 0}
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {#each wishlist as item (item.id)}
        <a href={`/marketplace/product/${item.product_id}`}>
          <Card.Root class="overflow-hidden hover:shadow-lg transition-shadow border-pink-200 bg-pink-50">
            <img 
              src={item.product_listings.image_url || 'https://via.placeholder.com/300'} 
              alt={item.product_listings.title} 
              class="w-full h-48 object-cover"
            />
            <Card.Header>
              <Card.Title class="truncate text-pink-800">{item.product_listings.title}</Card.Title>
              <Card.Description class="font-bold text-lg text-pink-600">${item.product_listings.price}</Card.Description>
            </Card.Header>
          </Card.Root>
        </a>
      {/each}
    </div>
  {:else if !error}
    <div class="text-center py-12">
      <p class="text-gray-500">Your wishlist is empty. Start adding items you love!</p>
    </div>
  {/if}
</div>
