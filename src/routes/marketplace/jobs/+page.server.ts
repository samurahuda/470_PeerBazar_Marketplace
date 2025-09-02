import { MarketplaceService } from '$lib/services';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  const marketplaceService = (supabase: any) => new MarketplaceService(supabase);

  try {
    const jobs = await marketplaceService(supabase).getAllJobs();
    return { jobs };
  } catch (error: any) {
    return { jobs: [], error: error.message };
  }
};
