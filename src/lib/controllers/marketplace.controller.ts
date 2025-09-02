import { MarketplaceService } from '../services/marketplace.service';
import type { SupabaseClient } from '@supabase/supabase-js';

// Factory function to get an instance of the service with the provided Supabase client
const getMarketplaceService = (supabase: SupabaseClient) => new MarketplaceService(supabase);

// --- Product Actions ---
export const createProduct = (supabase: SupabaseClient, productData: any) => getMarketplaceService(supabase).createProduct(productData);
export const fetchProducts = (supabase: SupabaseClient, search?: string) => getMarketplaceService(supabase).getAvailableProducts(search);
export const fetchMyProducts = (supabase: SupabaseClient, sellerId: string) => getMarketplaceService(supabase).getProductsBySeller(sellerId);
export const fetchProduct = (supabase: SupabaseClient, id: string) => getMarketplaceService(supabase).getProductById(id);
export const updateProduct = (supabase: SupabaseClient, id: string, updates: any) => getMarketplaceService(supabase).updateProduct(id, updates);
export const deleteProduct = (supabase: SupabaseClient, id: string) => getMarketplaceService(supabase).deleteProduct(id);

// --- Wishlist Actions ---
export const getWishlist = (supabase: SupabaseClient, userId: string) => getMarketplaceService(supabase).getWishlist(userId);
export const addToWishlist = (supabase: SupabaseClient, userId: string, productId: string) => getMarketplaceService(supabase).addToWishlist(userId, productId);
export const removeFromWishlist = (supabase: SupabaseClient, userId: string, productId: string) => getMarketplaceService(supabase).removeFromWishlist(userId, productId);

// --- Job Actions ---
export const createJob = (supabase: SupabaseClient, jobData: any) => getMarketplaceService(supabase).createJob(jobData);
export const listJobs = (supabase: SupabaseClient) => getMarketplaceService(supabase).getAllJobs();
export const applyJob = (supabase: SupabaseClient, jobId: string, applicantId: string, phone: string) => getMarketplaceService(supabase).applyToJob(jobId, applicantId, phone);

// --- Purchase Actions ---
export const purchase = (supabase: SupabaseClient, productId: string, buyerId: string, phone: string) => getMarketplaceService(supabase).purchaseProduct(productId, buyerId, phone);

// --- Seller Notification Actions ---
export const fetchSellerNotifications = (supabase: SupabaseClient, sellerId: string) => getMarketplaceService(supabase).getSellerNotifications(sellerId);
