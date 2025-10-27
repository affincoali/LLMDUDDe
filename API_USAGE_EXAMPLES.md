# API Usage Examples - Phase 6 Enhanced Endpoints

## Table of Contents
1. [Admin Category Management](#admin-category-management)
2. [Admin User Management](#admin-user-management)
3. [Enhanced Agent Details](#enhanced-agent-details)
4. [Agent Sub-Resources Management](#agent-sub-resources-management)
5. [Authentication](#authentication)

---

## Authentication

All admin endpoints require authentication. Include JWT token in Authorization header:

```bash
# Login to get token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@aiagents.directory",
    "password": "admin123"
  }'

# Response:
# {
#   "success": true,
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "user": { "id": 1, "email": "admin@aiagents.directory", "role": "ADMIN" }
# }

# Use token in subsequent requests:
TOKEN="your-jwt-token-here"
```

---

## Admin Category Management

### 1. List All Categories

```bash
curl -s "http://localhost:3000/api/admin/categories?page=1&limit=20" \
  -H "Authorization: Bearer $TOKEN" | jq .

# Response:
# {
#   "success": true,
#   "data": [
#     {
#       "id": 1,
#       "name": "Content Creation",
#       "slug": "content-creation",
#       "description": "AI tools for creating content",
#       "icon": "✍️",
#       "color": "#4F46E5",
#       "parent_id": null,
#       "agent_count": 15,
#       "is_active": 1,
#       "display_order": 0,
#       "parent_name": null
#     }
#   ],
#   "pagination": {
#     "page": 1,
#     "limit": 20,
#     "total": 12,
#     "totalPages": 1
#   }
# }
```

### 2. Get Single Category

```bash
curl -s "http://localhost:3000/api/admin/categories/1" \
  -H "Authorization: Bearer $TOKEN" | jq .

# Response:
# {
#   "success": true,
#   "data": {
#     "id": 1,
#     "name": "Content Creation",
#     "slug": "content-creation",
#     ...
#   }
# }
```

### 3. Create New Category

```bash
curl -X POST "http://localhost:3000/api/admin/categories" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Video Editing",
    "slug": "video-editing",
    "description": "AI-powered video editing tools",
    "icon": "🎬",
    "color": "#FF6B6B",
    "parent_id": null,
    "is_active": true,
    "display_order": 10
  }' | jq .

# Response:
# {
#   "success": true,
#   "message": "Category created successfully",
#   "data": { "id": 13 }
# }
```

### 4. Update Category

```bash
curl -X PUT "http://localhost:3000/api/admin/categories/13" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Video & Film Editing",
    "description": "Professional AI video editing tools",
    "display_order": 5
  }' | jq .

# Response:
# {
#   "success": true,
#   "message": "Category updated successfully"
# }
```

### 5. Delete Category

```bash
curl -X DELETE "http://localhost:3000/api/admin/categories/13" \
  -H "Authorization: Bearer $TOKEN" | jq .

# Response (success):
# {
#   "success": true,
#   "message": "Category deleted successfully"
# }

# Response (has agents):
# {
#   "success": false,
#   "error": "Cannot delete category with 5 associated agents. Please reassign them first."
# }
```

---

## Admin User Management

### 1. List All Users

```bash
curl -s "http://localhost:3000/api/admin/users?page=1&limit=20&role=USER&search=john" \
  -H "Authorization: Bearer $TOKEN" | jq .

# Response:
# {
#   "success": true,
#   "data": [
#     {
#       "id": 2,
#       "email": "john@example.com",
#       "name": "John Doe",
#       "image": null,
#       "role": "USER",
#       "email_verified": 1,
#       "created_at": "2025-01-15 10:30:00",
#       "updated_at": "2025-01-15 10:30:00"
#     }
#   ],
#   "pagination": { ... }
# }
```

### 2. Get User Profile with Statistics

```bash
curl -s "http://localhost:3000/api/admin/users/2" \
  -H "Authorization: Bearer $TOKEN" | jq .

# Response:
# {
#   "success": true,
#   "data": {
#     "id": 2,
#     "email": "john@example.com",
#     "name": "John Doe",
#     "role": "USER",
#     "stats": {
#       "agents_submitted": 3,
#       "reviews_written": 7,
#       "upvotes_given": 15
#     },
#     "recent_agents": [
#       {
#         "id": 15,
#         "name": "My AI Tool",
#         "slug": "my-ai-tool",
#         "status": "APPROVED",
#         "created_at": "2025-01-20"
#       }
#     ],
#     "recent_reviews": [
#       {
#         "id": 23,
#         "rating": 5,
#         "content": "Excellent tool!",
#         "created_at": "2025-01-22",
#         "agent_name": "ChatGPT",
#         "agent_slug": "chatgpt"
#       }
#     ]
#   }
# }
```

### 3. Update User

```bash
curl -X PUT "http://localhost:3000/api/admin/users/2" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "role": "MODERATOR",
    "email_verified": true
  }' | jq .

# Response:
# {
#   "success": true,
#   "message": "User updated successfully"
# }
```

### 4. Delete User

```bash
curl -X DELETE "http://localhost:3000/api/admin/users/2" \
  -H "Authorization: Bearer $TOKEN" | jq .

# Response:
# {
#   "success": true,
#   "message": "User deleted successfully"
# }
```

---

## Enhanced Agent Details

### Get Comprehensive Agent Details

```bash
curl -s "http://localhost:3000/api/public/chatgpt/details" | jq .

# Response includes:
# {
#   "success": true,
#   "data": {
#     "agent": {
#       "id": 1,
#       "name": "ChatGPT",
#       "slug": "chatgpt",
#       "tagline": "Conversational AI assistant",
#       "description": "Full description...",
#       "long_description": "Extended description...",
#       "website_url": "https://chat.openai.com",
#       "logo_url": "💬",
#       
#       # NEW: Media fields
#       "youtube_url": "https://youtube.com/watch?v=...",
#       "demo_video_url": "https://...",
#       "video_thumbnail": "https://...",
#       
#       # NEW: Pricing fields
#       "pricing_model": "FREEMIUM",
#       "pricing_starts_at": "$20/month",
#       "free_plan_available": 1,
#       "free_trial_available": 0,
#       "free_trial_days": null,
#       
#       # NEW: Company info
#       "company_name": "OpenAI",
#       "company_website": "https://openai.com",
#       "founded_year": 2015,
#       "company_size": "501-1000 employees",
#       "headquarters": "San Francisco, CA",
#       
#       # NEW: Social media
#       "twitter_url": "https://twitter.com/openai",
#       "linkedin_url": "https://linkedin.com/company/openai",
#       "facebook_url": null,
#       "discord_url": "https://discord.gg/openai",
#       "github_url": "https://github.com/openai",
#       
#       # NEW: Technical details
#       "api_available": 1,
#       "api_documentation_url": "https://platform.openai.com/docs",
#       "supported_platforms": "[\"Web\",\"iOS\",\"Android\"]",
#       "supported_languages": "[\"English\",\"Spanish\",\"French\"]",
#       "supported_integrations": "[\"Slack\",\"Zapier\",\"API\"]",
#       
#       # NEW: Trust indicators
#       "verified": 1,
#       "trust_score": 95.5,
#       "uptime_percentage": 99.9,
#       
#       # Other fields
#       "upvote_count": 91,
#       "view_count": 1523,
#       "category_names": "Conversational AI,Content Creation",
#       ...
#     },
#     
#     # Sub-resources
#     "features": [
#       {
#         "id": 1,
#         "title": "Natural Language Processing",
#         "description": "Advanced NLP for human-like conversations",
#         "display_order": 0
#       }
#     ],
#     "useCases": [
#       {
#         "id": 1,
#         "title": "Customer Support",
#         "description": "Automated customer service responses",
#         "display_order": 0
#       }
#     ],
#     "faqs": [
#       {
#         "id": 1,
#         "question": "How does ChatGPT work?",
#         "answer": "ChatGPT uses large language models...",
#         "display_order": 0
#       }
#     ],
#     "pricingPlans": [
#       {
#         "id": 1,
#         "name": "Free",
#         "price": "$0/month",
#         "billing_period": "monthly",
#         "features": "[\"Basic chat\",\"Limited messages\"]",
#         "is_popular": 0,
#         "cta_text": "Get Started",
#         "cta_url": "https://chat.openai.com"
#       }
#     ],
#     "screenshots": [
#       {
#         "id": 1,
#         "image_url": "https://...",
#         "title": "Chat Interface",
#         "description": "Main chat interface"
#       }
#     ],
#     "pros": [
#       {
#         "id": 1,
#         "type": "PRO",
#         "content": "Very accurate responses"
#       }
#     ],
#     "cons": [
#       {
#         "id": 1,
#         "type": "CON",
#         "content": "Can be slow during peak hours"
#       }
#     ],
#     "reviews": [
#       {
#         "id": 1,
#         "rating": 5,
#         "content": "Excellent tool!",
#         "user_name": "John Doe",
#         "user_image": null,
#         "created_at": "2025-01-15"
#       }
#     ],
#     "reviewStats": {
#       "total_reviews": 50,
#       "average_rating": 4.6,
#       "five_star": 35,
#       "four_star": 10,
#       "three_star": 3,
#       "two_star": 1,
#       "one_star": 1
#     },
#     "similar": [ ... ],
#     "alternatives": [ ... ]
#   }
# }
```

---

## Agent Sub-Resources Management

### Features Management

#### Add Feature
```bash
curl -X POST "http://localhost:3000/api/admin/agents/1/features" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Advanced Reasoning",
    "description": "Deep reasoning capabilities for complex tasks",
    "display_order": 0
  }' | jq .
```

#### Update Feature
```bash
curl -X PUT "http://localhost:3000/api/admin/agents/1/features/5" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Advanced Reasoning (Updated)",
    "display_order": 1
  }' | jq .
```

#### Delete Feature
```bash
curl -X DELETE "http://localhost:3000/api/admin/agents/1/features/5" \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### Use Cases Management

```bash
# Add Use Case
curl -X POST "http://localhost:3000/api/admin/agents/1/use-cases" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Content Writing",
    "description": "Generate blog posts, articles, and marketing copy",
    "display_order": 0
  }' | jq .

# Update Use Case
curl -X PUT "http://localhost:3000/api/admin/agents/1/use-cases/3" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Professional Content Writing"}' | jq .

# Delete Use Case
curl -X DELETE "http://localhost:3000/api/admin/agents/1/use-cases/3" \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### FAQs Management

```bash
# Add FAQ
curl -X POST "http://localhost:3000/api/admin/agents/1/faqs" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Is ChatGPT free to use?",
    "answer": "Yes, ChatGPT has a free tier with basic features. Premium features are available through ChatGPT Plus subscription.",
    "display_order": 0
  }' | jq .

# Update FAQ
curl -X PUT "http://localhost:3000/api/admin/agents/1/faqs/2" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "answer": "Yes, ChatGPT offers both free and paid tiers..."
  }' | jq .

# Delete FAQ
curl -X DELETE "http://localhost:3000/api/admin/agents/1/faqs/2" \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### Pricing Plans Management

```bash
# Add Pricing Plan
curl -X POST "http://localhost:3000/api/admin/agents/1/pricing-plans" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ChatGPT Plus",
    "price": "$20/month",
    "billing_period": "monthly",
    "features": ["GPT-4 access", "Faster responses", "Priority access"],
    "is_popular": true,
    "display_order": 1,
    "cta_text": "Upgrade to Plus",
    "cta_url": "https://chat.openai.com/upgrade"
  }' | jq .

# Update Pricing Plan
curl -X PUT "http://localhost:3000/api/admin/agents/1/pricing-plans/1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "price": "$25/month",
    "features": ["GPT-4 access", "Faster responses", "Priority access", "DALL-E 3"]
  }' | jq .

# Delete Pricing Plan
curl -X DELETE "http://localhost:3000/api/admin/agents/1/pricing-plans/1" \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### Screenshots Management

```bash
# Add Screenshot
curl -X POST "http://localhost:3000/api/admin/agents/1/screenshots" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "image_url": "https://example.com/chatgpt-interface.jpg",
    "title": "Chat Interface",
    "description": "Main conversation interface with sidebar",
    "display_order": 0
  }' | jq .

# Update Screenshot
curl -X PUT "http://localhost:3000/api/admin/agents/1/screenshots/3" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Chat Interface",
    "display_order": 1
  }' | jq .

# Delete Screenshot
curl -X DELETE "http://localhost:3000/api/admin/agents/1/screenshots/3" \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### Pros & Cons Management

```bash
# Add Pro
curl -X POST "http://localhost:3000/api/admin/agents/1/pros-cons" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "PRO",
    "content": "Highly accurate and contextual responses",
    "display_order": 0
  }' | jq .

# Add Con
curl -X POST "http://localhost:3000/api/admin/agents/1/pros-cons" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "CON",
    "content": "Limited knowledge cutoff date",
    "display_order": 0
  }' | jq .

