<script lang="ts">
  import { page } from '$app/stores';
  import * as Card from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";

  $: isBuyerPage = $page.url.pathname.startsWith('/marketplace/buyer');
  $: isSellerPage = $page.url.pathname.startsWith('/marketplace/seller');
</script>

<div class="container mx-auto p-4">
  <Card.Root class="mb-4 bg-pink-50 border-pink-200">
    <Card.Header>
			<Card.Title class="text-2xl font-bold text-pink-700">Marketplace</Card.Title>
			<Card.Description class="text-pink-600">Your one-stop shop for university essentials.</Card.Description>
    </Card.Header>
    <Card.Content class="flex justify-between items-center">
      <div class="flex space-x-2">
        <a href="/marketplace/buyer">
          <Button class="bg-pink-500 hover:bg-pink-600 text-white" variant={isBuyerPage ? 'default' : 'outline'}>Buyer</Button>
        </a>
        <a href="/marketplace/seller">
          <Button class="bg-pink-500 hover:bg-pink-600 text-white" variant={isSellerPage ? 'default' : 'outline'}>Seller</Button>
        </a>
      </div>
			<a href="/marketplace/buyer/history">
				<Button class="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600">History</Button>
			</a>
    </Card.Content>
  </Card.Root>

  <main>
    <slot />
  </main>
</div>
