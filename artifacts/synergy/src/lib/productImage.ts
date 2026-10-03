import { getOptimizedImageUrl } from "./cloudinary";

/**
 * Returns a suitable high-fidelity generic image based on product category.
 * None of the images mention any brand names or logos.
 */
export const getCategoryFallbackImage = (category?: string, subcategory?: string): string => {
  const cat = `${category || ""} ${subcategory || ""}`.toLowerCase();
  
  if (cat.includes("iot") || cat.includes("wifi") || cat.includes("wireless")) {
    return "/categories/iot-boards.jpg";
  }
  if (cat.includes("ai") || cat.includes("neural") || cat.includes("edge ai") || cat.includes("jetson") || cat.includes("coral")) {
    return "/categories/ai-boards.jpg";
  }
  if (cat.includes("robot") || cat.includes("motor") || cat.includes("servo") || cat.includes("stepper") || cat.includes("driver")) {
    return "/categories/robotics-boards.jpg";
  }
  if (cat.includes("lab") || cat.includes("sensor") || cat.includes("instrument") || cat.includes("meter") || cat.includes("test") || cat.includes("mr3461") || cat.includes("lvdt")) {
    return "/categories/lab-equipments.jpg";
  }
  // Generic electronics & embedded boards
  return "/categories/embedded-boards.jpg";
};

/**
 * Returns the best image to display for a product.
 * If the product has a valid, non-placeholder image, it returns that.
 * Otherwise, it returns the appropriate generic category image.
 */
export const getProductDisplayImage = (
  image: string | undefined | null,
  category?: string,
  subcategory?: string,
  width = 500
): string => {
  if (
    image &&
    typeof image === "string" &&
    image.trim() !== "" &&
    !image.includes("placehold.co") &&
    !image.includes("placeholder")
  ) {
    return getOptimizedImageUrl(image, { width, crop: "fill" });
  }
  return getCategoryFallbackImage(category, subcategory);
};
