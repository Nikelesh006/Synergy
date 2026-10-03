import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "../lib/api";

export interface TutorialPost {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  channelName: string;
  instructor: string;
  category: string;
  level: string;
  status: string;
  duration: string;
  publishDate: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export function useTutorials(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["tutorials", params],
    queryFn: async () => {
      try {
        const searchParams = new URLSearchParams(params || {});
        const queryString = searchParams.toString();
        const res = await fetchApi<TutorialPost[]>(
          queryString ? `/tutorials?${queryString}` : "/tutorials"
        );
        if (Array.isArray(res)) return res;
        return [];
      } catch (err) {
        console.warn("API tutorials failed to load:", err);
        return [];
      }
    },
  });
}


export function useTutorial(slug: string) {
  return useQuery({
    queryKey: ["tutorial", slug],
    queryFn: async () => {
      const res = await fetchApi<TutorialPost>(`/tutorials/${slug}`);
      return res;
    },
    enabled: !!slug,
  });
}
