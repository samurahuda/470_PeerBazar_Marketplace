import { MarketplaceService } from '$lib/services';
import type { PageServerLoad } from './$types';

const marketplaceService = (supabase: any) => new MarketplaceService(supabase);

export const load: PageServerLoad = async ({ parent, locals: { supabase } }) => {
  const { data: { user: sessionUser } } = await supabase.auth.getUser();
  if (!sessionUser) {
    return { wishlist: [], error: 'You must be logged in to view your wishlist.' };
  }

  try {
    const wishlist = await marketplaceService(supabase).getWishlist(sessionUser.id);
    return { wishlist };
  } catch (error: any) {
    return { wishlist: [], error: error.message };
  }
};
