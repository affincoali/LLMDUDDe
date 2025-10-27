# AI Agents Directory

A comprehensive directory platform for discovering, submitting, and managing AI agents and tools. Built with Hono framework on Cloudflare Pages with D1 SQLite database for edge-first deployment.

## 🚀 Live Demo

- **Development**: https://3000-izrhvxrc8y0zaw0u52v89-2e1b9533.sandbox.novita.ai
- **Production**: (Deploy to Cloudflare Pages)

### ✅ All Pages Fully Functional

**Status**: All pages are working and connected to database (Last tested: 2025-10-27)

**Working Pages**:
- ✅ Homepage with statistics
- ✅ Agents listing page
- ✅ Agent detail pages (all 11 agents)
- ✅ Categories page
- ✅ Login/Signup/Dashboard
- ✅ Admin panel with full functionality

**Test URLs**:
- Homepage: https://3000-izrhvxrc8y0zaw0u52v89-2e1b9533.sandbox.novita.ai/
- ChatGPT: https://3000-izrhvxrc8y0zaw0u52v89-2e1b9533.sandbox.novita.ai/agents/chatgpt
- Jasper AI: https://3000-izrhvxrc8y0zaw0u52v89-2e1b9533.sandbox.novita.ai/agents/jasper-ai
- Categories: https://3000-izrhvxrc8y0zaw0u52v89-2e1b9533.sandbox.novita.ai/categories

### 🔑 Admin Credentials

To access the admin panel, login with these credentials:

- **Login URL**: https://3000-izrhvxrc8y0zaw0u52v89-2e1b9533.sandbox.novita.ai/login
- **Email**: `admin@aiagents.directory`
- **Password**: `admin123`
- **Admin Panel**: https://3000-izrhvxrc8y0zaw0u52v89-2e1b9533.sandbox.novita.ai/admin/agents-all

**Note**: After logging in, you'll be automatically redirected to the admin dashboard.

## 🎯 Project Overview

AI Agents Directory is a lightweight, edge-deployed platform that allows users to:
- Browse and discover AI agents and tools
- Submit new AI agents for community review
- Rate and review AI agents
- Filter by categories, pricing models, and features
- Admin panel for managing submissions and content

## ✨ Key Features

### Public Features
- **Enhanced Homepage**: 
  - Real-time search with 300ms debounce
  - Newly added agents carousel with horizontal scroll
  - Trending agents section (last 7 days by views)
  - Popular categories grid with top 12 categories
  - Newsletter subscription with email validation
  - Quick stats display
  
- **Advanced Agent Listing** (`/agents`):
  - Dark mode support with localStorage persistence
  - Grid and List view toggle
  - Advanced filters: Pricing model, Categories (multi-select), Open Source
  - Search with debounce
  - Sort options: Trending, Newest, Most Upvoted, Most Reviewed, A-Z
  - Skeleton loaders for better UX
  - Responsive design with hamburger menu
  
- **Individual Agent Detail** (`/agents/[slug]`):
  - Tabbed interface: Overview, Features, Pricing, Reviews
  - Large emoji logo display (6xl size)
  - Upvote button with optimistic UI updates
  - View count and click tracking
  - Review system with 5-star rating UI
  - Share functionality: Twitter, LinkedIn, Copy Link
  - Similar agents recommendations
  - Sticky sidebar with quick info
  - Toast notifications for user feedback
  
- **Categories Browsing** (`/categories`):
  - Grid layout with all categories
  - Search categories by name or description
  - Sort by: Most Popular, Name (A-Z/Z-A), Newest
  - Dark mode support
  - Agent count per category
  
- **Category Detail** (`/categories/[slug]`):
  - Category header with icon and description
  - Filter agents by pricing model
  - Search within category
  - Sort options: Popular, Newest, Name, Upvotes
  - Related categories section
  - Breadcrumb navigation

