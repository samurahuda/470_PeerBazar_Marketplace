
export interface ProductListing {
  id: string; // UUID
  seller_id: string; // UUID
  title: string;
  description?: string;
  price: number;
  category?: string;
  size?: string;
  color?: string;
  brand?: string;
  image_url?: string;
  status: 'available' | 'sold' | 'removed';
  created_at: string; // timestamptz
  updated_at: string; // timestamptz
}

export interface PurchaseHistory {
  id: string; // UUID
  buyer_id: string; // UUID
  product_id: string; // UUID
  purchase_date: string; // timestamptz
  price: number;
  phone_number: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface WishlistItem {
  id: string; // UUID
  user_id: string; // UUID
  product_id: string; // UUID
  created_at: string; // timestamptz
  product_listings: ProductListing;
}

export interface JobPost {
  id: string; // UUID
  seller_id: string; // UUID
  job_title: string;
  job_description: string;
  salary?: number;
  created_at: string; // timestamptz
  updated_at: string; // timestamptz
}

export interface JobApplication {
  id: string; // UUID
  job_id: string; // UUID
  applicant_id: string; // UUID
  phone_number: string;
  applied_at: string; // timestamptz
}

export interface GiveawayPost {
  id: string; // UUID
  seller_id: string; // UUID
  title: string;
  description?: string;
  image_url?: string;
  status: 'available' | 'claimed' | 'removed';
  created_at: string; // timestamptz
  updated_at: string; // timestamptz
}

export interface GiveawayClaim {
    id: string; // UUID
    giveaway_id: string; // UUID
    claimer_id: string; // UUID
    claimer_phone_number: string;
    claimed_at: string; // timestamptz
}
