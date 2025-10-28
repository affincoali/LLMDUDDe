import { Hono } from 'hono';
import type { Bindings } from '../types';

const upload = new Hono<{ Bindings: Bindings }>();

/**
 * POST /api/upload/image
 * Upload image to R2 storage
 * 
 * Accepts multipart/form-data with 'file' field
 * Returns public URL to uploaded image
 */
upload.post('/image', async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.json({ 
        success: false, 
        error: 'No file provided' 
      }, 400);
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return c.json({ 
        success: false, 
        error: 'File must be an image (JPEG, PNG, GIF, or WebP)' 
      }, 400);
    }
    
    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return c.json({ 
        success: false, 
        error: 'File size must be less than 5MB' 
      }, 400);
    }
    
    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filename = `${timestamp}-${randomStr}.${ext}`;
    const key = `uploads/${filename}`;
    
    // Upload to R2
    const { IMAGES } = c.env;
    
    // Convert file to ArrayBuffer for R2
    const arrayBuffer = await file.arrayBuffer();
    
    await IMAGES.put(key, arrayBuffer, {
      httpMetadata: {
        contentType: file.type,
      },
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
      }
    });
    
    // Generate public URL using R2 public domain
    const publicUrl = `https://pub-0226aad7dbe14d2ba087dca75180dc49.r2.dev/${key}`;
    
    return c.json({
      success: true,
      data: {
        url: publicUrl,
        key: key,
        filename: filename,
        originalName: file.name,
        size: file.size,
        type: file.type
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    return c.json({ 
      success: false, 
      error: 'Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, 500);
  }
});

/**
 * POST /api/upload/images
 * Upload multiple images at once (for screenshots)
 * 
 * Accepts multipart/form-data with 'files' field (multiple)
 * Returns array of public URLs
 */
upload.post('/images', async (c) => {
  try {
    const formData = await c.req.formData();
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return c.json({ 
        success: false, 
        error: 'No files provided' 
      }, 400);
    }
    
    // Limit to 5 images
    if (files.length > 5) {
      return c.json({ 
        success: false, 
        error: 'Maximum 5 images allowed' 
      }, 400);
    }
    
    const uploadedImages: any[] = [];
    const { IMAGES } = c.env;
    
    // Upload each file
    for (const file of files) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        continue; // Skip invalid files
      }
      
      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        continue; // Skip files over 5MB
      }
      
      // Generate unique filename
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 15);
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const filename = `${timestamp}-${randomStr}.${ext}`;
      const key = `uploads/${filename}`;
      
      // Upload to R2
      const arrayBuffer = await file.arrayBuffer();
      await IMAGES.put(key, arrayBuffer, {
        httpMetadata: {
          contentType: file.type,
        },
        customMetadata: {
          originalName: file.name,
          uploadedAt: new Date().toISOString(),
        }
      });
      
      // Generate public URL using R2 public domain
      const publicUrl = `https://pub-0226aad7dbe14d2ba087dca75180dc49.r2.dev/${key}`;
      
      uploadedImages.push({
        url: publicUrl,
        key: key,
        filename: filename,
        originalName: file.name,
        size: file.size,
        type: file.type
      });
    }
    
    return c.json({
      success: true,
      data: uploadedImages,
      count: uploadedImages.length
    });
  } catch (error) {
    console.error('Upload error:', error);
    return c.json({ 
      success: false, 
      error: 'Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, 500);
  }
});

/**
 * DELETE /api/upload/image
 * Delete image from R2 storage
 * 
 * Body: { key: "uploads/filename.jpg" }
 */
upload.delete('/image', async (c) => {
  try {
    const { key } = await c.req.json();
    
    if (!key) {
      return c.json({ 
        success: false, 
        error: 'No key provided' 
      }, 400);
    }
    
    // Security: Ensure key starts with 'uploads/'
    if (!key.startsWith('uploads/')) {
      return c.json({ 
        success: false, 
        error: 'Invalid key format' 
      }, 400);
    }
    
    const { IMAGES } = c.env;
    await IMAGES.delete(key);
    
    return c.json({ 
      success: true, 
      message: 'Image deleted successfully' 
    });
  } catch (error) {
    console.error('Delete error:', error);
    return c.json({ 
      success: false, 
      error: 'Delete failed: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, 500);
  }
});

/**
 * GET /api/upload/image/:key
 * Get image from R2 storage (for serving images)
 * 
 * This is useful if you don't have a custom R2 domain set up
 */
upload.get('/image/*', async (c) => {
  try {
    const key = c.req.param('*'); // Gets everything after /image/
    
    const { IMAGES } = c.env;
    const object = await IMAGES.get(key);
    
    if (!object) {
      return c.json({ 
        success: false, 
        error: 'Image not found' 
      }, 404);
    }
    
    // Return image with proper content type
    const headers = new Headers();
    headers.set('Content-Type', object.httpMetadata?.contentType || 'image/jpeg');
    headers.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    
    return new Response(object.body, { headers });
  } catch (error) {
    console.error('Get image error:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to retrieve image' 
    }, 500);
  }
});

export default upload;