# Update Pro/Con
curl -X PUT "http://localhost:3000/api/admin/agents/1/pros-cons/5" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Knowledge cutoff date may not include latest information"
  }' | jq .

# Delete Pro/Con
curl -X DELETE "http://localhost:3000/api/admin/agents/1/pros-cons/5" \
  -H "Authorization: Bearer $TOKEN" | jq .
```

---

## Update Agent with Enhanced Fields

```bash
curl -X PUT "http://localhost:3000/api/admin/agents/1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ChatGPT",
    "tagline": "Advanced conversational AI by OpenAI",
    "youtube_url": "https://youtube.com/watch?v=example",
    "pricing_starts_at": "$20/month",
    "free_plan_available": true,
    "company_name": "OpenAI",
    "company_website": "https://openai.com",
    "founded_year": 2015,
    "twitter_url": "https://twitter.com/openai",
    "linkedin_url": "https://linkedin.com/company/openai",
    "api_available": true,
    "api_documentation_url": "https://platform.openai.com/docs",
    "verified": true,
    "trust_score": 95.5,
    "uptime_percentage": 99.9,
    "supported_platforms": ["Web", "iOS", "Android", "API"],
    "supported_languages": ["English", "Spanish", "French", "German", "Chinese"],
    "highlights": [
      "Most advanced language model",
      "Natural conversations",
      "Multi-purpose assistant"
    ],
    "alternatives": [2, 5, 7]
  }' | jq .

