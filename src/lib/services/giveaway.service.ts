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
    console.log('Attempting to claim giveaway:', { giveawayId, claimerId, phoneNumber });

    const giveaway = await this.giveawayRepository.getGiveawayById(giveawayId);

    if (!giveaway) {
      console.error('Giveaway not found for ID:', giveawayId);
      return { success: false, error: 'Giveaway not found.' };
    }
    if (giveaway.status !== 'available') {
      console.warn('Giveaway not available:', giveawayId, giveaway.status);
      return { success: false, error: 'This giveaway is no longer available.' };
    }

    console.log('Giveaway found:', giveaway);
    console.log('Giveaway seller ID:', giveaway.seller_id); // Log seller ID

    try {
      // Step 1: Create the claim record
      console.log('Creating giveaway claim...');
      await this.giveawayRepository.createGiveawayClaim({
        giveaway_id: giveawayId,
        claimer_id: claimerId,
        claimer_phone_number: phoneNumber
      });
      console.log('Giveaway claim created successfully.');

      // Step 2: Mark the giveaway as claimed
      console.log('Updating giveaway status to claimed...');
      await this.giveawayRepository.updateGiveawayStatus(giveawayId, 'claimed');
      console.log('Giveaway status updated successfully.');

      // Step 3: Create notification for the seller
      console.log('Attempting to create seller notification...');
      await createSellerNotification({
        user_id: giveaway.seller_id,
        title: 'Giveaway Claimed!',
        message: `Your giveaway "${giveaway.title}" has been claimed by someone with phone number: ${phoneNumber}.`,
        type: 'general',
        action_url: `/myspace/notifications`
      });
      console.log('Seller notification created successfully.');

      return { success: true, error: null };
    } catch (error: any) {
      console.error('Error during giveaway claim process:', error);
      return { success: false, error: error.message || 'An unexpected error occurred during the claim process.' };
    }
  }
}
