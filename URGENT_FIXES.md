# Urgent Fixes Required

## Issues Found:

### 1. User Registration Error
- Status: NEEDS INVESTIGATION
- Location: `/api/auth/register`
- Code appears correct, need to test actual error

### 2. Upvote Error (FOUND)
- Status: **IDENTIFIED**
- Problem: Frontend calls `/public/:id/upvote` without auth token
- Solution: Check if user logged in, send token with request
- Location: `src/enhanced-agent-page.tsx` line 926

### 3. User Profile Menu Missing
- Status: TODO
- Need: User icon dropdown in header (profile, dashboard, logout)
- Location: `src/components/header.ts`

### 4. Agent Page Redesign Needed
- Logo on left
- Screenshot/video on right  
- Social icons display
- Save/bookmark button
- Better layout matching example

### 5. Color Scheme Update
- Change from purple (#9333ea) to dark futuristic colors
- Suggestions:
  - Primary: Cyan/Teal (#06b6d4, #14b8a6)
  - Secondary: Dark Blue (#1e3a8a, #1e40af)
  - Accent: Electric Blue (#3b82f6)
  - Background: Dark (#0f172a, #1e293b)

## Priority Fixes:

1. Fix upvote function to use auth token
2. Add user menu to header
3. Test and fix registration
4. Update color scheme
5. Redesign agent detail page

## Quick Fixes Needed:

### Fix Upvote (Enhanced Agent Page)
```javascript
async function upvoteAgent() {
    const token = localStorage.getItem('token');
    if (!token) {
        showToast('Please login to upvote', 'error');
        window.location.href = '/login';
        return;
    }
    
    try {
        const response = await axios.post(
            API_BASE + '/agents/' + currentAgent.id + '/upvote',
            {},
            { headers: { Authorization: 'Bearer ' + token } }
        );
        // ... rest of code
    }
}
```

### Add User Menu to Header
Need to check localStorage for token and display user icon with dropdown.

## Status: READY TO IMPLEMENT
