# API Documentation

Complete API reference for the AI Agents Directory platform.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Sandbox**: `https://3000-izrhvxrc8y0zaw0u52v89-2e1b9533.sandbox.novita.ai/api`
- **Production**: `https://your-domain.pages.dev/api`

## Authentication

Most endpoints are public. Admin endpoints require JWT authentication.

### Headers

```
Authorization: Bearer <your_jwt_token>
```

### Getting a Token

**Login Endpoint**: `POST /api/auth/login`

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@aiagents.directory",
    "password": "admin123"
  }'
```

**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "admin@aiagents.directory",
      "name": "Admin User",
      "role": "ADMIN"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 📋 Agents Endpoints

### List All Agents

**GET** `/api/agents`

Get a paginated list of agents with optional filtering.

**Query Parameters**:
- `page` (number, default: 1) - Page number
- `limit` (number, default: 20) - Items per page
- `status` (string, default: 'APPROVED') - Filter by status (PENDING, APPROVED, REJECTED)
- `category_id` (number) - Filter by category ID
- `pricing_model` (string) - Filter by pricing (FREE, PAID, FREEMIUM, CONTACT)
- `search` (string) - Search in name, tagline, description
- `sort` (string, default: 'created_at') - Sort field
- `order` (string, default: 'DESC') - Sort order (ASC, DESC)

**Example Request**:
```bash
curl "http://localhost:3000/api/agents?limit=5&pricing_model=FREE&sort=upvote_count&order=DESC"
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "ChatGPT",
      "slug": "chatgpt",
      "tagline": "Conversational AI assistant powered by GPT-4",
      "description": "ChatGPT is an advanced language model...",
      "website_url": "https://chat.openai.com",
      "logo_url": "https://via.placeholder.com/150",
      "pricing_model": "FREEMIUM",
      "is_open_source": 0,
      "status": "APPROVED",
      "upvote_count": 89,
      "view_count": 1250,
      "review_count": 0,
      "created_at": "2025-10-27T14:27:29.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 15,
    "totalPages": 3
  }
}
```

---

### Get Agent Statistics

**GET** `/api/agents/stats`

Get overall platform statistics.

**Example Request**:
```bash
curl http://localhost:3000/api/agents/stats
```

**Response**:
```json
{
  "success": true,
  "data": {
    "total_agents": 5,
    "total_categories": 6,
    "total_reviews": 4,
    "total_upvotes": 10
  }
}
```

---

### Get Single Agent

**GET** `/api/agents/:slug`

Get detailed information about a specific agent by slug.

**Example Request**:
```bash
curl http://localhost:3000/api/agents/chatgpt
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "ChatGPT",
    "slug": "chatgpt",
    "tagline": "Conversational AI assistant powered by GPT-4",
    "description": "ChatGPT is an advanced language model...",
    "website_url": "https://chat.openai.com",
    "pricing_model": "FREEMIUM",
    "upvote_count": 89,
    "view_count": 1251,
    "categories": [
      {
        "id": 1,
        "name": "Content Generation",
        "slug": "content-generation"
      }
    ],
    "tags": [
      {
        "id": 1,
        "name": "GPT-4",
        "slug": "gpt-4"
      }
    ],
    "features": [
      {
        "id": 1,
        "title": "Natural Conversations",
        "description": "Engage in human-like dialogue"
      }
    ],
    "use_cases": [
      {
        "id": 1,
        "title": "Content Writing",
        "description": "Blog posts, articles, and marketing copy"
      }
    ],
    "submitter": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@aiagents.directory"
    },
    "average_rating": 4.5,
    "user_upvoted": false
  }
}
```

---

### Submit New Agent

**POST** `/api/agents/submit`

Submit a new agent for review. No authentication required.

**Request Body**:
```json
{
  "name": "My AI Agent",
  "tagline": "Brief description of what it does",
  "description": "Full description with details about features and capabilities",
  "website_url": "https://myagent.com",
  "pricing_model": "FREEMIUM",
  "is_open_source": false,
  "submitter_email": "submitter@example.com"
}
```

**Example Request**:
```bash
curl -X POST http://localhost:3000/api/agents/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My AI Agent",
    "tagline": "Brief description",
    "website_url": "https://myagent.com",
    "pricing_model": "FREE",
    "submitter_email": "user@example.com"
  }'
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 7,
    "name": "My AI Agent",
    "slug": "my-ai-agent",
    "status": "PENDING"
  },
  "message": "Agent submitted successfully and is pending review"
}
```

---

### Toggle Upvote

**POST** `/api/agents/:id/upvote`

Upvote or remove upvote from an agent. **Requires authentication**.

**Example Request**:
```bash
curl -X POST http://localhost:3000/api/agents/1/upvote \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response**:
```json
{
  "success": true,
  "data": {
    "upvoted": true
  },
  "message": "Upvote added"
}
```

---

### Track Click

**POST** `/api/agents/:id/click`

Track when a user clicks on an agent's website link.

**Example Request**:
```bash
curl -X POST http://localhost:3000/api/agents/1/click
```

**Response**:
```json
{
  "success": true,
  "message": "Click tracked"
}
```

---

## 📁 Categories Endpoints

### List All Categories

**GET** `/api/categories`

Get all active categories, optionally filtered by parent.

**Query Parameters**:
- `parent_id` (number) - Filter by parent category ID

**Example Request**:
```bash
curl http://localhost:3000/api/categories
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Content Generation",
      "slug": "content-generation",
      "description": "AI agents for creating written content",
      "icon": "✍️",
      "color": "#3B82F6",
      "agent_count": 2,
      "is_active": 1,
      "display_order": 1
    }
  ]
}
```

