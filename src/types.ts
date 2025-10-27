// Database bindings
export type Bindings = {
  DB: D1Database;
}

// User types
export type UserRole = 'USER' | 'ADMIN' | 'MODERATOR';

export type User = {
  id: number;
  email: string;
  name: string;
  image?: string;
  password_hash?: string;
  role: UserRole;
  email_verified: number;
  created_at: string;
  updated_at: string;
}

// Agent types
export type PricingModel = 'FREE' | 'PAID' | 'FREEMIUM' | 'CONTACT';
export type AgentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type FeaturedTier = 'NONE' | 'SEO_BOOST' | 'PREMIUM' | 'BANNER';

export type Agent = {
  id: number;
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  website_url?: string;
  logo_url?: string;
  cover_image?: string;
  screenshots?: string; // JSON string
  pricing_model: PricingModel;
  is_open_source: number;
  status: AgentStatus;
  featured_tier: FeaturedTier;
  submitted_by_id: number;
  submitted_at: string;
  approved_at?: string;
  approved_by_id?: number;
  view_count: number;
  upvote_count: number;
  review_count: number;
  click_count: number;
  meta_title?: string;
  meta_description?: string;
  keywords?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

// Category types
export type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  parent_id?: number;
  agent_count: number;
  is_active: number;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Tag types
export type Tag = {
  id: number;
  name: string;
  slug: string;
  agent_count: number;
  created_at: string;
}

// Feature types
export type Feature = {
  id: number;
  agent_id: number;
  title: string;
  description?: string;
  display_order: number;
  created_at: string;
}

// Use Case types
export type UseCase = {
  id: number;
  agent_id: number;
  title: string;
  description?: string;
  display_order: number;
  created_at: string;
}

// Upvote types
export type Upvote = {
  id: number;
  user_id: number;
  agent_id: number;
  created_at: string;
}

// Review types
export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type Review = {
  id: number;
  user_id: number;
  agent_id: number;
  rating: number;
  content?: string;
  is_verified: number;
  helpful_count: number;
  status: ReviewStatus;
  created_at: string;
  updated_at: string;
}

// Newsletter types
export type Newsletter = {
  id: number;
  email: string;
  is_active: number;
  subscribed_at: string;
}

// Sponsorship types
export type SponsorshipTier = 'SEO_BOOST' | 'PREMIUM' | 'BANNER';
export type SponsorshipStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED';

export type Sponsorship = {
  id: number;
  agent_id: number;
  tier: SponsorshipTier;
  start_date: string;
  end_date: string;
  amount_paid?: number;
  is_paid: number;
  status: SponsorshipStatus;
  invoice_url?: string;
  created_at: string;
}

// JWT payload type
export type JWTPayload = {
  sub: number; // user id
  email: string;
  role: UserRole;
  exp: number;
}

// API response types
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination types
export type PaginatedResponse<T> = {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }
}

// Agent with relations
export type AgentWithRelations = Agent & {
  categories?: Category[];
  tags?: Tag[];
  features?: Feature[];
  use_cases?: UseCase[];
  submitter?: User;
  average_rating?: number;
  user_upvoted?: boolean;
}
