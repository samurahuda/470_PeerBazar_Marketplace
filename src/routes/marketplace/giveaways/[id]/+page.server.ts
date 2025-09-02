import { MarketplaceService } from '$lib/services';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const marketplaceService = (supabase: any) => new MarketplaceService(supabase);

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
  try {
    const giveaway = await marketplaceService(supabase).getGiveawayById(params.id);
    return { giveaway, error: null };
  } catch (e: any) {
    return { giveaway: null, error: e.message };
  }
};

export const actions: Actions = {
  claimGiveaway: async ({ request, params, locals: { supabase } }) => {
    const { data: { user: actionUser } } = await supabase.auth.getUser();
    if (!actionUser) return fail(401, { error: 'Unauthorized' });

    const formData = await request.formData();
    const phoneNumber = formData.get('phone_number') as string;

    if (!phoneNumber) {
        return fail(400, { error: 'Phone number is required.' });
    }

    const { success, error } = await marketplaceService(supabase).claimGiveaway(params.id, actionUser.id, phoneNumber);

    if (error) {
      return fail(500, { error });
    }

    return { success: true, message: 'Giveaway claimed successfully! You will be contacted shortly.' };
  },
};