### User Authentication & Dashboard (NEW - Phase 5)
- **Login Page** (`/login`):
  - Email/password authentication
  - Password visibility toggle
  - Remember me functionality
  - Google OAuth placeholder
  - Demo credentials display
  - Loading states and error messages
  
- **Signup Page** (`/signup`):
  - User registration form
  - Real-time password strength indicator (weak/medium/strong)
  - Visual strength bar with colors
  - Password match validation
  - Terms acceptance checkbox
  - Google OAuth placeholder
  
- **Forgot Password** (`/forgot-password`):
  - Email-based password reset
  - Success state with confirmation
  - Reset token generation (1-hour expiry)
  
- **Multi-Step Submit Form** (`/submit`) - 6 Steps:
  - **Step 1**: Basic info (name, URL, tagline, rich text description, pricing, open source)
  - **Step 2**: Visual assets (logo, cover image, up to 5 screenshots with drag-drop)
  - **Step 3**: Categorization (1-3 categories, up to 10 tags with autocomplete)
  - **Step 4**: Features & use cases (up to 10 features, up to 5 use cases)
  - **Step 5**: Additional info (social links, affiliate program, backlink checkbox)
  - **Step 6**: Review & submit (preview all data, terms acceptance)
  - Progress indicator with visual completion
  - Back/Next navigation with validation
  - Auto-save to localStorage
  - Save draft button
  - Success modal with approval timeline
  
- **User Dashboard** (`/dashboard`) - 4 Sections:
  - **Overview**: Statistics cards (submissions, approved, upvotes, reviews)
  - **My Submissions**: Table view with status badges, view/edit/delete actions
  - **My Upvotes**: Grid of upvoted agents with remove button
  - **My Reviews**: List of reviews with edit/delete options
  - **Settings**: Profile management, password change, email preferences, account deletion

### Modern UI/UX Features
- ✅ **Dark Mode**: Full dark mode support with CSS custom properties
- ✅ **Toast Notifications**: Simple DOM-based notifications (success, error, info)
- ✅ **Responsive Design**: Mobile-first with breakpoints for all screens
- ✅ **Skeleton Loaders**: Smooth loading states
- ✅ **Smooth Animations**: Hover effects, transitions, and transform animations
- ✅ **Client-side Filtering**: Fast filtering without server requests
- ✅ **Debounced Search**: Optimized search with 300ms delay
- ✅ **Optimistic UI**: Immediate feedback on upvotes

### Admin Features
- **Dashboard**: Overview statistics and pending submissions
- **Agent Management**: 
  - Complete admin panel with ZERO 404 errors
  - Create new agents with full form
  - Edit existing agents with ALL enhanced fields
  - Approve/reject submissions
  - Delete agents (admin only)
  - Enhanced agent editing with 40+ fields (YouTube, pricing, company info, social media, etc.)
- **Category Management**: 
  - ✅ Create new categories (FIXED)
  - ✅ Edit existing categories (FIXED)
  - ✅ Delete categories with validation (FIXED)
  - View all categories with pagination
- **User Management**: 
  - ✅ View user profiles with statistics (FIXED)
  - ✅ List all users with search and filtering (FIXED)
  - ✅ Edit user roles and details (FIXED)
  - View user submissions, reviews, and upvotes
- **Agent Sub-Resources Management**:
  - Features: Add, edit, delete agent features
  - Use Cases: Manage real-world application examples
  - FAQs: Create comprehensive FAQ sections
  - Pricing Plans: Define multiple pricing tiers with features
  - Screenshots: Upload and manage agent screenshots gallery
  - Pros & Cons: Add balanced product reviews
- **Review Moderation**: Approve or reject user reviews
- **Audit Logs**: Track all admin actions
- **Analytics**: View detailed statistics

