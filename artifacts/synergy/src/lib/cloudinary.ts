/**
 * Cloudinary utilities for image uploading and optimized loading.
 */

export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  crop?: "fill" | "fit" | "limit" | "thumb" | "scale";
  quality?: "auto" | number;
}

/**
 * Transforms a Cloudinary image URL to optimize loading performance
 * with automatic WebP/AVIF format selection and optimal compression.
 * Non-Cloudinary URLs or local blobs/placeholders are returned as-is.
 */
export const getOptimizedImageUrl = (
  url: string | undefined | null,
  options: CloudinaryTransformOptions = {}
): string => {
  if (!url || typeof url !== "string") return "";

  // If not hosted on Cloudinary, return untouched
  if (!url.includes("res.cloudinary.com")) {
    return url;
  }

  // Avoid duplicate transformations
  if (url.includes("/upload/f_auto") || url.includes("/upload/c_")) {
    return url;
  }

  const transforms: string[] = ["f_auto", "q_auto"];

  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);
  if (options.crop) transforms.push(`c_${options.crop}`);

  const transformString = transforms.join(",");

  return url.replace("/upload/", `/upload/${transformString}/`);
};

/**
 * Uploads a single image (Data URL or URL string) to the backend Cloudinary endpoint.
 */
export const uploadImageToCloudinary = async (
  dataUri: string,
  folder = "synergy"
): Promise<string> => {
  const apiUrl = import.meta.env.VITE_API_URL || "/api";
  const response = await fetch(`${apiUrl}/upload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image: dataUri, folder }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.details || data.error || "Failed to upload image to Cloudinary");
  }

  return data.url;
};

/**
 * Uploads multiple images (Data URLs or URL strings) to the backend Cloudinary endpoint in batch.
 */
export const uploadImagesToCloudinary = async (
  dataUris: string[],
  folder = "synergy"
): Promise<string[]> => {
  const apiUrl = import.meta.env.VITE_API_URL || "/api";
  const response = await fetch(`${apiUrl}/upload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ images: dataUris, folder }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.details || data.error || "Failed to upload images to Cloudinary");
  }

  return (data.urls as string[]) || [];
};
