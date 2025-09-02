import { MarketplaceRepository } from '../repositories/marketplace.repository';
import { WishlistRepository } from '../repositories/wishlist.repository';
import { createPurchase } from '../repositories/marketplace-notifications.repository';
import { createSellerNotification } from '../repositories/seller-notification.repository';
import type { ProductListing, JobPost, PurchaseHistory, GiveawayPost } from '../types/marketplace';
import type { SupabaseClient } from '@supabase/supabase-js';
import { GiveawayService } from './giveaway.service';

export class MarketplaceService {
  private marketplaceRepository: MarketplaceRepository;
  private wishlistRepository: WishlistRepository;
  private giveawayService: GiveawayService;

  constructor(private supabase: SupabaseClient) {
    this.marketplaceRepository = new MarketplaceRepository(supabase);
    this.wishlistRepository = new WishlistRepository(supabase);
    this.giveawayService = new GiveawayService(supabase);
  } 

  // --- Product Methods ---
  async getAvailableProducts(search?: string, maxPrice?: number) {
    return this.marketplaceRepository.getAllAvailableProducts(search, maxPrice);
  }

  async getProductById(id: string) {
    return this.marketplaceRepository.getProductById(id);
  }

  async getProductsBySeller(sellerId: string) {
    return this.marketplaceRepository.getProductsBySeller(sellerId);
  }

  async createProduct(productData: Omit<ProductListing, 'id' | 'created_at' | 'updated_at' | 'status'>) {
    return this.marketplaceRepository.createProduct(productData);
  }

  async updateProduct(id: string, updates: Partial<ProductListing>) {
    return this.marketplaceRepository.updateProduct(id, { ...updates, updated_at: new Date().toISOString() });
  }

  async deleteProduct(id: string) {
    return this.marketplaceRepository.deleteProduct(id);
  }

  // --- Purchase Logic ---
  async purchaseProduct(productId: string, buyerId: string, phone: string): Promise<{ purchase: PurchaseHistory | null; error: string | null }> {
    const product = await this.marketplaceRepository.getProductById(productId);

    if (!product) {
      return { purchase: null, error: 'Product not found.' };
    }
    if (product.status !== 'available') {
      return { purchase: null, error: 'This product is no longer available.' };
    }

    try {
      // Step 1: Create the purchase record
      const purchaseRecord = await createPurchase(this.supabase, {
        buyer_id: buyerId,
        product_id: productId,
        price: product.price, // Use price from the listing at time of purchase
        phone_number: phone
      });

      // Step 2: Mark the product as sold
      await this.marketplaceRepository.updateProduct(productId, { status: 'sold' });

      // Step 3: Create notification for the seller
      await createSellerNotification({
        user_id: product.created_by,
        title: 'Product Sold!',
        message: `Your product "${product.title}" has been purchased.`,
        type: 'product_purchase',
        action_url: `/myspace/notifications` // Example URL, adjust as needed
      });

      return { purchase: purchaseRecord, error: null };
    } catch (error: any) {
      // In a real app, you might add more sophisticated rollback logic here.
      return { purchase: null, error: error.message || 'An unexpected error occurred during purchase.' };
    }
  }

  // --- Wishlist Methods ---
  async getWishlist(userId: string) {
    return this.wishlistRepository.getWishlistByUserId(userId);
  }

  async addToWishlist(userId: string, productId: string) {
    return this.wishlistRepository.addToWishlist(userId, productId);
  }

  async removeFromWishlist(userId: string, productId: string) {
    return this.wishlistRepository.removeFromWishlist(userId, productId);
  }

  async isProductInWishlist(userId: string, productId: string) {
    return this.wishlistRepository.isProductInWishlist(userId, productId);
  }

  // --- Job Methods ---
  async getAllJobs() {
    return this.marketplaceRepository.getAllJobs();
  }

  async getJobsBySeller(sellerId: string) {
    return this.marketplaceRepository.getJobsBySeller(sellerId);
  }

  async getJobById(id: string) {
    return this.marketplaceRepository.getJobById(id);
  }

  async createJob(jobData: Omit<JobPost, 'id' | 'created_at' | 'updated_at'>) {
    return this.marketplaceRepository.createJob(jobData);
  }

  async applyToJob(jobId: string, applicantId: string, phone: string) {
    // Fetch job details to get the seller_id
    const jobPost = await this.marketplaceRepository.getJobById(jobId);

    if (!jobPost) {
      throw new Error('Job post not found.');
    }

    // Insert the job application
    const { error } = await this.marketplaceRepository.applyToJob(jobId, applicantId, phone);

    if (error) {
      throw new Error(`Failed to apply to job: ${error.message}`);
    }

    // Create notification for the job poster (seller)
    await createSellerNotification({
      user_id: jobPost.created_by,
      title: 'New Job Application!',
      message: `Someone applied to your job post "${jobPost.title}".`,
      type: 'job_application',
      action_url: `/myspace/notifications` // Example URL, adjust as needed
    });

    return { success: true }; // Return a success indicator
  }

  async deleteJob(id: string) {
    return this.marketplaceRepository.deleteJob(id);
  }

  // --- History Methods ---
  async getPurchaseHistory(userId: string) {
    return this.marketplaceRepository.getPurchaseHistoryByBuyer(userId);
  }

  // --- Giveaway Methods ---
  async getGiveawaysBySeller(sellerId: string) {
    return this.giveawayService.getGiveawaysBySeller(sellerId);
  }

  async createGiveaway(postData: Omit<GiveawayPost, 'id' | 'created_at' | 'status'>) {
    return this.giveawayService.createGiveaway(postData);
  }

  async deleteGiveaway(postId: string) {
    return this.giveawayService.deleteGiveaway(postId);
  }

  async getAvailableGiveaways() {
    return this.giveawayService.getAvailableGiveaways();
  }

  async getGiveawayById(postId: string) {
    return this.giveawayService.getGiveawayById(postId);
  }

  async claimGiveaway(giveawayId: string, claimerId: string, phoneNumber: string) {
    return this.giveawayService.claimGiveaway(giveawayId, claimerId, phoneNumber);
  }
}