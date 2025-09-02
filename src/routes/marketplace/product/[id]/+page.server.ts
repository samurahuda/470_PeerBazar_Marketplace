import { MarketplaceService } from '$lib/services';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { SupabaseClient } from '@supabase/supabase-js';

// Factory function to get an instance of the service with the provided Supabase client
const getMarketplaceService = (supabase: SupabaseClient) => new MarketplaceService(supabase);

export const load: PageServerLoad = async ({ params, parent, locals: { supabase } }) => {
  const { data: { user: sessionUser } } = await supabase.auth.getUser();
  const productId = params.id;

  const product = await getMarketplaceService(supabase).getProductById(productId);

  if (!product) {
    throw error(404, 'Product not found');
  }

  let isWished = false;
  if (sessionUser) {
      isWished = await getMarketplaceService(supabase).isProductInWishlist(sessionUser.id, productId);
  }

  return { product, isWished, error: null };
};

export const actions: Actions = {
  purchase: async ({ request, params, locals: { supabase } }) => {
    const { data: { user: actionUser } } = await supabase.auth.getUser();
    if (!actionUser) {
      return fail(401, { error: 'You must be logged in to purchase items.' });
    }

    const formData = await request.formData();
    const phone = formData.get('phone') as string;
    const productId = params.id;

    if (!phone) {
      return fail(400, { error: 'Phone number is required.' });
    }

    const { purchase, error } = await getMarketplaceService(supabase).purchaseProduct(
      productId,
      actionUser.id,
      phone
    );

    if (error) {
      return fail(500, { error });
    }

    // Redirect to a success page or back to the marketplace
    throw redirect(303, '/marketplace/buyer?purchase=success');
  },

  toggleWishlist: async ({ params, locals: { supabase } }) => {
    const { data: { user: actionUser } } = await supabase.auth.getUser();
    if (!actionUser) {
        return fail(401, { error: 'Unauthorized' });
    }
    const { id: productId } = params;
    const userId = actionUser.id;

    const isWished = await getMarketplaceService(supabase).isProductInWishlist(userId, productId);

    try {
        if (isWished) {
            await getMarketplaceService(supabase).removeFromWishlist(userId, productId);
            return { success: true, wished: false };
        } else {
            await getMarketplaceService(supabase).addToWishlist(userId, productId);
            return { success: true, wished: true };
        }
    } catch (e: any) {
        return fail(500, { error: e.message });
    }
  }
};
