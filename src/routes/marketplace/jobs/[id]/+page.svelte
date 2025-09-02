<script lang="ts">
  import type { PageData, ActionData } from './$types';
  import { enhance } from '$app/forms';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';

  export let data: PageData;
  export let form: ActionData;

  $: ({ job, error } = data);

</script>

<div class="container mx-auto py-8">
  {#if error}
    <p class="text-red-500">{error}</p>
  {:else if job}
    <div class="space-y-6">
        <div>
            <h1 class="text-3xl font-bold text-pink-800">{job.job_title}</h1>
            <p class="text-lg text-pink-600">Salary: {job.salary ? `${job.salary}` : 'Not specified'}</p>
        </div>
      
        <p class="text-pink-700">{job.job_description}</p>

        <Card.Root class="border-pink-200 bg-pink-50">
          <Card.Header><Card.Title class="text-pink-800">Apply for this Job</Card.Title></Card.Header>
          <Card.Content>
            <form method="POST" action="?/apply" use:enhance class="space-y-4">
              <div>
                <Label for="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" placeholder="Enter your phone number to coordinate" required />
              </div>
              <Button type="submit" class="w-full bg-pink-500 hover:bg-pink-600 text-white">Apply Now</Button>
              {#if form?.error}
                <p class="text-red-500 text-sm">{form.error}</p>
              {/if}
            </form>
          </Card.Content>
        </Card.Root>
    </div>
  {/if}
</div>
