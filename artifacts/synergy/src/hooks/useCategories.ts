import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "../lib/api";
import { Category } from "../types";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetchApi<Category[]>("/categories");
      return res;
    },
  });
}
