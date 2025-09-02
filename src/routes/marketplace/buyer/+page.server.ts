import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { MarketplaceService } from '$lib/services';

export const load: PageServerLoad = async ({ locals: { getSession, supabase }, url }) => {
	const session = await getSession();

	if (!session) {
		throw redirect(303, '/auth/login');
	}

	const marketplaceService = new MarketplaceService(supabase);

	const search = url.searchParams.get('search') || undefined;
	const maxPrice = Number(url.searchParams.get('maxPrice')) || undefined;

	const [products, purchaseHistory] = await Promise.all([
		marketplaceService.getAvailableProducts(search, maxPrice),
		marketplaceService.getPurchaseHistory(session.user.id)
	]);

	return {
		products,
		purchaseHistory
	};
};