# Response:
# {
#   "success": true,
#   "message": "Agent updated successfully"
# }
```

---

## Voting System

### Upvote Agent (Guest)

```bash
curl -X POST "http://localhost:3000/api/public/1/upvote" | jq .

# Response:
# {
#   "success": true,
#   "action": "upvoted",
#   "message": "Upvote recorded"
# }
```

### Upvote Agent (Authenticated - Toggle)

```bash
curl -X POST "http://localhost:3000/api/public/1/upvote" \
  -H "Authorization: Bearer $TOKEN" | jq .

# First call - adds upvote:
# {
#   "success": true,
#   "action": "upvoted",
#   "message": "Upvote added"
# }

# Second call - removes upvote:
# {
#   "success": true,
#   "action": "removed",
#   "message": "Upvote removed"
# }
```

---

## Error Responses

### Validation Error
```json
{
  "success": false,
  "error": "Name and slug are required"
}
```

### Not Found Error
```json
{
  "success": false,
  "error": "Category not found"
}
```

### Permission Error
```json
{
  "success": false,
  "error": "Forbidden - Admin access required"
}
```

### Conflict Error
```json
{
  "success": false,
  "error": "Category with this slug already exists"
}
```

---

## Testing Workflow

### 1. Setup Authentication
```bash
# Login and save token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@aiagents.directory","password":"admin123"}' \
  | jq -r '.token')

echo "Token: $TOKEN"
```

### 2. Test Category CRUD
```bash
# Create
CATEGORY_ID=$(curl -s -X POST "http://localhost:3000/api/admin/categories" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Category","slug":"test-category"}' \
  | jq -r '.data.id')

# Read
curl -s "http://localhost:3000/api/admin/categories/$CATEGORY_ID" \
  -H "Authorization: Bearer $TOKEN" | jq .

# Update
curl -s -X PUT "http://localhost:3000/api/admin/categories/$CATEGORY_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Test Category"}' | jq .

# Delete
curl -s -X DELETE "http://localhost:3000/api/admin/categories/$CATEGORY_ID" \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### 3. Test Enhanced Agent Detail
```bash
curl -s "http://localhost:3000/api/public/chatgpt/details" | jq '{
  agent: .data.agent.name,
  features: (.data.features | length),
  useCases: (.data.useCases | length),
  faqs: (.data.faqs | length),
  pricingPlans: (.data.pricingPlans | length),
  screenshots: (.data.screenshots | length),
  reviews: (.data.reviews | length),
  similar: (.data.similar | length)
}'
```

---

**Note**: Replace `http://localhost:3000` with your actual deployment URL when testing in production.
