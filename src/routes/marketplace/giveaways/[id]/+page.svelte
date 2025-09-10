<script lang="ts">
  import type { PageData, ActionData } from './$types';
  import { enhance } from '$app/forms';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { invalidateAll } from '$app/navigation';

  export let data: PageData;
  export let form: ActionData;
</script>

<div class="space-y-6">
  {#if data.giveaway}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <img src={data.giveaway.image_url || 'https://via.placeholder.com/500'} alt={data.giveaway.title} class="w-full h-auto rounded-lg shadow-lg">
      </div>
      <div class="space-y-4">
        <h1 class="text-3xl font-bold">{data.giveaway.title}</h1>
        <p class="text-gray-600">{data.giveaway.description}</p>

        {#if data.giveaway.status === 'available'}
          <div class="p-4 border rounded-lg bg-gray-50">
            <h3 class="text-lg font-semibold mb-2">Claim this Item</h3>
            <form 
              method="POST" 
              action="?/claimGiveaway" 
              use:enhance={() => {
                return async ({ result }) => {
                  if (result.type === 'success') {
                    await invalidateAll();
                  }
                };
              }}
              class="space-y-3"
            >
              <div>
                <Label for="phone_number">Phone Number</Label>
                <Input id="phone_number" name="phone_number" type="tel" required placeholder="Enter your phone number" />
              </div>
              <Button type="submit">Claim Now</Button>
              {#if form?.success}
                <p class="text-green-500">{form.message}</p>
              {:else if form?.error}
                <p class="text-red-500">{form.error}</p>
              {/if}
            </form>
          </div>
        {:else}
          <div class="p-4 border rounded-lg bg-yellow-50 text-yellow-800">
            <h3 class="text-lg font-semibold">This item has been claimed.</h3>
          </div>
        {/if}
      </div>
    </div>
  {:else if data.error}
    <p class="text-red-500">Error: {data.error}</p>
  {:else}
    <p>Giveaway not found.</p>
  {/if}
</div>
