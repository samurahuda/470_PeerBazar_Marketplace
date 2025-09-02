<script lang="ts">
  import type { PageData, ActionData } from './$types';
  import { enhance } from '$app/forms';
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';

  export let data: PageData;
  export let form: ActionData;

  $: ({ product, error } = data);

  // Form values for pre-filling
  let title = product?.title || '';
  let description = product?.description || '';
  let price = product?.price || 0;
  let category = product?.category || '';
  let size = product?.size || '';
  let color = product?.color || '';
  let brand = product?.brand || '';
  let imageUrl = product?.image_url || '';

  // Update form values when product data changes (e.g., after successful update)
  $: if (product) {
    title = product.title;
    description = product.description || '';
    price = product.price;
    category = product.category || '';
    size = product.size || '';
    color = product.color || '';
    brand = product.brand || '';
    imageUrl = product.image_url || '';
  }
</script>

<div class="container mx-auto p-4">
  <Card.Root class="border-pink-200 bg-pink-50">
    <Card.Header><Card.Title class="text-pink-800">Edit Product: {product?.title}</Card.Title></Card.Header>
    <Card.Content>
      {#if error}
        <p class="text-red-500">{error}</p>
      {:else if !product}
        <p class="text-pink-700">Product not found or you are not authorized to edit it.</p>
      {:else}
        <form method="POST" action="?/updateProduct" use:enhance enctype="multipart/form-data" class="space-y-4">
          <div>
            <Label for="title">Title</Label>
            <Input id="title" name="title" required bind:value={title} />
          </div>
          <div>
            <Label for="price">Price</Label>
            <Input id="price" name="price" type="number" step="0.01" required bind:value={price} />
          </div>
          <div>
            <Label for="description">Description</Label>
            <Textarea id="description" name="description" bind:value={description} />
          </div>
          <div>
            <Label for="category">Category</Label>
            <Input id="category" name="category" bind:value={category} />
          </div>
          <div>
            <Label for="size">Size</Label>
            <Input id="size" name="size" bind:value={size} />
          </div>
          <div>
            <Label for="color">Color</Label>
            <Input id="color" name="color" bind:value={color} />
          </div>
          <div>
            <Label for="brand">Brand</Label>
            <Input id="brand" name="brand" bind:value={brand} />
          </div>
          <div>
            <Label for="image_file">Product Image</Label>
            <Input id="image_file" name="image_file" type="file" accept="image/*" />
            {#if imageUrl}
              <p class="text-sm text-pink-700 mt-2">Current image:</p>
              <img src={imageUrl} alt="Current Product" class="w-32 h-32 object-cover rounded-md mt-1" />
            {/if}
          </div>
          <Button type="submit" class="bg-pink-500 hover:bg-pink-600 text-white">Save Changes</Button>
          {#if form?.success}
            <p class="text-green-500">{form.message}</p>
          {:else if form?.error}
            <p class="text-red-500">{form.error}</p>
          {/if}
        </form>
      {/if}
    </Card.Content>
  </Card.Root>
</div>
