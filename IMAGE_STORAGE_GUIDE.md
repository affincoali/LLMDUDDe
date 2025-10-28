# Image Storage Guide - Cloudflare R2

## 📦 Overview

Images uploaded through the submit form and admin panel are stored using **Cloudflare R2** - an S3-compatible object storage service.

---

## 🏗️ Current Architecture

### Local Development (Sandbox)
- **Storage**: `.wrangler/state/v3/r2/webapp-images-dev/`
- **Type**: Local filesystem (simulated R2)
- **Access**: Via `/api/upload/image/uploads/*` endpoint
- **Persistence**: Temporary (cleared on sandbox reset)

### Production (Cloudflare Pages)
- **Storage**: Cloudflare R2 bucket (`webapp-images`)
- **Type**: Real cloud object storage
- **Access**: Via `/api/upload/image/uploads/*` endpoint
- **Persistence**: Permanent, globally distributed

---

## 🚀 Setting Up Production R2 Storage

### Step 1: Create R2 Bucket

```bash
# Login to Cloudflare (if not already logged in)
npx wrangler login

# Create production R2 bucket
npx wrangler r2 bucket create webapp-images

# Verify bucket was created
npx wrangler r2 bucket list
```

### Step 2: Configure wrangler.jsonc

Already configured in `wrangler.jsonc`:

```jsonc
{
  "r2_buckets": [
    {
      "binding": "IMAGES",
      "bucket_name": "webapp-images",
      "preview_bucket_name": "webapp-images-dev"
    }
  ]
}
```

- `binding`: Variable name to access bucket in code (`c.env.IMAGES`)
- `bucket_name`: Production bucket name
- `preview_bucket_name`: Local development bucket name

### Step 3: Deploy to Production

```bash
# Build the project
npm run build

# Deploy to Cloudflare Pages
npm run deploy

# Or with project name
npx wrangler pages deploy dist --project-name webapp
```

**After deployment, images will automatically be stored in Cloudflare R2!**

---

## 📊 How It Works

### Upload Flow:

```
User uploads file
    ↓
POST /api/upload/image (FormData)
    ↓
Validate file (size, type)
    ↓
Generate unique filename: timestamp-random.ext
    ↓
Store in R2: uploads/filename.ext
    ↓
Return URL: /api/upload/image/uploads/filename.ext
    ↓
Save URL in database (logo_url, cover_image)
```

### Retrieval Flow:

```
Browser requests: /api/upload/image/uploads/filename.ext
    ↓
GET /api/upload/image/* route handler
    ↓
Extract key: uploads/filename.ext
    ↓
Fetch from R2: IMAGES.get(key)
    ↓
Return image with proper Content-Type
```

---

## 🔧 Code Implementation

### Upload Endpoint (`src/routes/upload.ts`)

```typescript
// Upload image to R2
const { IMAGES } = c.env;
const arrayBuffer = await file.arrayBuffer();

await IMAGES.put(key, arrayBuffer, {
  httpMetadata: {
    contentType: file.type,
  }
});

// Return URL
const publicUrl = `/api/upload/image/${key}`;
```

### Retrieval Endpoint (`src/routes/upload.ts`)

```typescript
// Get image from R2
const { IMAGES } = c.env;
const object = await IMAGES.get(key);

return new Response(object.body, {
  headers: {
    'Content-Type': object.httpMetadata?.contentType || 'image/jpeg',
    'Cache-Control': 'public, max-age=31536000'
  }
});
```

---

## 💰 Cloudflare R2 Pricing

**Free Tier (Generous):**
- ✅ **10 GB storage** per month (FREE)
- ✅ **1 million Class A operations** per month (FREE)
- ✅ **10 million Class B operations** per month (FREE)
- ✅ **No egress fees** (unlike AWS S3!)

**Paid Tier (if needed):**
- Storage: $0.015 per GB/month ($15 for 1TB)
- Class A operations (writes): $4.50 per million
- Class B operations (reads): $0.36 per million

**For most projects, the free tier is more than enough!**

---

## 🎯 Current Configuration

### wrangler.jsonc
```jsonc
{
  "name": "webapp",
  "compatibility_date": "2024-01-01",
  "pages_build_output_dir": "./dist",
  "compatibility_flags": ["nodejs_compat"],
  
  "r2_buckets": [
    {
      "binding": "IMAGES",
      "bucket_name": "webapp-images",
      "preview_bucket_name": "webapp-images-dev"
    }
  ]
}
```

### Upload Limits
- **Logo**: 2MB max
- **Cover Image**: 5MB max
- **Screenshots**: 5MB each, max 5 files
- **Allowed Types**: JPEG, PNG, GIF, WebP

---

## 🔄 Migration from Local to Production

When you deploy to production, **no migration needed!**

1. Local uploads go to `.wrangler/state/v3/r2/webapp-images-dev/`
2. Production uploads go to Cloudflare R2 bucket `webapp-images`
3. They are separate environments

**Note**: Local test images won't be in production. Users must re-upload in production environment.

---

## 🛠️ Troubleshooting

### Issue: Images Not Displaying

**Check:**
1. R2 bucket exists: `npx wrangler r2 bucket list`
2. Binding is correct in `wrangler.jsonc`
3. URL format: `/api/upload/image/uploads/filename.ext`
4. Browser console for errors

### Issue: Upload Fails

**Check:**
1. File size within limits
2. File type is allowed (image/*)
3. Auth token valid (for admin uploads)
4. Network connection

### Issue: 404 on Image Retrieval

**Local Development:**
- Image might not be uploaded yet
- Check `.wrangler/state/v3/r2/webapp-images-dev/blobs/`

**Production:**
- Verify R2 bucket exists
- Check bucket name in `wrangler.jsonc` matches actual bucket
- Verify deployment was successful

---

## 📝 Best Practices

1. **Image Optimization**:
   - Compress images before upload
   - Use WebP format for better compression
   - Resize large images client-side before upload

2. **Error Handling**:
   - Always show upload progress
   - Display clear error messages
   - Provide retry option

3. **Security**:
   - Validate file types on server
   - Limit file sizes
   - Use authentication for admin uploads

4. **Performance**:
   - Set long cache headers (1 year)
   - Use CDN (Cloudflare automatically does this)
   - Lazy load images on frontend

---

## 🎉 Summary

✅ **Local Development**: Images stored in `.wrangler/state/` (temporary)  
✅ **Production**: Images stored in Cloudflare R2 (permanent)  
✅ **Free Tier**: 10GB storage, 1M writes, 10M reads  
✅ **No Egress Fees**: Unlike AWS S3  
✅ **Global CDN**: Cloudflare distributes images worldwide  
✅ **Easy Setup**: Create bucket, deploy, done!  

Your images are stored on Cloudflare's infrastructure, making them fast, reliable, and cost-effective! 🚀
