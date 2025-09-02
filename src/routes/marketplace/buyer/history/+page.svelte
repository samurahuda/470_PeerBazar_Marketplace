<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
</script>

<div class="container mx-auto p-4">
	<h1 class="text-2xl font-bold mb-4">Purchase History</h1>

	{#if data.purchaseHistory.length === 0}
		<p>You have not purchased any items yet.</p>
	{:else}
		<div class="space-y-4">
			{#each data.purchaseHistory as purchase (purchase.id)}
				<div class="flex items-center gap-4 border p-4 rounded-lg">
					<img 
						src={purchase.product.image_url || 'https://via.placeholder.com/150'} 
						alt={purchase.product.title}
						class="w-24 h-24 object-cover rounded-md"
					/>
					<div class="flex-1">
						<h4 class="font-bold text-lg">{purchase.product.title}</h4>
						<p class="text-gray-600">Purchased on: {formatDate(purchase.purchase_date)}</p>
						<p class="text-gray-800 font-semibold">Price: ${purchase.price}</p>
						<p class="capitalize text-sm"
						   class:text-green-600={purchase.status === 'completed'}
						   class:text-yellow-600={purchase.status === 'pending'}
						   class:text-red-600={purchase.status === 'cancelled'}
						>
							Status: {purchase.status}
						</p>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>