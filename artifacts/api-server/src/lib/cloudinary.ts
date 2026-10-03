import type { UploadApiResponse } from "cloudinary";

let isConfigured = false;
let cloudinaryLib: any = null;

const getCloudinary = async (): Promise<any> => {
  if (cloudinaryLib) return cloudinaryLib;
  try {
    const mod = await import("cloudinary");
    cloudinaryLib = mod.v2 || (mod as any).default?.v2 || mod;
    return cloudinaryLib;
  } catch {
    return null;
  }
};

export const configureCloudinary = async (): Promise<boolean> => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    const c = await getCloudinary();
    if (c) {
      c.config({
        cloud_name: cloudName.trim(),
        api_key: apiKey.trim(),
        api_secret: apiSecret.trim(),
        secure: true,
      });
      isConfigured = true;
      return true;
    }
  }
  return false;
};

export const isCloudinaryConfigured = (): boolean => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  return Boolean(cloudName && apiKey && apiSecret);
};

export interface UploadOptions {
  folder?: string;
  publicId?: string;
}

/**
 * Uploads a base64 Data URL or remote image URL to Cloudinary.
 * If Cloudinary is not configured or package is unavailable,
 * gracefully falls back to returning the provided URL without crashing.
 */
export const uploadToCloudinary = async (
  file: string,
  options: UploadOptions = {}
): Promise<UploadApiResponse> => {
  if (!isCloudinaryConfigured()) {
    // Graceful fallback: return file URL directly
    return {
      secure_url: file,
      url: file,
      public_id: options.publicId || `local_${Date.now()}`,
    } as UploadApiResponse;
  }

  const c = await getCloudinary();
  if (!c) {
    return {
      secure_url: file,
      url: file,
      public_id: options.publicId || `local_${Date.now()}`,
    } as UploadApiResponse;
  }

  // Ensure configured
  await configureCloudinary();

  const { folder = "synergy/products", publicId } = options;

  return c.uploader.upload(file, {
    folder,
    public_id: publicId,
    resource_type: "image",
    overwrite: true,
  });
};

export const cloudinary = cloudinaryLib;
