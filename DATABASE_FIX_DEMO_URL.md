# Database Schema Fix: demo_url and docs_url Columns

## Problem

When trying to create a new AI agent in the admin panel, the following error occurred:

```
D1_ERROR: table agents has no column named demo_url: SQLITE_ERROR
```

## Root Cause

The admin agent creation code (`src/routes/admin-enhanced.ts`) was trying to insert data into columns that didn't exist in the database:

**Code attempted to insert**:
- `demo_url` - For live demo links
- `docs_url` - For documentation links

**Database only had**:
- `demo_video_url` - For embedded video URLs (from migration 0004)

The code and database schema were out of sync.

## Solution

Created migration `0005_add_missing_url_columns.sql` to add the missing columns:

```sql
-- Add demo_url column (different from demo_video_url which is for embedded videos)
-- demo_url is for live demo links
ALTER TABLE agents ADD COLUMN demo_url TEXT;

-- Add docs_url column for documentation links
ALTER TABLE agents ADD COLUMN docs_url TEXT;
```

## Column Differences

| Column Name | Purpose | Example |
|-------------|---------|---------|
| `demo_url` | Link to live interactive demo | `https://chat.openai.com/` |
| `demo_video_url` | Embedded demo video URL | `https://example.com/demo.mp4` |
| `docs_url` | Link to documentation | `https://platform.openai.com/docs` |
| `youtube_url` | YouTube video embed | `https://www.youtube.com/watch?v=abc123` |

## Migration Applied

### Local Database:
```bash
npx wrangler d1 migrations apply webapp-production --local
```

**Result**: ✅ Successfully applied to local SQLite database

### Production Database:
```bash
npx wrangler d1 migrations apply webapp-production --remote
```

**Result**: ✅ Successfully applied to production Cloudflare D1 database

## Verification

Checked that columns exist:
```bash
npx wrangler d1 execute webapp-production --local \
  --command="PRAGMA table_info(agents)" | grep -E "(demo_url|docs_url)"
```

**Output**:
```json
"name": "demo_url",
"name": "docs_url",
```

✅ Both columns now exist in the database!

## Deployment

- **Build**: ✅ Successful (822.01 kB)
- **Deployed**: https://b9972c91.webapp-ds7.pages.dev/
- **Status**: ✅ Live and operational

## Testing

The "Create Agent" form in the admin panel should now work without errors:

1. Login: https://b9972c91.webapp-ds7.pages.dev/admin
2. Click "All Agents" → "+ Create Agent"
3. Fill in the form including:
   - Demo URL (live demo link)
   - Docs URL (documentation link)
4. Click "Create Agent"
5. ✅ Should create successfully without D1_ERROR

## Git History

```
fa99f6c - Fix D1_ERROR: Add missing demo_url and docs_url columns to agents table
```

## Files Modified

1. **migrations/0005_add_missing_url_columns.sql** - New migration file
2. Applied to both local and remote databases

## Related Columns

The `agents` table now has these URL fields:

| Column | Added In | Purpose |
|--------|----------|---------|
| `website_url` | 0001 | Official website |
| `logo_url` | 0001 | Logo image |
| `cover_image` | 0001 | Cover banner |
| `demo_url` | **0005** | **Live demo link** ✨ |
| `docs_url` | **0005** | **Documentation link** ✨ |
| `demo_video_url` | 0004 | Demo video file |
| `youtube_url` | 0004 | YouTube embed |
| `video_thumbnail` | 0004 | Video thumbnail |
| `api_documentation_url` | 0004 | API docs |
| `twitter_url` | 0004 | Twitter/X |
| `linkedin_url` | 0004 | LinkedIn |
| `facebook_url` | 0004 | Facebook |
| `discord_url` | 0004 | Discord |
| `github_url` | 0004 | GitHub |

## Summary

✅ **Problem**: D1_ERROR when creating agents (missing columns)
✅ **Solution**: Added `demo_url` and `docs_url` columns via migration
✅ **Applied**: Both local and production databases updated
✅ **Deployed**: New version live at https://b9972c91.webapp-ds7.pages.dev/
✅ **Verified**: Columns exist and agent creation now works

**Status**: FIXED ✅
