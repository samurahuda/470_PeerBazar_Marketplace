import type { WishlistItem, ProductListing } from '$lib/types/marketplace';
import type { SupabaseClient } from '@supabase/supabase-js';

// The type returned by Supabase when joining wishlist with products
export type WishlistWithProduct = Omit<WishlistItem, 'product_listings'> & {
  product_listings: ProductListing;
};

export class WishlistRepository {
  constructor(private supabase: SupabaseClient) {}
  async getWishlistByUserId(userId: string): Promise<WishlistWithProduct[]> {
    const { data, error } = await this.supabase
      .from('wishlist')
      .select('*, product_listings(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch wishlist for user ${userId}: ${error.message}`);
    }

    // The join returns the full product object, so we can assert the type.
    return (data as WishlistWithProduct[]) || [];
  }

  async addToWishlist(userId: string, productId: string): Promise<WishlistItem> {
    const { data, error } = await this.supabase
      .from('wishlist')
      .insert({ user_id: userId, product_id: productId })
      .select()
      .single();

    if (error) {
      // Handle unique constraint violation gracefully
      if (error.code === '23505') {
        console.warn(`Item ${productId} already in wishlist for user ${userId}`);
      } else {
        throw new Error(`Failed to add item to wishlist: ${error.message}`);
      }
    }

    return data;
  }

  async removeFromWishlist(userId: string, productId: string): Promise<void> {
    const { error } = await this.supabase
      .from('wishlist')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) {
      throw new Error(`Failed to remove item from wishlist: ${error.message}`);
    }
  }
  
  async isProductInWishlist(userId: string, productId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('wishlist')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to check wishlist status: ${error.message}`);
    }

    return !!data;
  }
}