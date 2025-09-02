import { MarketplaceService } from '$lib/services';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const marketplaceService = (supabase: any) => new MarketplaceService(supabase);

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
  const jobId = params.id;
  const job = await marketplaceService(supabase).getJobById(jobId);

  if (!job) {
    throw error(404, 'Job not found');
  }

  return { job };
};

export const actions: Actions = {
  apply: async ({ request, params, locals: { supabase, getSession } }) => {
    const { data: { user: actionUser } } = await supabase.auth.getUser();
    if (!actionUser) {
      return fail(401, { error: 'You must be logged in to apply.' });
    }

    const formData = await request.formData();
    const phone = formData.get('phone') as string;
    const jobId = params.id;

    if (!phone) {
      return fail(400, { error: 'Phone number is required.' });
    }

    try {
      await marketplaceService(supabase).applyToJob(jobId, actionUser.id, phone);
      throw redirect(303, '/marketplace/jobs?applied=success');
    } catch (error: any) {
      if (error.status === 303) throw error; // SvelteKit redirect
      return fail(500, { error: error.message });
    }
  },
};