### Authentication & Security (Phase 5 Enhanced)
- **JWT-based Authentication**: Secure token-based auth with Web Crypto API
- **Role-based Access**: USER, MODERATOR, ADMIN roles
- **Password Reset Flow**: Email-based token system with 1-hour expiry
- **Password Strength Validation**: Real-time indicator with weak/medium/strong levels
- **Form Validation**: Client-side + server-side with Zod schemas
- **Rate Limiting**: 5 submissions per day per user (to be implemented)
- **Spam Detection**: Duplicate URL prevention (to be implemented)
- **XSS Prevention**: Rich text sanitization (to be implemented)
- **Demo Credentials**: Quick testing with pre-seeded users

## 🛠️ Tech Stack

- **Framework**: Hono (lightweight edge framework)
- **Runtime**: Cloudflare Workers/Pages
- **Database**: Cloudflare D1 (SQLite)
- **Frontend**: Vanilla JavaScript + TailwindCSS + Font Awesome
- **Authentication**: JWT with Web Crypto API
- **Deployment**: Cloudflare Pages (edge-first)

## 📊 Data Architecture

### Database Schema

#### Users Table
- User accounts with roles (USER, ADMIN, MODERATOR)
- Email-based authentication
- Profile information and timestamps

#### Agents Table (Enhanced - Phase 6)
- Core agent information (name, description, tagline, long_description)
- Pricing models (FREE, PAID, FREEMIUM, CONTACT)
- **NEW**: Detailed pricing (pricing_starts_at, free_plan_available, free_trial_days)
- Status workflow (PENDING → APPROVED/REJECTED)
- Featured tiers (NONE, SEO_BOOST, PREMIUM, BANNER)
- Statistics (views, upvotes, clicks, reviews)
- SEO metadata (meta_title, meta_description, keywords)
- **NEW**: Media fields (youtube_url, demo_video_url, video_thumbnail)
- **NEW**: Company information (company_name, company_website, founded_year, headquarters)
- **NEW**: Social media links (Twitter, LinkedIn, Facebook, Discord, GitHub)
- **NEW**: Technical details (API availability, supported platforms/languages/integrations)
- **NEW**: Trust indicators (verified status, trust_score, uptime_percentage)
- **NEW**: Alternatives/competitors (JSON array of related agent IDs)

#### Categories Table
- Hierarchical category structure
- Parent-child relationships for subcategories
- Agent counts and display ordering

#### Tags Table
- Flexible tagging system
- Many-to-many with agents
- Agent counts per tag

#### Features & Use Cases Tables
- Bullet points for agent capabilities
- Real-world application examples

#### Agent FAQs Table (NEW - Phase 6)
- Question and answer pairs for common inquiries
- Display ordering for organized presentation
- Fully manageable by admin

#### Pricing Plans Table (NEW - Phase 6)
- Multiple pricing tiers per agent (Free, Pro, Enterprise)
- Features list per plan (JSON array)
- Billing periods (monthly, yearly, one-time)
- CTA buttons with custom text and URLs
- Popular plan highlighting

#### Agent Screenshots Table (NEW - Phase 6)
- Image gallery for agent showcases
- Titles and descriptions for each screenshot
- Display ordering for organized presentation

#### Agent Pros & Cons Table (NEW - Phase 6)
- Balanced product reviews
- Separate PRO and CON lists
- Display ordering for prioritization

#### Upvotes Table
- User-agent voting relationships
- One upvote per user per agent

#### Reviews Table
- 5-star rating system
- Text reviews with moderation
- Helpful count voting

#### Sponsorships Table
- Featured agent sponsorships
- Tier-based pricing
- Time-limited campaigns

### Relationships
- Users → Agents (one-to-many)
- Agents ↔ Categories (many-to-many)
- Agents ↔ Tags (many-to-many)
- Agents → Features (one-to-many)
- Agents → Use Cases (one-to-many)
- Users ↔ Agents via Upvotes (many-to-many)
- Users → Reviews → Agents

## 📁 Project Structure

