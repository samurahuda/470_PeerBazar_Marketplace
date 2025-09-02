<script lang="ts">
  import type { PageData } from './$types';
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';

  export let data: PageData;
</script>

<div class="space-y-4">
  <h2 class="text-xl font-semibold">Available Giveaways</h2>

  {#if data?.error}
    <p class="text-red-500">{data.error}</p>
  {/if}

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {#if data.giveaways && data.giveaways.length > 0}
      {#each data.giveaways as giveaway (giveaway.id)}
        <a href={`/marketplace/giveaways/${giveaway.id}`}>
          <Card.Root>
            <img src={giveaway.image_url || 'https://via.placeholder.com/300'} alt={giveaway.title} class="w-full h-48 object-cover">
            <Card.Header>
              <Card.Title>{giveaway.title}</Card.Title>
            </Card.Header>
          </Card.Root>
        </a>
      {/each}
    {:else}
      <p>No giveaways available at the moment. Check back later!</p>
    {/if}
  </div>
</div>
