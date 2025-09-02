<script lang="ts">
  import type { PageData } from './$types';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { page } from '$app/stores';

  export let data: PageData;

  $: ({ products, error } = data);

  let searchTerm = $page.url.searchParams.get('search') || '';
  let maxPrice = $page.url.searchParams.get('maxPrice') || '';

</script>

<div class="space-y-4">
  <div class="flex justify-between items-center">
    <h2 class="text-xl font-semibold">Buy Products</h2>
    <div class="flex space-x-2">
      <a href="/marketplace/jobs">
        <Button variant="outline">View Job Opportunities</Button>
      </a>
      <a href="/marketplace/wishlist">
        <Button variant="outline">My Wishlist</Button>
      </a>
      <a href="/marketplace/giveaways">
        <Button variant="outline">View Giveaways</Button>
      </a>
    </div>
  </div>

  <!-- Search Bar Section -->
  <Card.Root class="p-4 border-pink-200 bg-pink-50">
    <form method="GET" class="flex flex-col md:flex-row gap-4 items-end">
      <div class="flex-1">
        <Label for="search">Search Keyword</Label>
        <Input id="search" name="search" placeholder="e.g., laptop, book" bind:value={searchTerm} class="border-pink-300 focus:border-pink-500 focus:ring-pink-500" />
      </div>
      <div class="w-full md:w-auto">
        <Label for="maxPrice">Max Price</Label>
        <Input id="maxPrice" name="maxPrice" type="number" step="0.01" placeholder="e.g., 100.00" bind:value={maxPrice} class="border-pink-300 focus:border-pink-500 focus:ring-pink-500" />
      </div>
      <Button type="submit" class="bg-pink-600 hover:bg-pink-700 text-white">Search</Button>
      {#if searchTerm || maxPrice}
        <Button type="button" on:click={() => { searchTerm = ''; maxPrice = ''; }} class="bg-gray-400 hover:bg-gray-500 text-white">Clear</Button>
      {/if}
    </form>
  </Card.Root>

  {#if error}
    <div class="text-red-500 bg-red-100 border border-red-400 rounded p-4">
      <p>Error loading products: {error}</p>
    </div>
  {/if}

  {#if products && products.length > 0}
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {#each products as product (product.id)}
        <a href={`/marketplace/product/${product.id}`}>
          <Card.Root class="overflow-hidden hover:shadow-lg transition-shadow border-pink-200 bg-pink-50">
            <img 
              src={product.image_url || 'https://via.placeholder.com/300'} 
              alt={product.title} 
              class="w-full h-48 object-cover"
            />
            <Card.Header>
              <Card.Title class="truncate text-pink-800">{product.title}</Card.Title>
              <Card.Description class="font-bold text-lg text-pink-600">${product.price}</Card.Description>
            </Card.Header>
          </Card.Root>
        </a>
      {/each}
    </div>
  {:else if !error}
    <div class="text-center py-12">
      <p class="text-gray-500">No products available at the moment. Check back later!</p>
    </div>
  {/if}
</div>