```
webapp/
├── src/
│   ├── index.tsx              # Main application entry point
│   ├── types.ts               # TypeScript type definitions
│   ├── lib/
│   │   ├── auth.ts            # JWT authentication utilities
│   │   └── db.ts              # Database helper functions
│   ├── routes/
│   │   ├── auth.ts            # Authentication endpoints (enhanced)
│   │   ├── agents.ts          # Agent CRUD operations
│   │   ├── categories.ts      # Category endpoints
│   │   ├── admin.ts           # Admin panel endpoints
│   │   └── users.ts           # User profile endpoints (enhanced)
│   ├── auth-pages.tsx         # Login, Signup, Forgot Password (NEW)
│   ├── submit-form.tsx        # Multi-step agent submission (NEW)
│   ├── dashboard-page.tsx     # User dashboard with 4 sections (NEW)
│   ├── public-pages.tsx       # Enhanced homepage
│   ├── agents-pages.tsx       # Agent listing and detail pages
│   ├── categories-pages.tsx   # Categories pages
│   ├── enhanced-pages.tsx     # Leaderboard, Landscape pages
│   ├── admin-ui.tsx           # Admin dashboard UI
│   ├── admin-pages.tsx        # Admin sub-pages
│   └── admin-agent-forms.tsx  # Admin create/edit forms
├── migrations/
│   └── 0001_initial_schema.sql  # Database schema
├── public/                    # Static assets (if needed)
├── seed.sql                   # Test data
├── ecosystem.config.cjs       # PM2 configuration
├── wrangler.jsonc             # Cloudflare configuration
├── package.json               # Dependencies and scripts
└── README.md                  # This file (updated)
```

## 🔌 API Endpoints

### Public Endpoints

#### Public API (`/api/public/*`)
- `GET /api/public/agents` - List all approved agents with categories
- `GET /api/public/stats` - Get public statistics (agents, categories, upvotes, reviews)
- `GET /api/public/newly-added?limit=10` - Get recently added agents (last 30 days)
- `GET /api/public/trending?limit=10` - Get trending agents (last 7 days by views)
- `GET /api/public/categories/popular?limit=12` - Get popular categories with agent counts
- `GET /api/public/:slug/details` - Get comprehensive agent details including:
  - Agent basic info with all enhanced fields
  - Features list
  - Use cases list
  - FAQ section
  - Pricing plans with features
  - Screenshots gallery
  - Pros and cons lists
  - Reviews with user info (top 10)
  - Review statistics (average rating, star distribution)
  - Similar agents (6 from same category)
  - Alternative/competitor agents
- `POST /api/public/:id/upvote` - Toggle upvote (guest or authenticated)
- `POST /api/public/:id/click` - Track website click and increment count
- `POST /api/public/newsletter/subscribe` - Subscribe to newsletter with email

#### Agents
- `GET /api/agents` - List all agents with pagination and filters
  - Query params: `page`, `limit`, `status`, `category_id`, `pricing_model`, `search`, `sort`, `order`
- `GET /api/agents/stats` - Get overall statistics
- `GET /api/agents/:slug` - Get single agent details
- `POST /api/agents/submit` - Submit new agent (no auth required)
- `POST /api/agents/:id/upvote` - Toggle upvote (requires auth)
- `POST /api/agents/:id/click` - Track website click

#### Categories
- `GET /api/categories` - List all categories
  - Query params: `slug` - Filter by slug
- `GET /api/categories/:slug` - Get single category with subcategories

#### Users
- `GET /api/users/:id` - Get user profile
- `GET /api/users/:id/agents` - Get user's submitted agents
- `GET /api/users/:id/upvotes` - Get user's upvoted agents (requires auth)
- `GET /api/users/:id/reviews` - Get user's reviews

### Authentication Endpoints (Phase 5 Enhanced)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/forgot-password` - Request password reset (generates token)
- `POST /api/auth/reset-password` - Reset password with token
- `POST /api/submit` - Submit agent (requires authentication)

