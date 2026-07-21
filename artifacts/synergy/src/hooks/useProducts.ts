import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "../lib/api";
import { Product } from "../types";

export function useProducts(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams(params || {});
      const queryString = searchParams.toString();
      const res = await fetchApi<{ products: Product[], total: number, page: number, pages: number }>(
        queryString ? `/products?${queryString}` : "/products"
      );
      return res;
    },
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const res = await fetchApi<Product>(`/products/${slug}`);
      return res;
    },
    enabled: !!slug,
  });
}
