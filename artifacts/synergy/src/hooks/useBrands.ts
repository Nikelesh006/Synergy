import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "../lib/api";

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
      const res = await fetchApi<Brand[]>("/brands");
      return res;
    },
  });
}
