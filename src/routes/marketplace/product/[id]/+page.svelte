<script lang="ts">
  import type { PageData, ActionData } from './$types';
  import { enhance } from '$app/forms';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';

  export let data: PageData;
  export let form: ActionData;
</script>

<div class="container mx-auto py-8">
  {#if data.error}
    <p class="text-red-500">{data.error}</p>
  {:else if data.product}
    <div class="grid md:grid-cols-2 gap-8">
      <div>
        <img 
          src={data.product.image_url || 'https://via.placeholder.com/500'} 
          alt={data.product.title} 
          class="w-full rounded-lg shadow-lg"
        />
      </div>
      <div class="space-y-4">
        <h1 class="text-3xl font-bold text-pink-800">{data.product.title}</h1>
        <p class="text-2xl font-semibold text-pink-600">${data.product.price}</p>
        <p class="text-pink-700">{data.product.description || 'No description available.'}</p>
        
        <div class="flex space-x-2">
            {#if data.product.brand}<span class="bg-pink-200 text-pink-800 px-2 py-1 rounded-full text-sm">{data.product.brand}</span>{/if}
            {#if data.product.color}<span class="bg-pink-200 text-pink-800 px-2 py-1 rounded-full text-sm">{data.product.color}</span>{/if}
            {#if data.product.size}<span class="bg-pink-200 text-pink-800 px-2 py-1 rounded-full text-sm">{data.product.size}</span>{/if}
        </div>

        <Card.Root class="border-pink-200 bg-pink-50">
          <Card.Header><Card.Title class="text-pink-800">Purchase this Item</Card.Title></Card.Header>
          <Card.Content>
            <form method="POST" action="?/purchase" use:enhance class="space-y-4">
              <div>
                <Label for="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" placeholder="Enter your phone number to coordinate" required />
              </div>
              <Button type="submit" class="w-full bg-pink-500 hover:bg-pink-600 text-white">Purchase</Button>
              {#if form?.error}
                <p class="text-red-500 text-sm">{form.error}</p>
              {/if}
            </form>
          </Card.Content>
        </Card.Root>

        <form method="POST" action="?/toggleWishlist" use:enhance>
            <Button type="submit" variant="outline" class="w-full border-pink-500 text-pink-700 hover:bg-pink-50">
                {data.isWished ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </Button>
        </form>
      </div>
    </div>
  {/if}
</div>