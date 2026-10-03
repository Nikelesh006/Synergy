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

import { tutorialPosts as fallbackTutorials } from "../data/tutorials";

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
        if (Array.isArray(res) && res.length > 0) return res;
      } catch (err) {
        console.warn("API tutorials fallback used:", err);
      }
      return fallbackTutorials.map((t) => ({
        _id: t.id,
        title: t.title,
        slug: t.slug,
        shortDescription: t.excerpt,
        description: t.excerpt,
        youtubeUrl: t.youtubeUrl || "",
        thumbnailUrl: t.image,
        channelName: t.author,
        instructor: t.author,
        category: t.category,
        level: "All Levels",
        status: "Published",
        duration: t.readTime,
        publishDate: t.date,
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
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
