#!/usr/bin/env node

/**
 * Image Optimization Script for MQ Studio
 *
 * Optimizes images by:
 * - Resizing to max 2000px width (maintaining aspect ratio)
 * - Converting to WebP format (85% quality)
 * - Preserving originals in backup directory
 *
 * Usage:
 *   node scripts/optimize-images.js [directory] [options]
 *
 * Options:
 *   --dry-run: Show what would be optimized without actually doing it
 *   --quality: WebP quality (default: 85)
 *   --max-width: Maximum width in pixels (default: 2000)
 *   --backup: Backup original files (default: true)
 */

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const DEFAULT_QUALITY = 85;
const DEFAULT_MAX_WIDTH = 2000;
const BACKUP_DIR = 'public/images/.originals';

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const quality = parseInt(args.find(arg => arg.startsWith('--quality='))?.split('=')[1] || DEFAULT_QUALITY);
const maxWidth = parseInt(args.find(arg => arg.startsWith('--max-width='))?.split('=')[1] || DEFAULT_MAX_WIDTH);
const shouldBackup = !args.includes('--no-backup');
const targetDir = args.find(arg => !arg.startsWith('--')) || 'public/images';

// Statistics
const stats = {
  processed: 0,
  skipped: 0,
  errors: 0,
  totalSizeBefore: 0,
  totalSizeAfter: 0,
};

/**
 * Format bytes to human-readable size
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Check if file should be optimized
 */
function shouldOptimize(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const isImageFormat = ['.jpg', '.jpeg', '.png'].includes(ext);
  const isNotAlreadyWebP = !filePath.endsWith('.webp');
  const isNotInBackup = !filePath.includes('.originals');

  return isImageFormat && isNotAlreadyWebP && isNotInBackup;
}

/**
 * Get all image files recursively
 */
async function getAllImages(dir) {
  const images = [];

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Recursively process subdirectories
        const subImages = await getAllImages(fullPath);
        images.push(...subImages);
      } else if (shouldOptimize(fullPath)) {
        images.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }

  return images;
}

/**
 * Optimize a single image
 */
async function optimizeImage(imagePath) {
  try {
    // Get original file stats
    const originalStats = await fs.stat(imagePath);
    stats.totalSizeBefore += originalStats.size;

    // Determine output path (replace extension with .webp)
    const parsedPath = path.parse(imagePath);
    const outputPath = path.join(parsedPath.dir, `${parsedPath.name}.webp`);

    // Skip if WebP version already exists and is newer
    try {
      const outputStats = await fs.stat(outputPath);
      if (outputStats.mtime > originalStats.mtime) {
        console.log(`⏭️  Skipping ${path.basename(imagePath)} (WebP version already exists)`);
        stats.skipped++;
        return;
      }
    } catch (error) {
      // File doesn't exist, continue with optimization
    }

    if (isDryRun) {
      console.log(`🔍 Would optimize: ${imagePath} (${formatBytes(originalStats.size)})`);
      stats.processed++;
      return;
    }

    // Backup original if requested
    if (shouldBackup) {
      const backupPath = imagePath.replace('public/images', BACKUP_DIR);
      const backupDir = path.dirname(backupPath);

      await fs.mkdir(backupDir, { recursive: true });
      await fs.copyFile(imagePath, backupPath);
    }

    // Load and optimize image
    const image = sharp(imagePath);
    const metadata = await image.metadata();

    // Resize if width exceeds max
    if (metadata.width > maxWidth) {
      image.resize(maxWidth, null, {
        withoutEnlargement: true,
        fit: 'inside',
      });
    }

    // Convert to WebP
    await image
      .webp({ quality, effort: 6 })
      .toFile(outputPath);

    // Get output file stats
    const outputStats = await fs.stat(outputPath);
    stats.totalSizeAfter += outputStats.size;
    stats.processed++;

    const reduction = ((originalStats.size - outputStats.size) / originalStats.size * 100).toFixed(1);

    console.log(
      `✅ Optimized: ${path.basename(imagePath)}\n` +
      `   ${formatBytes(originalStats.size)} → ${formatBytes(outputStats.size)} (${reduction}% reduction)`
    );

  } catch (error) {
    console.error(`❌ Error optimizing ${imagePath}:`, error.message);
    stats.errors++;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🖼️  MQ Studio Image Optimization\n');
  console.log(`📁 Target directory: ${targetDir}`);
  console.log(`⚙️  Quality: ${quality}%`);
  console.log(`📏 Max width: ${maxWidth}px`);
  console.log(`💾 Backup originals: ${shouldBackup ? 'Yes' : 'No'}`);
  console.log(`🏃 Mode: ${isDryRun ? 'DRY RUN' : 'LIVE'}\n`);

  // Create backup directory if needed
  if (shouldBackup && !isDryRun) {
    await fs.mkdir(BACKUP_DIR, { recursive: true });
  }

  // Get all images
  console.log('🔍 Scanning for images...\n');
  const images = await getAllImages(targetDir);

  if (images.length === 0) {
    console.log('❌ No images found to optimize.');
    return;
  }

  console.log(`📋 Found ${images.length} images to process\n`);

  // Sort by size (largest first) for better progress indication
  const imagesWithStats = await Promise.all(
    images.map(async (img) => {
      const stats = await fs.stat(img);
      return { path: img, size: stats.size };
    })
  );

  imagesWithStats.sort((a, b) => b.size - a.size);

  // Process images
  for (const { path: imagePath } of imagesWithStats) {
    await optimizeImage(imagePath);
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 OPTIMIZATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Processed: ${stats.processed}`);
  console.log(`⏭️  Skipped: ${stats.skipped}`);
  console.log(`❌ Errors: ${stats.errors}`);

  if (!isDryRun && stats.processed > 0) {
    const totalReduction = stats.totalSizeBefore - stats.totalSizeAfter;
    const percentReduction = ((totalReduction / stats.totalSizeBefore) * 100).toFixed(1);

    console.log(`\n💾 Size before: ${formatBytes(stats.totalSizeBefore)}`);
    console.log(`💾 Size after: ${formatBytes(stats.totalSizeAfter)}`);
    console.log(`💰 Total saved: ${formatBytes(totalReduction)} (${percentReduction}% reduction)`);
  }

  console.log('='.repeat(60));

  if (isDryRun) {
    console.log('\n💡 This was a dry run. Run without --dry-run to actually optimize images.');
  }
}

// Run the script
main().catch(console.error);
