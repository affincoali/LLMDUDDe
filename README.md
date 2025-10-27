# AI Agents Directory

A comprehensive directory platform for discovering, submitting, and managing AI agents and tools. Built with Hono framework on Cloudflare Pages with D1 SQLite database for edge-first deployment.

## 🚀 Live Demo

- **Development**: https://3000-izrhvxrc8y0zaw0u52v89-2e1b9533.sandbox.novita.ai
- **Production**: (Deploy to Cloudflare Pages)

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

- **Submit Agent**: User-friendly form for submitting new AI agents

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
  - Edit existing agents
  - Approve/reject submissions
  - Delete agents (admin only)
- **Category Management**: Organize agents into categories
- **User Management**: View user profiles and activity
- **Review Moderation**: Approve or reject user reviews
- **Audit Logs**: Track all admin actions
- **Analytics**: View detailed statistics

### Authentication
- **JWT-based Authentication**: Secure token-based auth
- **Role-based Access**: USER, MODERATOR, ADMIN roles
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

#### Agents Table
- Core agent information (name, description, tagline)
- Pricing models (FREE, PAID, FREEMIUM, CONTACT)
- Status workflow (PENDING → APPROVED/REJECTED)
- Featured tiers (NONE, SEO_BOOST, PREMIUM, BANNER)
- Statistics (views, upvotes, clicks, reviews)
- SEO metadata

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
│   ├── index.tsx           # Main application entry point
│   ├── types.ts            # TypeScript type definitions
│   ├── lib/
│   │   ├── auth.ts         # JWT authentication utilities
│   │   └── db.ts           # Database helper functions
│   └── routes/
│       ├── auth.ts         # Authentication endpoints
│       ├── agents.ts       # Agent CRUD operations
│       ├── categories.ts   # Category endpoints
│       ├── admin.ts        # Admin panel endpoints
│       └── users.ts        # User profile endpoints
├── migrations/
│   └── 0001_initial_schema.sql  # Database schema
├── public/                 # Static assets (if needed)
├── seed.sql                # Test data
├── ecosystem.config.cjs    # PM2 configuration
├── wrangler.jsonc          # Cloudflare configuration
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## 🔌 API Endpoints

### Public Endpoints

#### Public API (`/api/public/*`)
- `GET /api/public/agents` - List all approved agents with categories
- `GET /api/public/stats` - Get public statistics (agents, categories, upvotes, reviews)
- `GET /api/public/newly-added?limit=10` - Get recently added agents (last 30 days)
- `GET /api/public/trending?limit=10` - Get trending agents (last 7 days by views)
- `GET /api/public/categories/popular?limit=12` - Get popular categories with agent counts
- `GET /api/public/:slug/details` - Get agent details with similar recommendations
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

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info

### Admin Endpoints (Requires Auth)
- `GET /api/admin/stats` - Admin dashboard statistics
- `GET /api/admin/agents/pending` - List pending submissions
- `GET /api/admin/agents/:id` - Get agent for review
- `PUT /api/admin/agents/:id/approve` - Approve agent
- `PUT /api/admin/agents/:id/reject` - Reject agent
- `PUT /api/admin/agents/:id` - Update agent details
- `DELETE /api/admin/agents/:id` - Delete agent (admin only)

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

### ✅ Completed Features (Phase 1 & 2)
- [x] Database schema with comprehensive relationships
- [x] JWT authentication system
- [x] Enhanced homepage with search, trending, newly added sections
- [x] Advanced agent listing page with filters and dark mode
- [x] Individual agent detail pages with tabs and reviews UI
- [x] Categories browsing page with search and sort
- [x] Category detail pages with filtering
- [x] Agent submission form
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

### 🚧 Recommended Next Steps (Phase 3)

1. **Rich Text Editor Integration**:
   - Add TinyMCE or Quill to admin forms
   - Support markdown in agent descriptions
   - Rich formatting for features and use cases
   - Preview mode before saving

2. **Image Upload System**:
   - Integrate Cloudflare R2 for image storage
   - Upload agent logos and screenshots
   - Image optimization and resizing
   - Gallery management in admin panel

3. **Review System Backend**:
   - Complete review submission API
   - Review moderation by moderators
   - Helpful vote functionality
   - Review analytics

4. **Framer Motion Animations**:
   - Page transitions
   - Card entrance animations
   - Hover effects with spring physics
   - Scroll-triggered animations

5. **User Dashboard**: Create user profile pages with:
   - Submitted agents management
   - Upvoted agents collection
   - Review history
   - Account settings

6. **Admin Enhancements**:
   - Bulk operations for agents
   - Analytics dashboard with charts
   - Featured agent management
   - Sponsorship management UI

7. **Search Enhancement**:
   - Full-text search with better ranking
   - Search autocomplete
   - Search history
   - Popular searches display

8. **Social Features**:
   - Email notifications for approvals
   - Newsletter campaigns
   - Social media cards (OG tags)
   - OpenGraph image generation

9. **SEO Optimization**:
   - Generate XML sitemaps
   - Add comprehensive meta tags
   - Implement JSON-LD structured data
   - Create robots.txt
   - Add canonical URLs

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
