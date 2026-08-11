import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import * as fs from 'fs';
import * as path from 'path';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export class CloudinaryService {
  /**
   * Uploads an image buffer to Cloudinary, applying a square crop automatically.
   */
  public async uploadAvatar(fileBuffer: Buffer): Promise<{ url: string; publicId: string }> {
    if (env.CLOUDINARY_CLOUD_NAME === 'Root' || env.CLOUDINARY_CLOUD_NAME === 'placeholder') {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filename = `avatar-${Date.now()}.png`;
      fs.writeFileSync(path.join(uploadDir, filename), fileBuffer);
      return { url: `http://localhost:${env.PORT}/uploads/${filename}`, publicId: filename };
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'careerforge/avatars',
          transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }], // Auto crop to face
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary Error:', error);
            return reject(new AppError(error.message || 'Image upload failed. Please check Cloudinary configuration.', 400));
          }
          if (!result) return reject(new AppError('Upload failed', 500));
          resolve({ url: result.secure_url, publicId: result.public_id });
        }
      );

      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
  }

  /**
   * Deletes an asset from Cloudinary using its public ID.
   */
  public async deleteAsset(publicId: string): Promise<void> {
    if (env.CLOUDINARY_CLOUD_NAME === 'Root' || env.CLOUDINARY_CLOUD_NAME === 'placeholder' || publicId.startsWith('avatar-')) {
      const filePath = path.join(process.cwd(), 'public', 'uploads', publicId);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return;
    }

    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Failed to delete asset from Cloudinary:', error);
    }
  }
}
