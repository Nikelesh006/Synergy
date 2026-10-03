import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

let isConfigured = false;

export const configureCloudinary = (): boolean => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName.trim(),
      api_key: apiKey.trim(),
      api_secret: apiSecret.trim(),
      secure: true,
    });
    isConfigured = true;
    return true;
  }
  return false;
};

export const isCloudinaryConfigured = (): boolean => {
  if (!isConfigured) {
    return configureCloudinary();
  }
  return isConfigured;
};

export interface UploadOptions {
  folder?: string;
  publicId?: string;
}

/**
 * Uploads a base64 Data URL or remote image URL to Cloudinary.
 * Automatically applies auto-format and auto-quality.
 */
export const uploadToCloudinary = async (
  file: string,
  options: UploadOptions = {}
): Promise<UploadApiResponse> => {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      "Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in artifacts/api-server/.env."
    );
  }

  const { folder = "synergy/products", publicId } = options;

  return cloudinary.uploader.upload(file, {
    folder,
    public_id: publicId,
    resource_type: "image",
    overwrite: true,
  });
};

export { cloudinary };
