import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "../lib/api";

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  category: string;
  readTime: string;
  coverImage: string;
  tags: string[];
  status: string;
  metaTitle: string;
  metaDescription: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useBlogPosts(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["blog", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams(params || {});
      const queryString = searchParams.toString();
      const res = await fetchApi<BlogPost[]>(
        queryString ? `/blogs?${queryString}` : "/blogs"
      );
      return res;
    },
  });
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const res = await fetchApi<BlogPost>(`/blogs/${slug}`);
      return res;
    },
    enabled: !!slug,
  });
}
