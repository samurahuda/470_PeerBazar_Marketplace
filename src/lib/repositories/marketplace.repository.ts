import type { ProductListing, JobPost } from '$lib/types/marketplace';
import type { SupabaseClient } from '@supabase/supabase-js';

export class MarketplaceRepository {
  constructor(private supabase: SupabaseClient) {}
  /* ---------- PRODUCTS ---------- */

  async getAllAvailableProducts(search?: string, maxPrice?: number): Promise<ProductListing[]> {
    let query = this.supabase
      .from('product_listings')
      .select('*')
      .eq('status', 'available');

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    if (maxPrice !== undefined) {
      query = query.lte('price', maxPrice);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch available products: ${error.message}`);
    }

    return data || [];
  }

  async getProductsBySeller(sellerId: string): Promise<ProductListing[]> {
    const { data, error } = await this.supabase
      .from('product_listings')
      .select('*')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch products for seller ${sellerId}: ${error.message}`);
    }

    return data || [];
  }

  async getProductById(id: string): Promise<ProductListing | null> {
    const { data, error } = await this.supabase
      .from('product_listings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to fetch product ${id}: ${error.message}`);
    }

    return data;
  }

  async createProduct(product: Omit<ProductListing, 'id' | 'created_at' | 'updated_at' | 'status'>): Promise<ProductListing> {
    const { data, error } = await this.supabase
      .from('product_listings')
      .insert(product)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }

    return data;
  }

  async updateProduct(id: string, updates: Partial<ProductListing>): Promise<ProductListing> {
    const { data, error } = await this.supabase
      .from('product_listings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update product ${id}: ${error.message}`);
    }

    return data;
  }

  async deleteProduct(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('product_listings')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete product ${id}: ${error.message}`);
    }
  }

  /* ---------- JOBS ---------- */

  async getAllJobs(): Promise<JobPost[]> {
    const { data, error } = await this.supabase
      .from('job_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {

      throw new Error(`Failed to fetch jobs: ${error.message}`);
    }

    return data || [];
  }

  async getJobsBySeller(sellerId: string): Promise<JobPost[]> {
    const { data, error } = await this.supabase
      .from('job_posts')
      .select('*')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch jobs for seller ${sellerId}: ${error.message}`);
    }

    return data || [];
  }

  async getJobById(id: string): Promise<JobPost | null> {
    const { data, error } = await this.supabase
      .from('job_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw new Error(`Failed to fetch job ${id}: ${error.message}`);
    }

    return data;
  }

  async createJob(job: Omit<JobPost, 'id' | 'created_at' | 'updated_at'>): Promise<JobPost> {
    const { data, error } = await this.supabase
      .from('job_posts')
      .insert(job)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create job: ${error.message}`);
    }

    return data;
  }
  
    async applyToJob(jobId: string, applicantId: string, phone: string) {
	  return this.supabase.from('job_applications').insert({ job_id: jobId, applicant_id: applicantId, phone_number: phone });
	}

  async deleteJob(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('job_posts')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete job ${id}: ${error.message}`);
    }
  }

  /* ---------- HISTORY ---------- */

  async getPurchaseHistoryByBuyer(buyerId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('purchase_history')
      .select(`
        *,
        product:product_listings (*)
      `)
      .eq('buyer_id', buyerId)
      .order('purchase_date', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch purchase history for buyer ${buyerId}: ${error.message}`);
    }

    return data || [];
  }
}