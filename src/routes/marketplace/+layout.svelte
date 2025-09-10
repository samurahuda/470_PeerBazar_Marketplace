<script lang="ts">
  import { page } from '$app/stores';
  import * as Card from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";

  $: isBuyerPage = $page.url.pathname.startsWith('/marketplace/buyer');
  $: isSellerPage = $page.url.pathname.startsWith('/marketplace/seller');
</script>

<div class="container mx-auto p-4">
  <main>
    <slot />
  </main>
</div>
