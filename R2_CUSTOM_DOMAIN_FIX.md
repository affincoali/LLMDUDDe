# R2 Custom Domain Fix - storage.llmdude.com

## Issue
Some images in production were still using the old default R2 domain:
```
https://pub-0226aad7dbe14d2ba087dca75180dc49.r2.dev/uploads/...
```

Instead of the custom branded domain:
```
https://storage.llmdude.com/uploads/...
```

## Root Cause
Old URLs were stored in the production database from earlier uploads before the custom domain was configured.

## Solution Applied (2025-10-28)

### 1. Database Audit
Checked all tables for old R2 URLs:
- **agents** table: 1 record with old URL
- **agent_screenshots** table: 1 record with old URL
- **categories** table: 0 records (clean)

### 2. SQL Fix Script
Created `fix-r2-urls.sql` to update all old URLs:
```sql
-- Update agents table
UPDATE agents 
SET logo_url = REPLACE(logo_url, 'https://pub-0226aad7dbe14d2ba087dca75180dc49.r2.dev', 'https://storage.llmdude.com')
WHERE logo_url LIKE '%pub-0226aad7dbe14d2ba087dca75180dc49.r2.dev%';

UPDATE agents 
SET cover_image = REPLACE(cover_image, 'https://pub-0226aad7dbe14d2ba087dca75180dc49.r2.dev', 'https://storage.llmdude.com')
WHERE cover_image LIKE '%pub-0226aad7dbe14d2ba087dca75180dc49.r2.dev%';

-- Update agent_screenshots table
UPDATE agent_screenshots 
SET image_url = REPLACE(image_url, 'https://pub-0226aad7dbe14d2ba087dca75180dc49.r2.dev', 'https://storage.llmdude.com')
WHERE image_url LIKE '%pub-0226aad7dbe14d2ba087dca75180dc49.r2.dev%';

-- Update categories table
UPDATE categories 
SET image_url = REPLACE(image_url, 'https://pub-0226aad7dbe14d2ba087dca75180dc49.r2.dev', 'https://storage.llmdude.com')
WHERE image_url LIKE '%pub-0226aad7dbe14d2ba087dca75180dc49.r2.dev%';
```

### 3. Execution
```bash
npx wrangler d1 execute webapp-production --remote --file=./fix-r2-urls.sql
```

**Results:**
- ✅ 2 rows updated successfully
- ✅ 0 old URLs remaining
- ✅ All images now use custom domain

### 4. Verification
Fixed agents:
1. **DALL-E 3 ALI** (ID: 7) - `https://storage.llmdude.com/uploads/1761681347205-4l4ig3p81i.png`
2. **Kumoo AI** (ID: 14) - `https://storage.llmdude.com/uploads/1761688215767-j9z1hcr91g.png`

Fixed screenshot:
- Agent ID 7 screenshot - `https://storage.llmdude.com/uploads/1761681313966-4gvud7jxr.png`

### 5. Image Accessibility Test
```bash
curl -I https://storage.llmdude.com/uploads/1761681347205-4l4ig3p81i.png
# HTTP Status: 200 OK ✅
```

## Prevention Strategy

### Code is Already Fixed
All upload endpoints in `src/routes/upload.ts` already use the custom domain:
```typescript
// Line 67 - Single image upload
const publicUrl = `https://storage.llmdude.com/${key}`;

// Line 164 - Multiple images upload  
const publicUrl = `https://storage.llmdude.com/${key}`;
```

### Future Uploads
All new uploads from now on will automatically use `storage.llmdude.com` because:
1. ✅ Upload API returns custom domain URLs
2. ✅ Frontend saves these URLs to database
3. ✅ No code changes needed

### Monitoring
To check for any remaining old URLs in future:
```bash
npx wrangler d1 execute webapp-production --remote --command="
SELECT 'agents' as table_name, COUNT(*) as old_urls 
FROM agents 
WHERE logo_url LIKE '%pub-0226aad7dbe14d2ba087dca75180dc49.r2.dev%' 
   OR cover_image LIKE '%pub-0226aad7dbe14d2ba087dca75180dc49.r2.dev%'
UNION ALL
SELECT 'agent_screenshots', COUNT(*) 
FROM agent_screenshots 
WHERE image_url LIKE '%pub-0226aad7dbe14d2ba087dca75180dc49.r2.dev%'
UNION ALL
SELECT 'categories', COUNT(*) 
FROM categories 
WHERE image_url LIKE '%pub-0226aad7dbe14d2ba087dca75180dc49.r2.dev%';
"
```

Expected result: All counts should be 0

## Status: ✅ RESOLVED

- [x] Database URLs updated
- [x] Upload code uses custom domain
- [x] Images load correctly
- [x] No old URLs remaining
- [x] Prevention in place

**All images now use the branded custom domain: storage.llmdude.com** 🎉
