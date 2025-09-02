import { MarketplaceService } from '$lib/services';
import type { PageServerLoad } from './$types';

const marketplaceService = (supabase: any) => new MarketplaceService(supabase);

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  try {
    const giveaways = await marketplaceService(supabase).getAvailableGiveaways();
    return { giveaways, error: null };
  } catch (e: any) {
    return { giveaways: [], error: e.message };
  }
};
