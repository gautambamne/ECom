import { v2 as cloudinary } from 'cloudinary';
import { ApiError } from '../advices/ApiError';

interface CloudinaryUploadResult {
  url: string;
  public_id: string;
  secure_url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

interface UploadOptions {
  folder?: string;
  public_id?: string;
  overwrite?: boolean;
  resource_type?: 'image' | 'video' | 'raw' | 'auto';
  transformation?: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb' | 'pad' | 'limit' | 'mfit' | 'mpad';
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    fetch_format?: 'auto';
  };
}

export class CloudinaryService {
  private static instance: CloudinaryService;

  private constructor() {
    // Validate Cloudinary configuration
    if (!process.env.CLOUDINARY_CLOUD_NAME || 
        !process.env.CLOUDINARY_API_KEY || 
        !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Cloudinary configuration missing. Please check environment variables.');
    }
  }

  static getInstance(): CloudinaryService {
    if (!CloudinaryService.instance) {
      CloudinaryService.instance = new CloudinaryService();
    }
    return CloudinaryService.instance;
  }

  /**
   * Upload image buffer to Cloudinary
   */
  async uploadImage(
    buffer: Buffer, 
    options: UploadOptions = {}
  ): Promise<CloudinaryUploadResult> {
    try {
      if (!buffer || !Buffer.isBuffer(buffer)) {
        throw new ApiError(400, 'Invalid buffer provided');
      }

      const {
        folder = 'products',
        resource_type = 'image',
        transformation = {
          width: 800,
          height: 600,
          crop: 'fill',
          quality: 'auto',
          fetch_format: 'auto',
          format: 'auto'
        },
        overwrite = true
      } = options;

      // Convert buffer to base64
      const base64String = `data:image/jpeg;base64,${buffer.toString('base64')}`;

      const uploadOptions = {
        folder,
        resource_type,
        overwrite,
        ...transformation
      };

      const result = await cloudinary.uploader.upload(base64String, uploadOptions);

      return {
        url: result.url,
        public_id: result.public_id,
        secure_url: result.secure_url,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes
      };

    } catch (error: any) {
      console.error('Cloudinary upload error:', error);
      
      if (error.http_code) {
        throw new ApiError(error.http_code, `Cloudinary error: ${error.message}`);
      }
      
      throw new ApiError(500, `Failed to upload image: ${error.message}`);
    }
  }

  /**
   * Upload multiple images to Cloudinary
   */
  async uploadMultipleImages(
    buffers: Buffer[], 
    options: UploadOptions = {}
  ): Promise<CloudinaryUploadResult[]> {
    try {
      const uploadPromises = buffers.map(buffer => this.uploadImage(buffer, options));
      return await Promise.all(uploadPromises);
    } catch (error: any) {
      console.error('Multiple upload error:', error);
      throw new ApiError(500, `Failed to upload multiple images: ${error.message}`);
    }
  }

  /**
   * Delete image from Cloudinary
   */
  async deleteImage(publicId: string): Promise<{ result: string }> {
    try {
      if (!publicId) {
        throw new ApiError(400, 'Public ID is required');
      }

      // console.log('Deleting image from Cloudinary:', publicId);
      
      const result = await cloudinary.uploader.destroy(publicId);
      
      // console.log('Cloudinary delete result:', result);
      
      return result;
    } catch (error: any) {
      console.error('Cloudinary delete error:', error);
      throw new ApiError(500, `Failed to delete image: ${error.message}`);
    }
  }

  /**
   * Delete multiple images from Cloudinary
   */
  async deleteMultipleImages(publicIds: string[]): Promise<{ deleted: Record<string, string> }> {
    try {
      if (!publicIds || publicIds.length === 0) {
        throw new ApiError(400, 'Public IDs array is required');
      }

      // console.log('Deleting multiple images from Cloudinary:', publicIds);
      
      const result = await cloudinary.api.delete_resources(publicIds);
      
      // console.log('Cloudinary bulk delete result:', result);
      
      return result;
    } catch (error: any) {
      console.error('Cloudinary bulk delete error:', error);
      throw new ApiError(500, `Failed to delete multiple images: ${error.message}`);
    }
  }

  /**
   * Get optimized URL for existing image
   */
  getOptimizedUrl(publicId: string, transformation: any = {}): string {
    const defaultTransformation = {
      quality: 'auto',
      fetch_format: 'auto',
      width: 800,
      height: 600,
      crop: 'fill'
    };

    return cloudinary.url(publicId, {
      ...defaultTransformation,
      ...transformation
    });
  }

  /**
   * Extract public ID from Cloudinary URL
   */
  extractPublicId(url: string): string | null {
    try {
      const regex = /\/v\d+\/(.+)\.\w+$/;
      const match = url.match(regex);
      return match?.[1] || null;
    } catch (error) {
      console.error('Error extracting public ID:', error);
      return null;
    }
  }
}