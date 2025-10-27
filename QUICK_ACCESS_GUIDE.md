# 🚀 Quick Access Guide - Admin Panel

## 📍 Direct Links

### Main URLs
- **Homepage**: https://3000-izrhvxrc8y0zaw0u52v89-2e1b9533.sandbox.novita.ai
- **Login Page**: https://3000-izrhvxrc8y0zaw0u52v89-2e1b9533.sandbox.novita.ai/login
- **Admin Panel**: https://3000-izrhvxrc8y0zaw0u52v89-2e1b9533.sandbox.novita.ai/admin/agents-all

## 🔑 Admin Credentials

```
Email:    admin@aiagents.directory
Password: admin123
```

## 📋 Step-by-Step Access

### Method 1: Login First (Recommended)

1. **Open Login Page**
   ```
   https://3000-izrhvxrc8y0zaw0u52v89-2e1b9533.sandbox.novita.ai/login
   ```

2. **Enter Credentials**
   - Email: `admin@aiagents.directory`
   - Password: `admin123`

3. **Click "Sign In"**
   - You'll be automatically redirected to admin dashboard

4. **Navigate to All Agents**
   - Click "All Agents" in the sidebar
   - Or use direct URL: `/admin/agents-all`

### Method 2: Direct Access

1. **Open Admin Page Directly**
   ```
   https://3000-izrhvxrc8y0zaw0u52v89-2e1b9533.sandbox.novita.ai/admin/agents-all
   ```

2. **If Not Logged In**
   - You'll be redirected to homepage
   - Go back to Method 1

## 🎯 What You'll See

### Admin Agents Page Features

#### Header
- **Title**: "All Agents"
- **Create Button**: Green button to add new agents

#### Filters Section
- **Search Bar**: Search agents by name or tagline
- **Status Filter**: Dropdown with options:
  - All Status (shows all 11 agents)
  - Pending (shows 2 pending agents)
  - Approved (shows 9 approved agents)
  - Rejected (shows 0 rejected agents)

#### Agents Grid
3-column responsive grid showing:

**Agent Card Layout:**
```
┌────────────────────────┐
│   🤖  (Large Emoji)    │
│                        │
├────────────────────────┤
│ Agent Name    [STATUS] │
│ Tagline here...        │
│ 👁 Views  ⬆ Upvotes   │
│ [PRICING]              │
│                        │
│ [Edit]      [View]     │
└────────────────────────┘
```

**Status Badges:**
- 🟢 APPROVED (green background)
- 🟡 PENDING (yellow background)
- 🔴 REJECTED (red background)

**Pricing Models:**
- FREE - Green badge
- PAID - Blue badge
- FREEMIUM - Yellow badge

#### Pagination
- Shows: "Page 1 of 1 (11 total)"
- Previous/Next buttons

## 📊 Test Data Overview

### 11 Agents Available

#### Approved Agents (9)

1. **ChatGPT** 🤖
   - FREEMIUM
   - 1,250 views, 89 upvotes

2. **Claude** 🤖
   - FREEMIUM
   - Views and upvotes

3. **GitHub Copilot** 🤖
   - PAID
   - Coding assistant

4. **Midjourney** 🤖
   - PAID
   - AI art generation

5. **Perplexity AI** 🤖
   - FREEMIUM
   - Search engine

6. **Jasper AI** 📝
   - PAID
   - SEO_BOOST featured tier
   - 892 views, 67 upvotes

7. **Runway ML** 🎬
   - FREEMIUM
   - PREMIUM featured tier
   - 1,543 views, 134 upvotes

8. **Hugging Face** 🤗
   - FREE
   - Open source
   - 2,341 views, 198 upvotes

9. **Replicate** 🔄
   - PAID
   - 743 views, 89 upvotes

#### Pending Agents (2)

10. **Pending Agent** 🤖
    - FREE
    - Generic test agent

11. **Synthesia** 🎥
    - PAID
    - 567 views, 42 upvotes

## 🔧 Admin Actions Available

### On Each Agent Card

1. **Edit Button** (Purple)
   - Opens edit form
   - Modify agent details
   - Update status, pricing, etc.

2. **View Button** (Gray)
   - Opens public agent page
   - See how users see the agent
   - Opens in new tab

### Bulk Operations

- Select multiple agents (if implemented)
- Approve/reject in bulk
- Delete multiple agents

## 🧪 Testing Checklist

### Basic Functionality
- [ ] Login with admin credentials works
- [ ] Admin page loads and shows all 11 agents
- [ ] Search functionality filters agents correctly
- [ ] Status filter shows correct agents:
  - [ ] All: 11 agents
  - [ ] Pending: 2 agents
  - [ ] Approved: 9 agents
- [ ] Edit button opens edit form
- [ ] View button opens agent detail page

### Agent Cards Display
- [ ] Emoji/logo shows correctly
- [ ] Status badges have correct colors
- [ ] View counts and upvotes display
- [ ] Pricing model badges visible
- [ ] Agent names and taglines readable

### Responsive Design
- [ ] Grid adapts to screen size
- [ ] Mobile view works (1 column)
- [ ] Tablet view works (2 columns)
- [ ] Desktop view works (3 columns)

## 🐛 Troubleshooting

### Problem: "Page redirects to homepage"
**Solution**: You're not logged in. Follow Method 1 to login first.

### Problem: "No agents displayed"
**Solution**: Check if you're logged in as admin. Verify with F12 console.

### Problem: "Authorization error"
**Solution**: 
1. Logout (clear localStorage)
2. Login again
3. Check if token is saved in localStorage

### Problem: "API returns 404"
**Solution**: Service might not be running. Check PM2:
```bash
pm2 list
pm2 restart ai-agents-directory
```

## 💡 Pro Tips

1. **Use Browser DevTools** (F12)
   - Check Console for errors
   - Check Network tab for API calls
   - Check Application > Local Storage for auth_token

2. **Quick Status Check**
   ```javascript
   // In browser console:
   console.log('Token:', localStorage.getItem('auth_token'))
   ```

3. **Test API Directly**
   ```bash
   # Login
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@aiagents.directory","password":"admin123"}'
   
   # Get agents (replace TOKEN with actual token)
   curl http://localhost:3000/api/admin/agents/all \
     -H "Authorization: Bearer TOKEN"
   ```

4. **Clear Cache**
   - Ctrl+Shift+R (hard refresh)
   - Clear browser cache
   - Clear localStorage

## 📚 Additional Resources

- **Full Documentation**: See README.md
- **Technical Details**: See ADMIN_FIX_SUMMARY.md
- **API Endpoints**: See README.md > API Endpoints section

---

**Ready to Test?** → Start with Method 1 above! 🚀