### User Dashboard Endpoints (NEW - Phase 5)
- `GET /api/user/profile` - Get current user profile
- `PATCH /api/user/profile` - Update profile (name, email, bio)
- `GET /api/user/submissions` - Get user's submitted agents
- `GET /api/user/upvotes` - Get user's upvoted agents
- `GET /api/user/reviews` - Get user's reviews
- `GET /api/user/stats` - Get user statistics
- `POST /api/user/change-password` - Change password
- `PATCH /api/user/email-preferences` - Update email preferences
- `DELETE /api/user/account` - Delete user account (with cascade)

### Admin Endpoints (Requires Auth) - Enhanced Phase 6

#### Agent Management
- `GET /api/admin/stats` - Admin dashboard statistics
- `GET /api/admin/agents/pending` - List pending submissions
- `GET /api/admin/agents/all` - List all agents with pagination and filters
- `GET /api/admin/agents/:id` - Get agent for review
- `PUT /api/admin/agents/:id/approve` - Approve agent
- `PUT /api/admin/agents/:id/reject` - Reject agent
- `PUT /api/admin/agents/:id` - Update agent details (40+ fields supported)
- `DELETE /api/admin/agents/:id` - Delete agent (admin only)

#### Category Management (NEW)
- `GET /api/admin/categories` - List all categories with pagination
- `GET /api/admin/categories/:id` - Get single category details
- `POST /api/admin/categories` - Create new category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category (with validation)

#### User Management (NEW)
- `GET /api/admin/users` - List all users with pagination and search
- `GET /api/admin/users/:id` - Get user profile with statistics
- `PUT /api/admin/users/:id` - Update user details (role, email, etc.)
- `DELETE /api/admin/users/:id` - Delete user (admin only)

#### Agent Sub-Resources (NEW - All require admin auth)

**Features:**
- `POST /api/admin/agents/:id/features` - Add feature
- `PUT /api/admin/agents/:agentId/features/:featureId` - Update feature
- `DELETE /api/admin/agents/:agentId/features/:featureId` - Delete feature

**Use Cases:**
- `POST /api/admin/agents/:id/use-cases` - Add use case
- `PUT /api/admin/agents/:agentId/use-cases/:useCaseId` - Update use case
- `DELETE /api/admin/agents/:agentId/use-cases/:useCaseId` - Delete use case

**FAQs:**
- `POST /api/admin/agents/:id/faqs` - Add FAQ
- `PUT /api/admin/agents/:agentId/faqs/:faqId` - Update FAQ
- `DELETE /api/admin/agents/:agentId/faqs/:faqId` - Delete FAQ

**Pricing Plans:**
- `POST /api/admin/agents/:id/pricing-plans` - Add pricing plan
- `PUT /api/admin/agents/:agentId/pricing-plans/:planId` - Update pricing plan
- `DELETE /api/admin/agents/:agentId/pricing-plans/:planId` - Delete pricing plan

**Screenshots:**
- `POST /api/admin/agents/:id/screenshots` - Add screenshot
- `PUT /api/admin/agents/:agentId/screenshots/:screenshotId` - Update screenshot
- `DELETE /api/admin/agents/:agentId/screenshots/:screenshotId` - Delete screenshot

**Pros & Cons:**
- `POST /api/admin/agents/:id/pros-cons` - Add pro/con
- `PUT /api/admin/agents/:agentId/pros-cons/:id` - Update pro/con
- `DELETE /api/admin/agents/:agentId/pros-cons/:id` - Delete pro/con

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Cloudflare account (for production deployment)

### Local Development

1. **Clone the repository**
```bash
cd /home/user/webapp
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup local database**
```bash
# Apply database migrations
npm run db:migrate:local

# Seed with test data
npm run db:seed
```

4. **Build the project**
```bash
npm run build
```

5. **Start development server**
```bash
# Using PM2 (recommended for sandbox)
pm2 start ecosystem.config.cjs

