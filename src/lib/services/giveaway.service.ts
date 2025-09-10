import { GiveawayRepository } from '../repositories/giveaway.repository';
import { createSellerNotification } from '../repositories/seller-notification.repository';
import type { GiveawayPost } from '../types/marketplace';
import type { SupabaseClient } from '@supabase/supabase-js';

export class GiveawayService {
  private giveawayRepository: GiveawayRepository;

  constructor(private supabase: SupabaseClient) {
    this.giveawayRepository = new GiveawayRepository(supabase);
  }

  async createGiveaway(postData: Omit<GiveawayPost, 'id' | 'created_at' | 'status'>) {
    return this.giveawayRepository.createGiveawayPost(postData);
  }

  async getGiveawaysBySeller(sellerId: string) {
    return this.giveawayRepository.getGiveawaysBySeller(sellerId);
  }

  async deleteGiveaway(postId: string) {
    return this.giveawayRepository.deleteGiveawayPost(postId);
  }

  async getAvailableGiveaways() {
    return this.giveawayRepository.getAvailableGiveaways();
  }

  async getGiveawayById(postId: string) {
    return this.giveawayRepository.getGiveawayById(postId);
  }

  async claimGiveaway(giveawayId: string, claimerId: string, phoneNumber: string): Promise<{ success: boolean; error: string | null }> {
    const giveaway = await this.giveawayRepository.getGiveawayById(giveawayId);

    if (!giveaway) {
      return { success: false, error: 'Giveaway not found.' };
    }
    if (giveaway.status !== 'available') {
      return { success: false, error: 'This giveaway is no longer available.' };
    }

    if (!giveaway.seller_id) {
      console.error('Giveaway seller_id is missing for giveaway:', giveawayId);
      return { success: false, error: 'Giveaway owner not found.' };
    }

    try {
      // Step 1: Create the claim record
      await this.giveawayRepository.createGiveawayClaim({
        giveaway_id: giveawayId,
        claimer_id: claimerId,
        claimer_phone_number: phoneNumber
      });

      // Step 2: Mark the giveaway as claimed
      await this.giveawayRepository.updateGiveawayStatus(giveawayId, 'claimed');

      // Step 3: Create notification for the seller
      await createSellerNotification({
        user_id: giveaway.seller_id,
        title: 'Giveaway Claimed!',
        message: `Your giveaway "${giveaway.title}" has been claimed by someone with phone number: ${phoneNumber}.`,
        type: 'general',
        action_url: `/myspace/notifications`
      });

      return { success: true, error: null };
    } catch (error: any) {
      console.error('Error claiming giveaway:', error);
      return { success: false, error: error.message || 'An unexpected error occurred during the claim process.' };
    }
  }
}
