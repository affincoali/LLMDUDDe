// Database bindings
export type Bindings = {
  DB: D1Database;
  IMAGES?: R2Bucket;
  RESEND_API_KEY?: string;
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
  rejection_reason?: string;
  admin_notes?: string;
  last_edited_by?: number;
  last_edited_at?: string;
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
  
  // New agent parameters (added 2025-10-29)
  primary_function?: string; // e.g., Task Automation, Web Research
  ideal_user?: string; // e.g., Marketers, Developers, Sales Teams
  free_tier_details?: string; // e.g., Yes 7-day trial, Yes 500 free actions
  autonomy_level?: number; // 1 = Fully Autonomous, 0 = Human-in-the-Loop
  web_browsing?: number; // 1 = Yes, 0 = No
  file_analysis_support?: string; // Comma-separated: PDF,CSV,TXT
  long_term_memory?: number; // 1 = Yes, 0 = No
  code_execution_support?: string; // Comma-separated: Python,JavaScript
  integrations_support?: string; // Comma-separated: Zapier,Slack,Gmail
  multi_agent_mode?: number; // 1 = Yes (can spawn sub-agents), 0 = No
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

// Audit Log types
export type AuditLog = {
  id: number;
  user_id: number;
  action: string;
  entity_type: string;
  entity_id?: number;
  details?: string; // JSON string
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// Admin dashboard metrics
export type DashboardMetrics = {
  total_agents: number;
  pending_agents: number;
  approved_agents: number;
  rejected_agents: number;
  agents_growth_30d: number;
  total_categories: number;
  total_users: number;
  total_reviews: number;
  total_views: number;
  total_upvotes: number;
  total_clicks: number;
  total_sponsorship_revenue: number;
}

// Analytics data types
export type AnalyticsData = {
  daily_views: Array<{ date: string; views: number }>;
  top_categories: Array<{ name: string; count: number }>;
  pricing_distribution: Array<{ model: string; count: number }>;
  upvotes_trend: Array<{ date: string; upvotes: number }>;
}