# Or using npm script
npm run dev:sandbox
```

6. **Access the application**
- Local: http://localhost:3000
- Sandbox: https://3000-izrhvxrc8y0zaw0u52v89-2e1b9533.sandbox.novita.ai

### Demo Credentials

**Admin Account:**
- Email: `admin@aiagents.directory`
- Password: `admin123`

**Moderator Account:**
- Email: `moderator@aiagents.directory`
- Password: `moderator123`

**User Account:**
- Email: `user@example.com`
- Password: `user123`

### Demo Data

The database includes **11 test agents** for demonstration:

**Approved Agents (9):**
1. **ChatGPT** - Conversational AI (FREEMIUM)
2. **Claude** - AI Assistant (FREEMIUM)
3. **GitHub Copilot** - AI Pair Programmer (PAID)
4. **Midjourney** - AI Art Generation (PAID)
5. **Perplexity AI** - AI Search Engine (FREEMIUM)
6. **Jasper AI** - Content Writing (PAID, SEO_BOOST featured)
7. **Runway ML** - Video Editing AI (FREEMIUM, PREMIUM featured)
8. **Hugging Face** - Open-Source NLP Models (FREE, Open Source)
9. **Replicate** - Cloud ML API (PAID)

**Pending Agents (2):**
- **Pending Agent** - Generic test agent (FREE)
- **Synthesia** - AI Video Creation (PAID)

These agents demonstrate various pricing models, featured tiers, and approval statuses for testing the admin panel functionality.

## 📦 Available Scripts

```bash
# Development
npm run dev              # Vite dev server (local)
npm run dev:sandbox      # Wrangler dev with D1 (sandbox)
npm run build            # Build for production

# Database
npm run db:migrate:local # Apply migrations locally
npm run db:migrate:prod  # Apply migrations to production
npm run db:seed          # Seed database with test data
npm run db:reset         # Reset local database
npm run db:console:local # Open local database console
npm run db:console:prod  # Open production database console

# Deployment
npm run deploy           # Build and deploy to Cloudflare
npm run deploy:prod      # Deploy to specific project

# Utilities
npm run clean-port       # Kill process on port 3000
npm run test             # Test local server
npm run git:commit       # Quick git commit
```

## 🌐 Deployment to Cloudflare Pages

### Step 1: Create Cloudflare D1 Database

```bash
# Create production database
npx wrangler d1 create webapp-production

# Copy the database_id and update wrangler.jsonc
```

### Step 2: Update Configuration

Edit `wrangler.jsonc`:
```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "webapp-production",
      "database_id": "your-actual-database-id-here"
    }
  ]
}
```

### Step 3: Apply Migrations to Production

```bash
npm run db:migrate:prod
```

### Step 4: Deploy to Cloudflare Pages

```bash
# First deployment
npm run build
npx wrangler pages project create webapp --production-branch main

# Deploy
npm run deploy:prod
```

### Step 5: Set Environment Variables (Optional)

```bash
# Set JWT secret
npx wrangler pages secret put JWT_SECRET --project-name webapp
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: SHA-256 with secret salt
- **Role-based Access Control**: USER, MODERATOR, ADMIN roles
- **SQL Injection Prevention**: Prepared statements with parameter binding
- **CORS Configuration**: Controlled cross-origin resource sharing

## 📈 Current Status

### ✅ Completed Features (Phase 1-6)

