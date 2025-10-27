# Deployment Guide

Complete guide for deploying the AI Agents Directory to Cloudflare Pages.

## 📋 Prerequisites

1. **Cloudflare Account**: Sign up at [Cloudflare](https://dash.cloudflare.com/sign-up)
2. **Wrangler CLI**: Already installed in this project
3. **Node.js 18+**: For building the project
4. **Git Repository**: For version control (already initialized)

---

## 🚀 Quick Deployment (5 Minutes)

### Step 1: Authenticate with Cloudflare

You'll need your Cloudflare API token for deployment:

```bash
# Login to Cloudflare (this will open browser)
npx wrangler login
```

Or set up API token manually:
```bash
# Get your API token from: https://dash.cloudflare.com/profile/api-tokens
export CLOUDFLARE_API_TOKEN="your-token-here"
```

### Step 2: Create Production Database

```bash
# Create D1 database
npx wrangler d1 create webapp-production
```

**Important**: Copy the `database_id` from the output!

Output will look like:
```
✅ Successfully created DB 'webapp-production'

[[d1_databases]]
binding = "DB"
database_name = "webapp-production"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### Step 3: Update Configuration

Edit `wrangler.jsonc` and replace the database_id:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "webapp",
  "compatibility_date": "2025-10-27",
  "pages_build_output_dir": "./dist",
  "compatibility_flags": ["nodejs_compat"],
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "webapp-production",
      "database_id": "PASTE-YOUR-DATABASE-ID-HERE"
    }
  ]
}
```

### Step 4: Apply Database Migrations

```bash
# Apply schema to production database
npx wrangler d1 migrations apply webapp-production
```

You should see:
```
✅ Migrations applied successfully
```

### Step 5: Build the Project

```bash
npm run build
```

This creates the `dist/` folder with:
- `_worker.js` - Your compiled application
- `_routes.json` - Routing configuration

### Step 6: Create Cloudflare Pages Project

```bash
# Create project (use 'main' branch as production)
npx wrangler pages project create webapp --production-branch main
```

### Step 7: Deploy to Cloudflare

```bash
# Deploy the built application
npx wrangler pages deploy dist --project-name webapp
```

You'll see output like:
```
✨ Success! Uploaded 2 files

✨ Deployment complete! Take a peek over at
   https://xxxxxxxx.webapp.pages.dev
```

### Step 8: (Optional) Seed Production Data

**Warning**: Only do this for testing. Don't seed production with demo data!

```bash
npx wrangler d1 execute webapp-production --file=./seed.sql
```

---

## 🎯 Your Application is Live!

You'll receive two URLs:

1. **Production URL**: `https://webapp.pages.dev`
2. **Branch URL**: `https://main.webapp.pages.dev`

Test your deployment:
```bash
curl https://webapp.pages.dev/api/agents/stats
```

---

## 🔐 Environment Variables & Secrets

### Set JWT Secret (Recommended)

```bash
# Set a secure JWT secret for production
npx wrangler pages secret put JWT_SECRET --project-name webapp
# Enter a long random string when prompted
```

### Set Other Secrets

```bash
# Example: Set external API keys
npx wrangler pages secret put OPENAI_API_KEY --project-name webapp
```

### List Current Secrets

```bash
npx wrangler pages secret list --project-name webapp
```

---

## 🌐 Custom Domain Setup

### Add Custom Domain

```bash
# Add your custom domain
npx wrangler pages domain add yourdomain.com --project-name webapp
```

### DNS Configuration

1. Go to Cloudflare DNS settings
2. Add CNAME record:
   - **Name**: `@` or `www`
   - **Target**: `webapp.pages.dev`
   - **Proxy status**: Proxied (orange cloud)

3. Wait for DNS propagation (usually 5-10 minutes)

---

## 🔄 Continuous Deployment

### Option 1: Manual Deployment

Every time you make changes:
```bash
npm run build
npx wrangler pages deploy dist --project-name webapp
```

Or use the npm script:
```bash
npm run deploy:prod
```

### Option 2: GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: pages deploy dist --project-name=webapp
```

**Setup**:
1. Go to GitHub repository settings
2. Add secret: `CLOUDFLARE_API_TOKEN`
3. Push to main branch → automatic deployment!

---

## 📊 Monitoring & Analytics

### View Deployment Logs

```bash
npx wrangler pages deployment list --project-name webapp
```

### View Application Logs

```bash
npx wrangler tail --project-name webapp
```

### Check Database

```bash
# Query production database
npx wrangler d1 execute webapp-production \
  --command="SELECT COUNT(*) as total FROM agents"
```

---

## 🔧 Database Management

### View Database Info

```bash
npx wrangler d1 info webapp-production
```

### Backup Database

```bash
# Export to SQL file
npx wrangler d1 export webapp-production --output=backup.sql
```

### Execute SQL Query

```bash
# Single query
npx wrangler d1 execute webapp-production \
  --command="SELECT * FROM agents WHERE status='PENDING'"
```

### Run SQL File

```bash
# Execute SQL file
npx wrangler d1 execute webapp-production --file=migration.sql
```

---

## 🐛 Troubleshooting

### Build Fails

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Database Connection Error

Check your `wrangler.jsonc`:
- Is `database_id` correct?
- Did you run migrations?

```bash
# Verify database exists
npx wrangler d1 list

# Reapply migrations
npx wrangler d1 migrations apply webapp-production
```

### 404 Errors in Production

Check `dist/_routes.json` was created:
```bash
cat dist/_routes.json
```

Should contain routing rules for your API.

### Authentication Issues

Check JWT secret:
```bash
npx wrangler pages secret list --project-name webapp
```

If missing, set it:
```bash
npx wrangler pages secret put JWT_SECRET --project-name webapp
```

---

## 🔄 Migration Guide

### Adding New Database Fields

1. Create new migration file:
```bash
# Create migrations/0002_add_field.sql
echo "ALTER TABLE agents ADD COLUMN featured INTEGER DEFAULT 0;" > migrations/0002_add_field.sql
```

2. Apply locally first:
```bash
npm run db:migrate:local
```

3. Test thoroughly locally

4. Apply to production:
```bash
npx wrangler d1 migrations apply webapp-production
```

5. Deploy code:
```bash
npm run deploy:prod
```

---

## 📈 Scaling Considerations

### Free Tier Limits (Cloudflare Pages)

- **Requests**: 100,000/day
- **D1 Database**: 5GB storage, 5M reads/day, 100K writes/day
- **Pages Functions**: 100,000 invocations/day

### Upgrading to Paid Plan

When you need more:
1. Go to Cloudflare Dashboard
2. Navigate to Pages → Plans
3. Upgrade to Pro or Business plan

### Performance Optimization

1. **Enable Caching**:
```typescript
// Add in routes
c.header('Cache-Control', 'public, max-age=3600')
```

2. **Add Database Indexes** (already included):
   - Agent slug, status
   - Category slug
   - User email

3. **Optimize Queries**:
   - Use pagination
   - Limit returned fields
   - Add WHERE clauses

---

## 🔒 Security Checklist

Before going live:

- [ ] Change JWT_SECRET from default
- [ ] Set up proper CORS origins
- [ ] Enable Cloudflare WAF rules
- [ ] Add rate limiting
- [ ] Review admin user accounts
- [ ] Remove or secure test data
- [ ] Enable HTTPS only (automatic on Cloudflare)
- [ ] Set up monitoring and alerts

---

## 📱 Testing Production

### API Health Check

```bash
# Test stats endpoint
curl https://webapp.pages.dev/api/agents/stats

# Test agents listing
curl https://webapp.pages.dev/api/agents?limit=5

# Test authentication
curl -X POST https://webapp.pages.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@aiagents.directory","password":"admin123"}'
```

### Load Testing

```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Test with 100 requests, 10 concurrent
ab -n 100 -c 10 https://webapp.pages.dev/api/agents
```

---

## 📞 Support & Resources

- **Cloudflare Docs**: https://developers.cloudflare.com/pages
- **D1 Documentation**: https://developers.cloudflare.com/d1
- **Wrangler CLI**: https://developers.cloudflare.com/workers/wrangler
- **Community Discord**: https://discord.gg/cloudflaredev

---

## ✅ Post-Deployment Checklist

After deployment:

- [ ] Test all public pages (homepage, agents, submit)
- [ ] Test API endpoints
- [ ] Test authentication and login
- [ ] Test admin panel
- [ ] Verify database connections
- [ ] Check error handling
- [ ] Monitor initial traffic
- [ ] Set up analytics (Cloudflare Analytics)
- [ ] Configure email notifications (if applicable)
- [ ] Update DNS records (if using custom domain)
- [ ] Test on mobile devices
- [ ] Verify SEO meta tags

---

**🎉 Congratulations! Your AI Agents Directory is now live on Cloudflare Pages!**

For production use, remember to:
1. Remove demo seed data
2. Set secure JWT secret
3. Configure custom domain
4. Set up monitoring
5. Enable analytics
