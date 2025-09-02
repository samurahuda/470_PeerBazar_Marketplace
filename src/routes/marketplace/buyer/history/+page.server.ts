import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { MarketplaceService } from '$lib/services';

export const load: PageServerLoad = async ({ locals: { getSession, supabase } }) => {
	const session = await getSession();

	if (!session) {
		throw redirect(303, '/auth/login');
	}

	const marketplaceService = new MarketplaceService(supabase);
	const purchaseHistory = await marketplaceService.getPurchaseHistory(session.user.id);

	return {
		purchaseHistory
	};
};