#### Phase 1-2: Core Platform
- [x] Database schema with comprehensive relationships
- [x] JWT authentication system
- [x] Enhanced homepage with search, trending, newly added sections
- [x] Advanced agent listing page with filters and dark mode
- [x] Individual agent detail pages with tabs and reviews UI
- [x] Categories browsing page with search and sort
- [x] Category detail pages with filtering
- [x] Complete admin panel (ZERO 404 errors)
- [x] Admin agent create/edit forms
- [x] Agent approval/rejection workflow
- [x] Upvoting system with optimistic UI
- [x] Newsletter subscription system
- [x] Dark mode support across all pages
- [x] Toast notification system
- [x] Review system UI (star ratings, form)
- [x] Share functionality (Twitter, LinkedIn, Copy Link)
- [x] Click and view tracking
- [x] Similar agents recommendations
- [x] Responsive design with mobile menu
- [x] API documentation
- [x] Local development with PM2
- [x] Git repository initialized

#### Phase 5: User Authentication & Dashboard (NEW)
- [x] Login page with password toggle and remember me
- [x] Signup page with password strength indicator
- [x] Forgot password flow with email-based reset
- [x] Reset password with token validation
- [x] Multi-step submit form (6 steps) with progress indicator
- [x] Step 1: Basic information with rich text editor toolbar
- [x] Step 2: Visual assets upload (logo, cover, screenshots)
- [x] Step 3: Categories (1-3) and tags (up to 10) with autocomplete
- [x] Step 4: Features (up to 10) and use cases (up to 5)
- [x] Step 5: Social links and affiliate program
- [x] Step 6: Review and submit with preview
- [x] Form auto-save to localStorage
- [x] Save draft functionality
- [x] Form validation with error messages
- [x] Success modal with approval timeline
- [x] User dashboard with 4 sections
- [x] Dashboard: My Submissions table with status badges
- [x] Dashboard: My Upvotes grid with remove button
- [x] Dashboard: My Reviews list with edit/delete
- [x] Dashboard: Profile settings with avatar upload
- [x] Dashboard: Password change functionality
- [x] Dashboard: Email preferences management
- [x] Dashboard: Account deletion with confirmation
- [x] Protected routes with authentication check
- [x] User profile API endpoints (11 new endpoints)
- [x] Responsive design for all auth/dashboard pages

#### Phase 6: Enhanced Agent Details & Admin Management (NEW)
- [x] **Admin Category Management** - Full CRUD operations for categories (FIXED)
- [x] **Admin User Management** - View profiles, edit roles, manage users (FIXED)
- [x] **Voting System Database Integration** - Real-time vote tracking (VERIFIED)
- [x] **Enhanced Agent Schema** - 40+ new fields:
  - [x] YouTube and video URLs with thumbnails
  - [x] Detailed pricing information (starts at, free plan, trial days)
  - [x] Company information (name, website, founded year, size, headquarters)
  - [x] Social media links (Twitter, LinkedIn, Facebook, Discord, GitHub)
  - [x] Technical details (API docs, supported platforms/languages/integrations)
  - [x] Trust indicators (verified status, trust score, uptime percentage)
  - [x] Alternatives/competitors list
- [x] **Agent FAQs System** - Create and manage FAQ sections
- [x] **Pricing Plans Table** - Multiple tiers with features and CTAs
- [x] **Screenshots Gallery** - Image management system
- [x] **Pros & Cons Lists** - Balanced product reviews
- [x] **Comprehensive Agent Detail API** - Single endpoint returns:
  - Agent with all enhanced fields
  - Features, use cases, FAQs
  - Pricing plans, screenshots, pros/cons
  - Reviews with statistics and star distribution
  - Similar agents (6) and alternatives
- [x] **Admin Sub-Resource Management** - 18 new endpoints:
  - Features: Add/Edit/Delete
  - Use Cases: Add/Edit/Delete
  - FAQs: Add/Edit/Delete
  - Pricing Plans: Add/Edit/Delete
  - Screenshots: Add/Edit/Delete
  - Pros & Cons: Add/Edit/Delete
- [x] **Migration System** - Database migrations applied successfully
- [x] **Documentation Updated** - README reflects all new features

### 🚧 Recommended Next Steps (Phase 6)

