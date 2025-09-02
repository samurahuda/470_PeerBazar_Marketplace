<script lang="ts">
  import type { PageData } from './$types';
  import * as Card from '$lib/components/ui/card';
  import { Separator } from '$lib/components/ui/separator';

  export let data: PageData;

  $: ({ purchases, applications, error } = data);
</script>

<div class="space-y-6">
    <div>
        <h1 class="text-2xl font-bold text-pink-800">Notifications</h1>
        <p class="text-pink-600">Track your sales and job applications here.</p>
    </div>

    {#if error}
        <p class="text-red-500">{error}</p>
    {/if}

    <div class="space-y-4">
        <Card.Root class="border-pink-200 bg-pink-50">
            <Card.Header><Card.Title class="text-pink-800">Items Sold</Card.Title></Card.Header>
            <Card.Content>
                {#if purchases && purchases.length > 0}
                    <ul class="space-y-3">
                        {#each purchases as purchase (purchase.id)}
                            <li class="flex items-center justify-between p-2 rounded-md border border-pink-300 bg-pink-100 text-pink-800">
                                <div>
                                    <p class="font-semibold">{purchase.title}</p>
                                    <p class="text-sm text-pink-700">{purchase.message}</p>
                                </div>
                                <span class="text-sm">{new Date(purchase.created_at).toLocaleDateString()}</span>
                            </li>
                        {/each}
                    </ul>
                {:else if !error}
                    <p class="text-pink-700">No items have been sold yet.</p>
                {/if}
            </Card.Content>
        </Card.Root>

        <Separator class="bg-pink-300" />

        <Card.Root class="border-pink-200 bg-pink-50">
            <Card.Header><Card.Title class="text-pink-800">Job Applications</Card.Title></Card.Header>
            <Card.Content>
                {#if applications && applications.length > 0}
                     <ul class="space-y-3">
                        {#each applications as app (app.id)}
                            <li class="flex items-center justify-between p-2 rounded-md border border-pink-300 bg-pink-100 text-pink-800">
                                <div>
                                    <p class="font-semibold">{app.title}</p>
                                    <p class="text-sm text-pink-700">{app.message}</p>
                                </div>
                                <span class="text-sm">{new Date(app.created_at).toLocaleDateString()}</span>
                            </li>
                        {/each}
                    </ul>
                {:else if !error}
                    <p class="text-pink-700">No one has applied to your job postings yet.</p>
                {/if}
            </Card.Content>
        </Card.Root>

        <Separator class="bg-pink-300" />

        <Card.Root class="border-pink-200 bg-pink-50">
            <Card.Header><Card.Title class="text-pink-800">Giveaway Notifications</Card.Title></Card.Header>
            <Card.Content>
                {#if data.giveawayNotifications && data.giveawayNotifications.length > 0}
                     <ul class="space-y-3">
                        {#each data.giveawayNotifications as notification (notification.id)}
                            <li class="flex items-center justify-between p-2 rounded-md border border-pink-300 bg-pink-100 text-pink-800">
                                <div>
                                    <p class="font-semibold">{notification.title}</p>
                                    <p class="text-sm text-pink-700">{notification.message}</p>
                                    {#if notification.claimer_phone_number}
                                        <p class="text-sm text-pink-700">Claimer Phone: {notification.claimer_phone_number}</p>
                                    {/if}
                                </div>
                                <span class="text-sm">{new Date(notification.created_at).toLocaleDateString()}</span>
                            </li>
                        {/each}
                    </ul>
                {:else if !error}
                    <p class="text-pink-700">No giveaway notifications yet.</p>
                {/if}
            </Card.Content>
        </Card.Root>
    </div>
</div>
