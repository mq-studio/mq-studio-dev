# Giscus Comments Setup Guide
## MQ Studio - GitHub Discussions Integration

**Date:** November 14, 2025
**Status:** Ready for deployment
**Effort:** ~15 minutes

---

## Overview

Giscus is a comments system powered by GitHub Discussions. It provides:
- ✅ **Privacy-focused** - No third-party tracking
- ✅ **Free** - No cost, unlimited comments
- ✅ **Moderation** - Full control via GitHub
- ✅ **Open source** - Transparent and trustworthy
- ✅ **No database** - All data in GitHub
- ✅ **Markdown support** - Rich formatting
- ✅ **Reactions** - GitHub emoji reactions

---

## Prerequisites

- GitHub account with admin access to repository
- Public repository (current: `mq-studio/mq-studio-dev`)
- Discussions enabled on repository

---

## Step-by-Step Setup

### Step 1: Enable GitHub Discussions

1. Go to your repository: https://github.com/mq-studio/mq-studio-dev
2. Click **Settings** tab
3. Scroll to **Features** section
4. Check **Discussions** checkbox
5. Click **Set up discussions** if prompted

**Result:** Discussions tab appears in your repository

### Step 2: Install Giscus GitHub App

1. Visit: https://github.com/apps/giscus
2. Click **Install**
3. Select **Only select repositories**
4. Choose `mq-studio/mq-studio-dev`
5. Click **Install**
6. Authorize the app

**Result:** Giscus can read/write discussions in your repository

### Step 3: Create Discussion Category (Optional)

By default, comments go to **Announcements**. To create a dedicated category:

1. Go to repository **Discussions** tab
2. Click **Categories** (gear icon)
3. Click **New category**
4. Name: **Musings Comments** (or just **Comments**)
5. Description: "Comments from MQ Studio website musings"
6. Discussion format: **Open-ended discussion**
7. Click **Create**

**Result:** Dedicated category for website comments

### Step 4: Get Giscus Configuration

1. Visit: https://giscus.app
2. Enter repository: `mq-studio/mq-studio-dev`
3. **Page ↔ Discussions Mapping:** Choose `pathname`
   - This ties comments to specific URLs
4. **Discussion Category:** Select **Musings Comments** (or **Announcements**)
5. **Features:**
   - ✅ Enable reactions
   - ✅ Lazy loading
   - ❌ Emit discussion metadata (not needed)
6. **Theme:** Choose `light` (matches site)

**Result:** Giscus displays configuration code

### Step 5: Copy Configuration Values

From the Giscus configuration page, copy these values:

```html
<script src="https://giscus.app/client.js"
        data-repo="mq-studio/mq-studio-dev"
        data-repo-id="R_xxxxxxxxxxxxx"    <-- Copy this
        data-category="Musings Comments"
        data-category-id="DIC_xxxxxxxxxxx" <-- Copy this
        ...
</script>
```

### Step 6: Update Environment Variables

Add to `.env.local` (or your deployment platform):

```bash
# Giscus Comments
NEXT_PUBLIC_GISCUS_REPO=mq-studio/mq-studio-dev
NEXT_PUBLIC_GISCUS_REPO_ID=R_xxxxxxxxxxxxx           # From Step 5
NEXT_PUBLIC_GISCUS_CATEGORY=Musings Comments        # Or "Announcements"
NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_xxxxxxxxxxx      # From Step 5
```

**Important:** All variables prefixed with `NEXT_PUBLIC_` are required because they're used in client components.

### Step 7: Test Locally

1. Restart dev server: `npm run dev`
2. Navigate to any musing: http://localhost:3100/musings/[any-slug]
3. Scroll to bottom - comment section should load
4. If GitHub login prompt appears, it's working!
5. Post a test comment
6. Check repository Discussions tab - comment should appear

### Step 8: Verify in Production

After deployment:

1. Visit live site: https://mouraquayle.ca/musings/[any-slug]
2. Verify comment section loads
3. Post test comment from different account
4. Confirm moderation works (edit, delete, etc.)

---

## Component Architecture

### CommentSection Component

**Location:** `components/musings/CommentSection.tsx`

**Features:**
- Client component (requires browser APIs)
- Dynamic script loading
- Environment variable configuration
- Graceful fallback (works without IDs for testing)
- Lazy loading for performance
- Automatic cleanup on unmount

**Usage:**
```tsx
import CommentSection from '@/components/musings/CommentSection';

<CommentSection slug={musing.slug} title={musing.title} />
```

Already integrated in: `app/musings/[slug]/page.tsx`

---

## Moderation Guide

### Managing Comments

**View all comments:**
1. Go to repository Discussions
2. Filter by category: **Musings Comments**
3. All comments appear as discussions

**Moderate a comment:**
1. Open the discussion
2. Options:
   - Edit comment (fix typos, remove content)
   - Delete comment (spam, inappropriate)
   - Lock discussion (prevent more comments)
   - Pin discussion (feature important convos)
   - Mark as answer (highlight good responses)

**Block users:**
1. Repository Settings → Moderation
2. Block users tab
3. Add GitHub username

### Comment Notifications

To get notified of new comments:

1. Go to repository → Discussions
2. Click **Watch** dropdown
3. Select **Custom**
4. Check **Discussions**
5. Click **Apply**