1. **Security Enhancements**:
   - ✅ Password reset system (Phase 5 completed)
   - ⚠️ Rate limiting on submission endpoint (5/day per user)
   - ⚠️ Spam detection for duplicate URLs
   - ⚠️ XSS prevention with rich text sanitization
   - ⚠️ CSRF token implementation
   - ⚠️ Email verification before first submission

2. **Rich Text Editor Integration**:
   - Add TipTap or TinyMCE for description field
   - Support markdown in agent descriptions
   - Rich formatting for features and use cases
   - Preview mode before saving
   - Image paste support

3. **Image Upload System**:
   - Integrate Cloudflare R2 for image storage
   - Upload agent logos and screenshots
   - Image optimization and resizing (Sharp or similar)
   - Gallery management in admin panel
   - Drag-and-drop reordering

4. **Email Notifications**:
   - Setup Resend API or SendGrid
   - Welcome email on signup
   - Password reset emails
   - Submission confirmation emails
   - Approval/rejection notifications
   - Newsletter campaigns

5. **OAuth Integration**:
   - Google Sign-In implementation
   - GitHub OAuth
   - Twitter/X OAuth (optional)
   - Social profile data import

6. **Review System Backend**:
   - Complete review submission API
   - Review moderation by moderators
   - Helpful vote functionality
   - Review analytics
   - Edit/delete review endpoints

7. **Admin Enhancements**:
   - Bulk operations for agents
   - Analytics dashboard with Chart.js
   - Featured agent management
   - Sponsorship management UI
   - User management (ban, promote to moderator)

8. **Search Enhancement**:
   - Full-text search with better ranking
   - Search autocomplete with suggestions
   - Search history per user
   - Popular searches display
   - Elasticsearch integration (optional)

9. **SEO Optimization**:
   - Generate XML sitemaps dynamically
   - Add comprehensive meta tags per page
   - Implement JSON-LD structured data
   - Create robots.txt
   - Add canonical URLs
   - OpenGraph image generation

10. **Framer Motion Animations** (optional):
    - Page transitions
    - Card entrance animations
    - Hover effects with spring physics
    - Scroll-triggered animations

## 🐛 Known Limitations & Future Enhancements

### Current Limitations
1. **No File Uploads**: Logo URLs are stored as text (Cloudflare R2 integration pending)
2. **Simple Authentication**: No OAuth providers yet (Google, GitHub integration planned)
3. **No Real-time Updates**: Uses polling instead of WebSockets (can use Cloudflare Durable Objects)
4. **Plain Text Descriptions**: Rich text editor not yet integrated (TinyMCE/Quill pending)
5. **Review Backend Incomplete**: Review submission UI ready, backend API in progress
6. **No Image Processing**: Images are linked externally (R2 + image optimization pending)
7. **Basic Animations**: Framer Motion not yet integrated
8. **No Email System**: Newsletter subscribers stored but no email sending yet

### Easy Wins (Can be added quickly)
- Email notifications via SendGrid/Resend API
- OAuth providers via Auth0 or Clerk
- Image uploads to Cloudflare R2
- Rich text editor (TinyMCE CDN)
- Advanced analytics with Chart.js
- SEO meta tags and sitemaps

## 🤝 Contributing

This is a demo project. To extend functionality:

1. Add new routes in `src/routes/`
2. Update database schema in `migrations/`
3. Add TypeScript types in `src/types.ts`
4. Test locally before deploying

## 📄 License

This project is open source and available for educational purposes.

## 🙏 Credits

- **Framework**: [Hono](https://hono.dev)
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com)
- **Database**: [Cloudflare D1](https://developers.cloudflare.com/d1)
- **UI**: [TailwindCSS](https://tailwindcss.com) + [Font Awesome](https://fontawesome.com)

## 📞 Support

For questions or issues:
- Check the API documentation above
- Review the code comments
- Test endpoints with curl or Postman

---

**Built with ❤️ using Hono and Cloudflare Workers**
