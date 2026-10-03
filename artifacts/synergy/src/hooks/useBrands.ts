import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "../lib/api";
import { brands as fallbackBrands } from "../data/brands";

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
}

export function useBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      try {
        const res = await fetchApi<Brand[]>("/brands");
        if (Array.isArray(res) && res.length > 0) {
          return res;
        }
      } catch (err) {
        console.warn("API brands fallback used:", err);
      }
      return fallbackBrands as Brand[];
    },
  });
}

