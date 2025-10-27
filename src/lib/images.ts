/**
 * Image Upload and Management Utilities for Cloudflare R2
 * 
 * Handles:
 * - Image validation (type, size)
 * - Upload to R2
 * - Delete from R2
 * - Public URL generation
 */

// Allowed image types
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

// File size limits
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_LOGO_SIZE = 2 * 1024 * 1024; // 2MB for logos

/**
 * Validate image file
 */
export function validateImage(file: File, type: 'logo' | 'cover' | 'screenshot'): { valid: boolean; error?: string } {
  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`
    };
  }

  // Check file size
  const maxSize = type === 'logo' ? MAX_LOGO_SIZE : MAX_FILE_SIZE;
  if (file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024);
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`
    };
  }

  return { valid: true };
}

/**
 * Generate unique image key for R2
 * Format: {type}/{timestamp}-{random}-{filename}
 */
export function generateImageKey(filename: string, type: 'logo' | 'cover' | 'screenshot'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const extension = filename.split('.').pop()?.toLowerCase() || 'jpg';
  const sanitizedName = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  return `${type}/${timestamp}-${random}-${sanitizedName}`;
}

/**
 * Upload image to Cloudflare R2
 */
export async function uploadToR2(
  r2: R2Bucket,
  file: ArrayBuffer,
  key: string,
  contentType: string
): Promise<{ success: boolean; key?: string; error?: string }> {
  try {
    await r2.put(key, file, {
      httpMetadata: {
        contentType
      }
    });

    return {
      success: true,
      key
    };
  } catch (error) {
    console.error('R2 upload error:', error);
    return {
      success: false,
      error: 'Failed to upload image'
    };
  }
}

/**
 * Delete image from R2
 */
export async function deleteFromR2(
  r2: R2Bucket,
  key: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await r2.delete(key);
    return { success: true };
  } catch (error) {
    console.error('R2 delete error:', error);
    return {
      success: false,
      error: 'Failed to delete image'
    };
  }
}

/**
 * Get public URL for R2 object
 * Note: For production, you'll need to configure a custom domain or R2.dev subdomain
 */
export function getPublicUrl(key: string, bucketName: string = 'webapp-images'): string {
  // For development, return the R2.dev URL format
  // In production, replace with your custom domain
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || 'YOUR_ACCOUNT_ID';
  return `https://${bucketName}.${accountId}.r2.cloudflarestorage.com/${key}`;
}

/**
 * Extract key from R2 URL
 */
export function extractKeyFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    // Remove empty first element and join the rest
    return pathParts.slice(1).join('/');
  } catch {
    return null;
  }
}

/**
 * Validate image dimensions (optional - requires canvas/image processing)
 * For now, we rely on file size limits
 */
export function validateImageDimensions(
  width: number,
  height: number,
  type: 'logo' | 'cover' | 'screenshot'
): { valid: boolean; error?: string } {
  const limits = {
    logo: { maxWidth: 1000, maxHeight: 1000 },
    cover: { maxWidth: 2000, maxHeight: 1000 },
    screenshot: { maxWidth: 3000, maxHeight: 2000 }
  };

  const limit = limits[type];
  
  if (width > limit.maxWidth || height > limit.maxHeight) {
    return {
      valid: false,
      error: `Image dimensions exceed ${limit.maxWidth}x${limit.maxHeight}px`
    };
  }

  return { valid: true };
}

/**
 * Check if file is an image based on magic bytes
 * (More secure than just checking extension/mime type)
 */
export function isValidImageFile(buffer: ArrayBuffer): boolean {
  const arr = new Uint8Array(buffer).subarray(0, 4);
  const header = Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Check magic bytes for common image formats
  const magicBytes: Record<string, string[]> = {
    jpg: ['ffd8ffe0', 'ffd8ffe1', 'ffd8ffe2', 'ffd8ffe3', 'ffd8ffe8'],
    png: ['89504e47'],
    gif: ['47494638'],
    webp: ['52494646'] // RIFF header (WebP is RIFF-based)
  };

  for (const format in magicBytes) {
    if (magicBytes[format].some(magic => header.startsWith(magic))) {
      return true;
    }
  }

  return false;
}
