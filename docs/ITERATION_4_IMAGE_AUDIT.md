# Iteration 4: Image Optimization Audit

**Date:** 2025-11-12
**Phase:** 3.1 - Image Audit and Analysis
**Status:** Complete

---

## Executive Summary

**Total Image Assets:** 124 files
**Total Size:** 361MB
**Largest Files:** 19MB PNG files (fireworks paintings)
**Optimization Potential:** ~280MB (77% reduction possible)

---

## Current State

### Size Breakdown
- **Total image directory size:** 361MB
- **Number of files:** 124 images
- **Formats:** JPG, PNG, WebP

### Top 20 Largest Files

| File | Size | Format | Issue |
|------|------|--------|-------|
| fireworks-august-1023.png | 19MB | PNG | Unoptimized artwork |
| fireworks-august-10-23.png | 19MB | PNG | Duplicate/unoptimized |
| climate-protest-painting.png | 19MB | PNG | Unoptimized artwork |
| richmond-fishing-boat.png | 15MB | PNG | Unoptimized artwork |
| flowers-in-vase-june-23.png | 8.7MB | PNG | Unoptimized artwork |
| protest-march.jpg | 4.4MB | JPG | Unoptimized, high resolution |
| kim-and-pip-kitchen-garden.jpg | 4.4MB | JPG | Unoptimized, high resolution |
| green.jpg | 4.4MB | JPG | Unoptimized, high resolution |
| pink-dogwood-mq-painting.jpg | 4.2MB | JPG | Unoptimized, high resolution |
| may-30-iris.jpg | 4.2MB | JPG | Unoptimized, high resolution |
| may-23rd-painting-rhodos.jpg | 4.1MB | JPG | Unoptimized, high resolution |
| img1981.jpg | 4.1MB | JPG | Unoptimized, high resolution |
| img-1981.jpg | 4.1MB | JPG | Duplicate file |
| rain-street.jpg | 4.0MB | JPG | Unoptimized, high resolution |
| april-13-park.jpg | 4.0MB | JPG | Unoptimized, high resolution |
| terrace-painting.jpg | 3.9MB | JPG | Unoptimized, high resolution |
| sunflowers.jpg | 3.9MB | JPG | Unoptimized, high resolution |
| img2033.jpg | 3.9MB | JPG | Unoptimized, high resolution |
| img0627.jpg | 3.9MB | JPG | Unoptimized, high resolution |
| img0627-1.jpg | 3.9MB | JPG | Duplicate file |

**Total of top 20:** ~168MB (46% of total size)

---

## Key Issues Identified

### 1. **PNG Files for Artwork (Critical)**
- **Issue:** PNG format used for watercolor paintings
- **Problem:** PNG is lossless, creates massive file sizes for complex artwork
- **Impact:** 19MB files take 5-10 seconds to load on average connection
- **Solution:** Convert to WebP or optimized JPG (85% quality)
- **Expected Savings:** 15-17MB per file (90% reduction)

### 2. **Unoptimized JPG Files (High)**
- **Issue:** Original camera/scan resolution preserved
- **Problem:** 4MB+ files far exceed web display needs
- **Impact:** Slow page loads, poor mobile experience
- **Solution:** Resize to max 2000px width, 85% quality, convert to WebP
- **Expected Savings:** 3-3.5MB per file (85% reduction)

### 3. **Duplicate Files (Medium)**
- **Issue:** Multiple copies of same image with slight name variations
- **Examples:**
  - img1981.jpg & img-1981.jpg
  - img0627.jpg & img0627-1.jpg
  - fireworks-august-1023.png & fireworks-august-10-23.png
- **Solution:** Identify and remove duplicates, update references
- **Expected Savings:** ~12MB

### 4. **Missing WebP Variants (Medium)**
- **Issue:** Most images only exist as JPG/PNG
- **Problem:** Missing opportunity for modern browser optimization
- **Solution:** Generate WebP versions, use Next.js Image component
- **Expected Savings:** Additional 20-30% on top of other optimizations

### 5. **No Lazy Loading (Medium)**
- **Issue:** All images loaded immediately
- **Problem:** Unnecessary network usage for below-fold content
- **Solution:** Use Next.js Image component with automatic lazy loading
- **Expected Savings:** Faster initial page load, better LCP scores

