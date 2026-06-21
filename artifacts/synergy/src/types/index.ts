export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  category: string;
  subcategory: string;
  shortDescription: string;
  description: string;
  specifications: Record<string, string>;
  features: string[];
  applications: string[];
  images: string[];
  price: number;
  compareAtPrice?: number;
  currency: string;
  stock: number;
  inStock: boolean;
  minOrderQty: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  warrantyInfo: string;
  shippingInfo: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  productCount: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo?: string;
  productCount: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  product: Product;
}
