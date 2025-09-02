<script lang="ts">
  import type { PageData } from './$types';
  import * as Card from '$lib/components/ui/card';

  export let data: PageData;

  $: ({ jobs, error } = data);
</script>

<div class="space-y-4">
  <h2 class="text-xl font-semibold">Job Opportunities</h2>

  {#if error}
    <p class="text-red-500">{error}</p>
  {/if}

  {#if jobs && jobs.length > 0}
    <div class="space-y-4">
      {#each jobs as job (job.id)}
        <a href={`/marketplace/jobs/${job.id}`}>
          <Card.Root class="hover:shadow-md transition-shadow border-pink-200 bg-pink-50">
            <Card.Header>
              <Card.Title class="text-pink-800">{job.job_title}</Card.Title>
              <Card.Description class="text-pink-600">Salary: {job.salary ? `${job.salary}` : 'Not specified'}</Card.Description>
            </Card.Header>
            <Card.Content>
              <p class="text-pink-700">{job.job_description.substring(0, 150)}...</p>
            </Card.Content>
          </Card.Root>
        </a>
      {/each}
    </div>
  {:else if !error}
    <div class="text-center py-12">
      <p class="text-gray-500">No jobs posted at the moment. Check back later!</p>
    </div>
  {/if}
</div>
