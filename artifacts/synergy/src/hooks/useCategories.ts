import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "../lib/api";
import { Category } from "../types";
import { categories as fallbackCategories } from "../data/categories";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const res = await fetchApi<Category[]>("/categories");
        if (Array.isArray(res) && res.length > 0) {
          return res;
        }
      } catch (err) {
        console.warn("API categories fallback used:", err);
      }
      return fallbackCategories;
    },
  });
}