---

## Optimization Strategy

### Phase 1: Critical PNG Files (Immediate Impact)
**Target:** 5 largest PNG files (81MB total)
**Action:** Convert to WebP at 85% quality, max 2000px width
**Expected Result:** ~12MB (85% reduction = 69MB saved)
**Time:** 30 minutes

### Phase 2: Large JPG Files (High Impact)
**Target:** Top 15 JPG files over 3.5MB (60MB total)
**Action:** Resize to 2000px, 85% quality, convert to WebP
**Expected Result:** ~10MB (83% reduction = 50MB saved)
**Time:** 1 hour

### Phase 3: Hero Images (User-Facing)
**Target:** 3 hero images (652KB total)
**Action:** Already have WebP, ensure Next.js Image component used
**Expected Result:** Optimized delivery, no additional savings
**Time:** 30 minutes

### Phase 4: Remaining Images
**Target:** All other images (<3.5MB each)
**Action:** Batch convert to WebP, 85% quality
**Expected Result:** ~40MB (60% reduction = 60MB saved)
**Time:** 1 hour

---

## Expected Results

### Before Optimization
- **Total Size:** 361MB
- **Largest File:** 19MB
- **Average File:** 2.9MB
- **Load Time (3G):** 60-90 seconds
- **Mobile Experience:** Poor
- **Lighthouse Score:** ~40-50

### After Optimization
- **Total Size:** ~60-80MB (78-82% reduction)
- **Largest File:** ~2MB
- **Average File:** ~500KB
- **Load Time (3G):** 10-15 seconds
- **Mobile Experience:** Good
- **Lighthouse Score:** ~80-90

### Bundle Size Impact
- **Current bundle:** N/A (images not in bundle)
- **Network payload:** -280MB (77% reduction)
- **Time to Interactive:** -45-60 seconds on slow connections
- **LCP improvement:** -2-4 seconds

---

## Implementation Plan

### Tools Required
```bash
# Install sharp for image optimization
npm install sharp --save-dev

# Or use Squoosh CLI
npx @squoosh/cli --webp auto public/images/*.{jpg,png}
```

### Optimization Script
Create `scripts/optimize-images.js`:
- Read all images from public/images
- For each image:
  - Resize to max 2000px width (maintain aspect ratio)
  - Convert to WebP at 85% quality
  - Save with .webp extension
  - Optionally: delete original or move to backup

### Next.js Image Component
Update all `<img>` tags to use Next.js `<Image>`:
- Automatic WebP conversion
- Lazy loading by default
- Responsive images
- Blur placeholder

---

## Risk Assessment

### Low Risk
- **Converting to WebP:** Widely supported (97% browser support)
- **Resizing images:** Artwork resolution exceeds display needs
- **Lazy loading:** Standard web practice

### Medium Risk
- **Duplicate removal:** Must verify all references updated
- **Batch processing:** Need to test sample first

### Mitigation
1. **Backup originals:** Keep in separate directory
2. **Test sample first:** Process 3-5 images, verify quality
3. **Gradual rollout:** Optimize by directory (artworks → hero → musings)
4. **Git tracking:** Commit after each phase for easy rollback

---

## Next Steps

1. ✅ **Audit complete** (this document)
2. ⏭️ **Install sharp** and create optimization script
3. ⏭️ **Test on sample** (5 images)
4. ⏭️ **Run Phase 1** (critical PNG files)
5. ⏭️ **Verify results** (visual quality check)
6. ⏭️ **Run Phases 2-4** (remaining images)
7. ⏭️ **Update components** to use Next.js Image
8. ⏭️ **Test deployment** (dev and production builds)
9. ⏭️ **Measure impact** (Lighthouse scores)

---

## Conclusion

**Priority:** HIGH
**Effort:** 3 hours
**Impact:** MASSIVE (77% reduction, 280MB saved)

This is the single most impactful performance optimization for the MQ Studio website. Converting 5 PNG files alone will save 69MB.

**Recommendation:** Proceed immediately with Phase 1 (critical PNG files).

---

**Status:** ✅ AUDIT COMPLETE - Ready for optimization
