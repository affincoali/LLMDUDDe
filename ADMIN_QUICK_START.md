# 🚀 Admin Panel Quick Start Guide

## 📍 Access Information

**Public URL:** https://3000-izrhvxrc8y0zaw0u52v89-2e1b9533.sandbox.novita.ai

**Demo Login Credentials:**
- Email: `admin@aiagents.directory`
- Password: `admin123`

---

## 🎯 Quick Navigation

### Main Admin Pages

1. **Dashboard** → `/admin`
   - View key metrics and statistics
   - See pending agents count
   - View charts (status distribution, categories)

2. **Approval Queue** → `/admin/agents-queue`
   - Review pending submissions
   - Bulk approve/reject/delete actions
   - Edit agents while approving
   - Add rejection reasons

3. **All Agents** → `/admin/agents-all`
   - Browse all agents (grid view)
   - Search and filter agents
   - Quick edit/view buttons
   - **"Create New Agent"** button

4. **Create Agent** → `/admin/agents/create`
   - Add new AI agents manually
   - Full form with all fields
   - Auto-generate slug from name
   - Set status (PENDING/APPROVED/REJECTED)

5. **Edit Agent** → `/admin/agents/:id/edit`
   - Update existing agent information
   - Pre-filled form with current data
   - Save changes with audit logging

6. **User Management** → `/admin/users`
   - View all registered users
   - Search users by name/email
   - Filter by role (USER/MODERATOR/ADMIN)
   - Change user roles

7. **Analytics** → `/admin/analytics`
   - View data visualizations
   - Top categories bar chart
   - Pricing distribution pie chart
   - Agent growth line chart
   - Select time range (7/30/90 days)

8. **Audit Logs** → `/admin/audit-logs`
   - View all admin actions
   - Filter by action type, entity, user
   - Paginated display
   - Full accountability trail

9. **Categories** → `/admin/categories`
   - View all categories
   - Create new categories
   - Edit existing categories
   - Manage category icons and colors

---

## 🔥 Common Workflows

### Workflow 1: Review Pending Submissions

1. Click **Approval Queue** in sidebar
2. Review agent details in list
3. Actions available:
   - ✅ **Quick Approve** - Approve as-is
   - ✏️ **Approve with Edits** - Edit before approving
   - ❌ **Reject with Reason** - Reject and add reason
   - 🗑️ **Delete** - Remove permanently
4. Use checkboxes for **Bulk Actions**

### Workflow 2: Create New AI Agent

1. Click **All Agents** in sidebar
2. Click **"Create New Agent"** button (top right)
3. Fill in the form:
   - **Basic Info:** Name, Slug, Tagline, Description
   - **Links:** Website, Logo, Demo, Docs URLs
   - **Pricing:** Model, Details, Open Source, Free Trial
   - **Categories:** Select category, add tags
   - **Features:** JSON array of features
   - **Admin Settings:** Status, Notes, Featured
   - **Submitter:** Email (optional)
4. Click **"Create Agent"** button
5. Redirects to All Agents page on success

### Workflow 3: Edit Existing Agent

1. Go to **All Agents** page
2. Click **"Edit"** button on any agent card
3. Form pre-loads with current data
4. Make changes to any fields
5. Click **"Save Changes"** button
6. Action is logged in Audit Logs

### Workflow 4: Manage User Roles

1. Click **Users** in sidebar
2. Search for user by name or email
3. Click **"Change Role"** button
4. Select new role:
   - **USER** - Basic access
   - **MODERATOR** - Can approve/reject
   - **ADMIN** - Full access
5. Click **"Save"** to confirm

### Workflow 5: View Analytics

1. Click **Analytics** in sidebar
2. Select time range (7/30/90 days)
3. View three charts:
   - **Top Categories** - Bar chart
   - **Pricing Distribution** - Pie chart
   - **Agent Growth** - Line chart
4. Data auto-refreshes when changing time range

---

## 📋 Agent Form Fields Reference

### Required Fields (*)
- ✅ Name
- ✅ Slug (auto-generated from name)
- ✅ Tagline
- ✅ Description
- ✅ Website URL
- ✅ Pricing Model
- ✅ Category
- ✅ Status

### Optional Fields
- Logo URL or Emoji
- Demo URL
- Documentation URL
- Pricing Details
- Is Open Source (checkbox)
- Has Free Trial (checkbox)
- Tags (comma-separated)
- Features (JSON array format)
- Admin Notes (internal)
- Rejection Reason (if rejected)
- Featured (checkbox)
- Submitter Email

### Field Tips

**Slug:**
- Auto-generated from name
- URL-friendly (lowercase, hyphens)
- Example: "ChatGPT" → "chatgpt"

**Features:**
- JSON array format required
- Example: `["Feature 1", "Feature 2", "Feature 3"]`
- Leave empty if none

**Tags:**
- Comma-separated list
- Example: "chatbot, ai, nlp"

**Status:**
- `PENDING` - Awaiting review
- `APPROVED` - Live on site
- `REJECTED` - Not approved

---

## 🔍 Search & Filter Tips

### All Agents Page
- Search by agent name
- Filter by status (PENDING/APPROVED/REJECTED)
- Filter by category
- Results update instantly

### Users Page
- Search by name or email
- Filter by role (USER/MODERATOR/ADMIN)
- Click search button to apply

### Audit Logs Page
- Filter by action type
- Filter by entity type
- Filter by user
- Paginated results (20 per page)

---

## 🎨 UI Features

### Color Coding
- 🟢 **Green** - Approved/Success
- 🟡 **Yellow** - Pending/Warning
- 🔴 **Red** - Rejected/Error
- 🟣 **Purple** - Active/Selected
- ⚪ **Gray** - Neutral/Inactive

### Status Badges
- **PENDING** - Yellow badge
- **APPROVED** - Green badge
- **REJECTED** - Red badge

### Icon Legend
- 📊 **Chart Line** - Dashboard
- ⏰ **Clock** - Approval Queue
- 🤖 **Robot** - All Agents
- 📁 **Folder** - Categories
- 👥 **Users** - User Management
- 📈 **Chart Bar** - Analytics
- 🕐 **History** - Audit Logs
- 🏠 **Home** - Back to Site
- 🚪 **Sign Out** - Logout

---

## ⚙️ Keyboard Shortcuts

- `Ctrl/Cmd + K` - Focus search (where available)
- `Esc` - Close modals
- `Enter` - Submit forms

---

## 🔒 Security Notes

### Role Permissions

**USER:**
- ✅ Submit new agents
- ✅ Write reviews
- ✅ Upvote agents
- ❌ Cannot access admin panel

**MODERATOR:**
- ✅ All USER permissions
- ✅ Approve/reject agents
- ✅ View pending submissions
- ❌ Cannot change user roles
- ❌ Cannot view audit logs

**ADMIN:**
- ✅ All MODERATOR permissions
- ✅ Create/edit any agent
- ✅ Change user roles
- ✅ View audit logs
- ✅ Manage categories
- ✅ Access all admin features

### Audit Logging
Every admin action is logged with:
- Timestamp
- User who performed action
- Action type (CREATE/UPDATE/DELETE/APPROVE/REJECT)
- Entity affected (agent, user, category)
- Additional details (JSON)

---

## 📞 Support

For issues or questions:
- Check PM2 logs: `pm2 logs --nostream`
- Check service status: `pm2 list`
- Restart service: `pm2 restart ai-agents-directory`

---

## 🎉 You're All Set!

The admin panel is fully functional with **ZERO 404 errors**. All pages are connected to the database, and every feature is working as expected.

**Happy managing! 🚀**