---

### Get Single Category

**GET** `/api/categories/:slug`

Get category details including subcategories.

**Example Request**:
```bash
curl http://localhost:3000/api/categories/content-generation
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Content Generation",
    "slug": "content-generation",
    "description": "AI agents for creating written content",
    "agent_count": 2,
    "subcategories": []
  }
}
```

---

## 👤 User Endpoints

### Get User Profile

**GET** `/api/users/:id`

Get user profile with statistics.

**Example Request**:
```bash
curl http://localhost:3000/api/users/1
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@aiagents.directory",
    "role": "ADMIN",
    "created_at": "2025-10-27T14:27:29.000Z",
    "stats": {
      "agents_submitted": 3,
      "upvotes_given": 5,
      "reviews_written": 2
    }
  }
}
```

---

### Get User's Agents

**GET** `/api/users/:id/agents`

Get all agents submitted by a user.

**Example Request**:
```bash
curl http://localhost:3000/api/users/1/agents
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "ChatGPT",
      "slug": "chatgpt",
      "status": "APPROVED"
    }
  ]
}
```

---

## 🔐 Authentication Endpoints

### Register

**POST** `/api/auth/register`

Register a new user account.

**Request Body**:
```json
{
  "email": "newuser@example.com",
  "name": "New User",
  "password": "securepassword123"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 4,
      "email": "newuser@example.com",
      "name": "New User",
      "role": "USER"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Login

**POST** `/api/auth/login`

Login and receive JWT token.

**Request Body**:
```json
{
  "email": "admin@aiagents.directory",
  "password": "admin123"
}
```

**Response**: Same as Register

---

### Get Current User

**GET** `/api/auth/me`

Get current authenticated user info. **Requires authentication**.

**Example Request**:
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "admin@aiagents.directory",
    "name": "Admin User",
    "role": "ADMIN",
    "created_at": "2025-10-27T14:27:29.000Z"
  }
}
```

---

## 🔧 Admin Endpoints

All admin endpoints require authentication with MODERATOR or ADMIN role.

### Get Admin Stats

**GET** `/api/admin/stats`

Get dashboard statistics for admin panel.

**Example Request**:
```bash
curl http://localhost:3000/api/admin/stats \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Response**:
```json
{
  "success": true,
  "data": {
    "total_agents": 6,
    "pending_agents": 1,
    "total_users": 3,
    "total_reviews": 4,
    "total_categories": 6
  }
}
```

---

### Get Pending Agents

**GET** `/api/admin/agents/pending`

Get all agents awaiting approval.

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 6,
      "name": "Pending Agent",
      "slug": "pending-agent",
      "status": "PENDING",
      "submitter_name": "John Doe",
      "submitter_email": "user@example.com",
      "submitted_at": "2025-10-27T14:27:29.000Z"
    }
  ]
}
```

---

### Approve Agent

**PUT** `/api/admin/agents/:id/approve`

Approve a pending agent submission. **Requires MODERATOR or ADMIN**.

**Example Request**:
```bash
curl -X PUT http://localhost:3000/api/admin/agents/6/approve \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Response**:
```json
{
  "success": true,
  "message": "Agent approved successfully"
}
```

---

### Reject Agent

**PUT** `/api/admin/agents/:id/reject`

Reject a pending agent submission. **Requires MODERATOR or ADMIN**.

**Example Request**:
```bash
curl -X PUT http://localhost:3000/api/admin/agents/6/reject \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Response**:
```json
{
  "success": true,
  "message": "Agent rejected"
}
```

---

### Update Agent

**PUT** `/api/admin/agents/:id`

Update agent details. **Requires MODERATOR or ADMIN**.

**Request Body**:
```json
{
  "name": "Updated Name",
  "tagline": "Updated tagline",
  "pricing_model": "PAID",
  "featured_tier": "PREMIUM"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Agent updated successfully"
}
```

---

### Delete Agent

**DELETE** `/api/admin/agents/:id`

Delete an agent. **Requires ADMIN role only**.

**Example Request**:
```bash
curl -X DELETE http://localhost:3000/api/admin/agents/6 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Response**:
```json
{
  "success": true,
  "message": "Agent deleted successfully"
}
```

---

## 📝 Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

**Common HTTP Status Codes**:
- `200` - Success
- `201` - Created
- `400` - Bad Request (missing/invalid parameters)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## 🧪 Testing with cURL

### Test Public Endpoints
```bash
# Get stats
curl http://localhost:3000/api/agents/stats

# List agents
curl "http://localhost:3000/api/agents?limit=5"

# Get single agent
curl http://localhost:3000/api/agents/chatgpt

# Submit agent
curl -X POST http://localhost:3000/api/agents/submit \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Agent","website_url":"https://test.com","submitter_email":"test@test.com"}'
```

### Test Authenticated Endpoints
```bash
# Login first
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@aiagents.directory","password":"admin123"}' \
  | jq -r '.data.token')

# Use token for authenticated requests
curl http://localhost:3000/api/admin/stats \
  -H "Authorization: Bearer $TOKEN"

# Approve agent
curl -X PUT http://localhost:3000/api/admin/agents/6/approve \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📚 Rate Limiting

Currently no rate limiting is implemented. For production deployment, consider adding:
- Rate limiting per IP
- Rate limiting per user
- Request throttling for expensive operations

---

## 🔄 Pagination

All list endpoints support pagination with consistent query parameters:
- `page` - Current page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)

Pagination info is returned in the response:
```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

---

## 📖 Additional Resources

- [Hono Documentation](https://hono.dev/api)
- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1)
- [JWT.io](https://jwt.io) - JWT token debugger
