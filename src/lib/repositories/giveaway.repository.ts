import type { SupabaseClient } from '@supabase/supabase-js';
import type { GiveawayPost } from '$lib/types/marketplace';

export class GiveawayRepository {
    constructor(private supabase: SupabaseClient) {}

    async createGiveawayPost(post: Omit<GiveawayPost, 'id' | 'created_at' | 'status'>): Promise<GiveawayPost> {
        const { data, error } = await this.supabase
            .from('giveaway_posts')
            .insert(post)
            .select()
            .single();

        if (error) {
            throw new Error(`Failed to create giveaway post: ${error.message}`);
        }
        return data;
    }

    async getGiveawaysBySeller(sellerId: string): Promise<GiveawayPost[]> {
        const { data, error } = await this.supabase
            .from('giveaway_posts')
            .select('*')
            .eq('seller_id', sellerId)
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(`Failed to fetch giveaway posts: ${error.message}`);
        }
        return data || [];
    }

    async deleteGiveawayPost(postId: string): Promise<void> {
        const { error } = await this.supabase
            .from('giveaway_posts')
            .delete()
            .eq('id', postId);

        if (error) {
            throw new Error(`Failed to delete giveaway post: ${error.message}`);
        }
    }

    async getAvailableGiveaways(): Promise<GiveawayPost[]> {
        const { data, error } = await this.supabase
            .from('giveaway_posts')
            .select('*')
            .eq('status', 'available')
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(`Failed to fetch available giveaways: ${error.message}`);
        }
        return data || [];
    }

    async getGiveawayById(postId: string): Promise<GiveawayPost | null> {
        const { data, error } = await this.supabase
            .from('giveaway_posts')
            .select('*')
            .eq('id', postId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') { // PostgREST error for "Not a single row was returned"
                return null;
            }
            throw new Error(`Failed to fetch giveaway post: ${error.message}`);
        }
        return data;
    }

    async createGiveawayClaim(claim: { giveaway_id: string; claimer_id: string; claimer_phone_number: string }): Promise<void> {
        const { error } = await this.supabase
            .from('giveaway_claims')
            .insert(claim);

        if (error) {
            throw new Error(`Failed to create giveaway claim: ${error.message}`);
        }
    }

    async updateGiveawayStatus(postId: string, status: 'available' | 'claimed'): Promise<void> {
        const { error } = await this.supabase
            .from('giveaway_posts')
            .update({ status })
            .eq('id', postId);

        if (error) {
            throw new Error(`Failed to update giveaway status: ${error.message}`);
        }
    }
}
