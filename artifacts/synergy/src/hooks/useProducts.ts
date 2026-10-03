import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "../lib/api";
import { Product } from "../types";
import { products as fallbackProducts } from "../data/products";

function filterFallbackProducts(params?: Record<string, string>) {
  if (!params) return { products: fallbackProducts, total: fallbackProducts.length, page: 1, pages: 1 };

  let list = [...fallbackProducts];
  const { category, brand, search, featured, newArrival, bestSeller, inStock, minPrice, maxPrice, sort } = params;

  if (category) {
    list = list.filter((p) => p.category?.toLowerCase() === category.toLowerCase());
  }
  if (brand) {
    list = list.filter((p) => p.brand?.toLowerCase() === brand.toLowerCase());
  }
  if (featured === "true") {
    list = list.filter((p) => Boolean(p.isFeatured));
  }
  if (newArrival === "true") {
    list = list.filter((p) => Boolean(p.isNewArrival));
  }
  if (bestSeller === "true") {
    list = list.filter((p) => Boolean(p.isBestSeller));
  }
  if (inStock === "true") {
    list = list.filter((p) => Boolean(p.inStock));
  }
  if (minPrice) {
    list = list.filter((p) => p.price >= Number(minPrice));
  }
  if (maxPrice) {
    list = list.filter((p) => p.price <= Number(maxPrice));
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q)
    );
  }

  if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);

  return {
    products: list,
    total: list.length,
    page: 1,
    pages: 1,
  };
}

export function useProducts(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      try {
        const searchParams = new URLSearchParams(params || {});
        const queryString = searchParams.toString();
        const res = await fetchApi<{ products: Product[]; total: number; page: number; pages: number }>(
          queryString ? `/products?${queryString}` : "/products"
        );
        if (res && Array.isArray(res.products) && res.products.length > 0) {
          return res;
        }
      } catch (err) {
        console.warn("API product query fallback used:", err);
      }
      return filterFallbackProducts(params);
    },
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      try {
        const res = await fetchApi<Product>(`/products/${slug}`);
        if (res && res.name) return res;
      } catch (err) {
        console.warn("API single product fallback used:", err);
      }
      const found = fallbackProducts.find((p) => p.slug === slug || p.id === slug);
      if (found) return found;
      throw new Error("Product not found");
    },
    enabled: !!slug,
  });
}

