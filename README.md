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
- **Homepage**: Featured agents, stats, and category browsing
- **Agent Listing**: Browse all agents with filters and search
- **Agent Details**: Comprehensive information including features, use cases, and reviews
- **Submit Agent**: User-friendly form for submitting new AI agents
- **Categories**: Browse agents by category with subcategory support
- **Search & Filters**: Filter by pricing model, category, open source status
- **Upvoting System**: Community-driven ranking of agents

### Admin Features
- **Dashboard**: Overview statistics and pending submissions
- **Agent Management**: Approve, reject, or edit agent submissions
- **Category Management**: Organize agents into categories
- **User Management**: View user profiles and activity
- **Review Moderation**: Approve or reject user reviews

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

### ✅ Completed Features
- [x] Database schema with comprehensive relationships
- [x] JWT authentication system
- [x] Public homepage with stats and featured agents
- [x] Agent listing page with filters
- [x] Agent submission form
- [x] Admin dashboard with statistics
- [x] Agent approval/rejection workflow
- [x] Upvoting system
- [x] Category browsing
- [x] Review system (backend ready)
- [x] API documentation
- [x] Local development with PM2
- [x] Git repository initialized

### 🚧 Recommended Next Steps

1. **Agent Detail Page**: Create individual agent detail pages with:
   - Full description and features
   - Screenshots gallery
   - Reviews and ratings display
   - Related agents section

2. **Review System Frontend**: Build UI for:
   - Writing reviews
   - Rating agents
   - Marking reviews as helpful
   - Review moderation interface

3. **Advanced Filtering**: Enhance agent listing with:
   - Multi-select filters
   - Tag-based filtering
   - Sort by popularity, date, rating
   - Saved searches

4. **User Dashboard**: Create user profile pages with:
   - Submitted agents management
   - Upvoted agents collection
   - Review history
   - Account settings

5. **Admin Enhancements**:
   - Bulk operations for agents
   - Analytics dashboard with charts
   - Featured agent management
   - Sponsorship management UI

6. **Search Enhancement**:
   - Full-text search across agents
   - Search autocomplete
   - Search history
   - Popular searches

7. **Social Features**:
   - Share agent links
   - Email notifications
   - Newsletter integration
   - Social media cards (OG tags)

8. **SEO Optimization**:
   - Generate sitemaps
   - Add meta tags for all pages
   - Implement structured data
   - Create robots.txt

## 🐛 Known Limitations

1. **No File Uploads**: Logo URLs are stored as text (use external image hosting)
2. **Simple Authentication**: No OAuth providers yet (can be added)
3. **No Real-time Updates**: Uses polling instead of WebSockets
4. **Limited Rich Text**: Description is plain text (can add markdown)
5. **No Image Processing**: Images are linked, not stored/processed

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