**Result:** Email notification for each new comment

---

## Privacy & Security

### Data Storage

- **All comments stored in GitHub Discussions**
- No third-party database
- No external tracking
- Open and transparent

### User Authentication

- Requires GitHub account to comment
- Prevents anonymous spam
- Reduces moderation burden
- Professional audience appropriate

### GDPR Compliance

- Users control their GitHub data
- Can delete comments anytime
- No cookies from Giscus
- GitHub's privacy policy applies

---

## Styling & Customization

### Current Theme

- **Light theme** (matches site aesthetic)
- Default Giscus styling
- Wrapped in site's border/padding styles

### Custom Styling (Future)

Giscus supports custom CSS via theme:

1. Create `public/giscus-custom.css`
2. Set `data-theme="https://mouraquayle.ca/giscus-custom.css"`
3. Style to match brand colors

**Custom CSS example:**
```css
.giscus {
  font-family: var(--font-lora);
}

.giscus-frame {
  border-color: var(--border);
}

/* More customization possible */
```

---

## Troubleshooting

### Comments Not Loading

**Problem:** Giscus section appears but no comment interface

**Solutions:**
1. Check repository is public
2. Verify Discussions enabled
3. Confirm Giscus app installed
4. Check environment variables set correctly
5. Verify category exists and is accessible

### Wrong Discussion Category

**Problem:** Comments appear in wrong category

**Solution:**
1. Update `NEXT_PUBLIC_GISCUS_CATEGORY` env var
2. Get new `NEXT_PUBLIC_GISCUS_CATEGORY_ID` from giscus.app
3. Redeploy

### Cannot Post Comments

**Problem:** Users see "Login to GitHub" but can't comment

**Possible causes:**
1. User not logged into GitHub
2. Repository is private (must be public)
3. User blocked from repository
4. Discussions locked

### Performance Issues

**Problem:** Page loads slowly with comments

**Solutions:**
- Giscus uses lazy loading by default ✓
- Script loads asynchronously ✓
- Consider adding intersection observer for even more delayed loading
- Current implementation is already optimized

---

## Configuration Reference

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_GISCUS_REPO` | No | `mq-studio/mq-studio-dev` | GitHub repository |
| `NEXT_PUBLIC_GISCUS_REPO_ID` | Yes* | - | Repository ID from giscus.app |
| `NEXT_PUBLIC_GISCUS_CATEGORY` | No | `Musings` | Discussion category name |
| `NEXT_PUBLIC_GISCUS_CATEGORY_ID` | Yes* | - | Category ID from giscus.app |

\* Required for production. Works without IDs in development for testing.

### Giscus Script Attributes

| Attribute | Value | Description |
|-----------|-------|-------------|
| `data-mapping` | `pathname` | Maps comments to URL path |
| `data-strict` | `0` | Fuzzy matching for URLs |
| `data-reactions-enabled` | `1` | Enable emoji reactions |
| `data-emit-metadata` | `0` | Don't emit extra metadata |
| `data-input-position` | `bottom` | Comment box at bottom |
| `data-theme` | `light` | Light color theme |
| `data-lang` | `en` | English language |
| `data-loading` | `lazy` | Lazy load for performance |

---

## Backup & Migration

### Export Comments

GitHub Discussions can be exported via GitHub API:

```bash
# Using GitHub CLI
gh api graphql -f query='
  query($owner: String!, $repo: String!) {
    repository(owner: $owner, name: $repo) {
      discussions(first: 100) {
        nodes {
          title
          body
          url
        }
      }
    }
  }
' -F owner=mq-studio -F repo=mq-studio-dev
```

### Migrate to Different Repository

1. Get new repository IDs from giscus.app
2. Update environment variables
3. Redeploy
4. Old comments remain in old repo (can manually copy if needed)

---

## Future Enhancements

### Potential Improvements

1. **Custom theme CSS** - Match exact brand colors
2. **Email notifications** - Alert Moura of new comments
3. **Comment count badge** - Show count before loading section
4. **Pre-moderation** - Review comments before public
5. **Anonymous feedback** - Form for those without GitHub

### Analytics Integration

Track comment engagement:
- Number of comments per post
- Most discussed musings
- User engagement trends

---

## Support & Resources

### Official Documentation
- Giscus Homepage: https://giscus.app
- GitHub Discussions: https://docs.github.com/en/discussions
- Giscus GitHub: https://github.com/giscus/giscus

### Community Support
- Giscus Discussions: https://github.com/giscus/giscus/discussions
- Report issues: https://github.com/giscus/giscus/issues

---

## Conclusion

Giscus provides a robust, privacy-focused commenting system that:
- Requires no database or backend
- Costs nothing
- Gives full moderation control
- Respects user privacy
- Integrates seamlessly with existing GitHub workflow

The component is production-ready and will work immediately once:
1. GitHub Discussions enabled
2. Giscus app installed
3. Environment variables configured

**Estimated setup time:** 15 minutes
**Ongoing maintenance:** Minimal (GitHub handles infrastructure)
**Cost:** Free forever

---

**Guide Created:** November 14, 2025
**Implementation Status:** Complete
**Phase:** 6.4.3 - Giscus Comments System

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
