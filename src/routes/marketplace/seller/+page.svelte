<script lang="ts">
  import type { PageData, ActionData } from './$types';
  import { enhance } from '$app/forms';
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import * as Tabs from "$lib/components/ui/tabs";

  export let data: PageData;
  export let form: ActionData;
</script>

<div class="space-y-4">
  <div class="flex justify-between items-center">
    <h2 class="text-xl font-semibold">Seller Dashboard</h2>
    <a href="/marketplace/seller/notifications">
      <Button variant="outline">View Notifications</Button>
    </a>
  </div>

  {#if data?.error}
    <p class="text-red-500">{data.error}</p>
  {/if}

  <Tabs.Root value="my-products" class="w-full">
    <Tabs.List>
      <Tabs.Trigger value="my-products">My Products</Tabs.Trigger>
      <Tabs.Trigger value="my-jobs">My Jobs</Tabs.Trigger>
      <Tabs.Trigger value="my-giveaways">My Giveaways</Tabs.Trigger>
      <Tabs.Trigger value="add-product">Post Product</Tabs.Trigger>
      <Tabs.Trigger value="add-job">Post Job</Tabs.Trigger>
      <Tabs.Trigger value="add-giveaway">Post Giveaway</Tabs.Trigger>
    </Tabs.List>

    <!-- MY PRODUCTS TAB -->
    <Tabs.Content value="my-products">
      <Card.Root>
        <Card.Header><Card.Title>My Product Listings</Card.Title></Card.Header>
        <Card.Content class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {#if data.myProducts && data.myProducts.length > 0}
            {#each data.myProducts as product (product.id)}
              <Card.Root>
                <img src={product.image_url || 'https://via.placeholder.com/300'} alt={product.title} class="w-full h-40 object-cover">
                <Card.Header>
                  <Card.Title>{product.title}</Card.Title>
                  <Card.Description>${product.price} - <span class:text-green-500={product.status === 'available'} class:text-yellow-500={product.status === 'sold'}>{product.status}</span></Card.Description>
                </Card.Header>
                <Card.Footer class="flex justify-end space-x-2">
                  <a href="/marketplace/seller/edit/{product.id}">
                    <Button variant="outline" size="sm">Edit</Button>
                  </a>
                  <form method="POST" action="?/deleteProduct" use:enhance>
                    <input type="hidden" name="productId" value={product.id} />
                    <Button variant="destructive" size="sm" type="submit">Delete</Button>
                  </form>
                </Card.Footer>
              </Card.Root>
            {/each}
          {:else}
            <p>You haven't posted any products yet.</p>
          {/if}
        </Card.Content>
      </Card.Root>
    </Tabs.Content>

    <!-- MY JOBS TAB -->
    <Tabs.Content value="my-jobs">
      <Card.Root>
        <Card.Header><Card.Title>My Job Postings</Card.Title></Card.Header>
        <Card.Content class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {#if data.myJobs && data.myJobs.length > 0}
            {#each data.myJobs as job (job.id)}
              <Card.Root>
                <Card.Header>
                  <Card.Title>{job.job_title}</Card.Title>
                  <Card.Description>{job.salary ? `$${job.salary}` : 'No salary specified'}</Card.Description>
                </Card.Header>
                <Card.Content>
                  <p class="line-clamp-3">{job.job_description}</p>
                </Card.Content>
                <Card.Footer class="flex justify-end">
                  <form method="POST" action="?/deleteJob" use:enhance>
                    <input type="hidden" name="jobId" value={job.id} />
                    <Button variant="destructive" size="sm" type="submit">Delete</Button>
                  </form>
                </Card.Footer>
              </Card.Root>
            {/each}
          {:else}
            <p>You haven't posted any jobs yet.</p>
          {/if}
        </Card.Content>
      </Card.Root>
    </Tabs.Content>

    <!-- MY GIVEAWAYS TAB -->
    <Tabs.Content value="my-giveaways">
      <Card.Root>
        <Card.Header><Card.Title>My Giveaway Listings</Card.Title></Card.Header>
        <Card.Content class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {#if data.myGiveaways && data.myGiveaways.length > 0}
            {#each data.myGiveaways as giveaway (giveaway.id)}
              <Card.Root>
                <img src={giveaway.image_url || 'https://via.placeholder.com/300'} alt={giveaway.title} class="w-full h-40 object-cover">
                <Card.Header>
                  <Card.Title>{giveaway.title}</Card.Title>
                  <Card.Description><span class:text-green-500={giveaway.status === 'available'} class:text-yellow-500={giveaway.status === 'claimed'}>{giveaway.status}</span></Card.Description>
                </Card.Header>
                <Card.Footer class="flex justify-end space-x-2">
                  <form method="POST" action="?/deleteGiveaway" use:enhance>
                    <input type="hidden" name="giveawayId" value={giveaway.id} />
                    <Button variant="destructive" size="sm" type="submit">Delete</Button>
                  </form>
                </Card.Footer>
              </Card.Root>
            {/each}
          {:else}
            <p>You haven't posted any giveaways yet.</p>
          {/if}
        </Card.Content>
      </Card.Root>
    </Tabs.Content>

    <!-- ADD PRODUCT TAB -->
    <Tabs.Content value="add-product">
      <Card.Root>
        <Card.Header><Card.Title>Post a New Product</Card.Title></Card.Header>
        <Card.Content>
          <form method="POST" action="?/createProduct" use:enhance enctype="multipart/form-data" class="space-y-4">
            <div>
              <Label for="title">Title</Label>
              <Input id="title" name="title" required />
            </div>
            <div>
              <Label for="price">Price</Label>
              <Input id="price" name="price" type="number" step="0.01" required />
            </div>
            <div>
              <Label for="description">Description</Label>
              <Textarea id="description" name="description" />
            </div>
            <div>
              <Label for="image_file">Product Image</Label>
              <Input id="image_file" name="image_file" type="file" accept="image/*" />
            </div>
            <Button type="submit">Create Product</Button>
            {#if form?.success && form.message?.includes('Product')}
              <p class="text-green-500">{form.message}</p>
            {/if}
          </form>
        </Card.Content>
      </Card.Root>
    </Tabs.Content>

    <!-- ADD JOB TAB -->
    <Tabs.Content value="add-job">
      <Card.Root class="border-pink-200 bg-pink-50">
        <Card.Header><Card.Title class="text-pink-800">Post a New Job</Card.Title></Card.Header>
        <Card.Content>
          <form method="POST" action="?/createJob" use:enhance class="space-y-4">
            <div>
              <Label for="job_title">Job Title</Label>
              <Input id="job_title" name="job_title" required />
            </div>
            <div>
              <Label for="job_description">Job Description</Label>
              <Textarea id="job_description" name="job_description" required/>
            </div>
            <div>
              <Label for="salary">Salary (Optional)</Label>
              <Input id="salary" name="salary" type="number" step="0.01" />
            </div>
            <Button type="submit" class="bg-pink-500 hover:bg-pink-600 text-white">Post Job</Button>
            {#if form?.success && form.message?.includes('Job')}
              <p class="text-green-500">{form.message}</p>
            {/if}
          </form>
        </Card.Content>
      </Card.Root>
    </Tabs.Content>

    <!-- ADD GIVEAWAY TAB -->
    <Tabs.Content value="add-giveaway">
      <Card.Root>
        <Card.Header><Card.Title>Post a New Giveaway</Card.Title></Card.Header>
        <Card.Content>
          <form method="POST" action="?/createGiveaway" use:enhance enctype="multipart/form-data" class="space-y-4">
            <div>
              <Label for="title">Title</Label>
              <Input id="title" name="title" required />
            </div>
            <div>
              <Label for="description">Description</Label>
              <Textarea id="description" name="description" />
            </div>
            <div>
              <Label for="image_file">Giveaway Image</Label>
              <Input id="image_file" name="image_file" type="file" accept="image/*" />
            </div>
            <Button type="submit">Create Giveaway</Button>
            {#if form?.success && form.message?.includes('Giveaway')}
              <p class="text-green-500">{form.message}</p>
            {/if}
          </form>
        </Card.Content>
      </Card.Root>
    </Tabs.Content>
  </Tabs.Root>
</div>