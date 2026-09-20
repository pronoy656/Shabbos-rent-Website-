import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNewsList,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
} from "@/services/news.service";
import type {
  CreateNewsPayload,
  UpdateNewsPayload,
  NewsListResponse,
  SingleNewsResponse,
  DeleteNewsResponse,
} from "@/types/news.types";

export const NEWS_QUERY_KEY = ["news-articles"];

// ─────────────────────────────────────────────
// News & Announcements Hooks
// ─────────────────────────────────────────────

/** Query hook to fetch all news articles (Public & Admin) */
export const useNewsList = () => {
  return useQuery<NewsListResponse>({
    queryKey: NEWS_QUERY_KEY,
    queryFn: getNewsList,
    staleTime: 2 * 60 * 1000,
  });
};

/** Query hook to fetch a single news article by ID */
export const useNewsDetail = (newsId: string | null) => {
  return useQuery<SingleNewsResponse>({
    queryKey: [...NEWS_QUERY_KEY, newsId],
    queryFn: () => getNewsById(newsId!),
    enabled: Boolean(newsId),
    staleTime: 2 * 60 * 1000,
  });
};

/** Mutation hook to create a new news article (Admin) */
export const useCreateNews = () => {
  const queryClient = useQueryClient();
  return useMutation<SingleNewsResponse, Error, CreateNewsPayload>({
    mutationFn: (payload: CreateNewsPayload) => createNews(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEY });
    },
  });
};

/** Mutation hook to update a news article (Admin) */
export const useUpdateNews = () => {
  const queryClient = useQueryClient();
  return useMutation<
    SingleNewsResponse,
    Error,
    { newsId: string; payload: UpdateNewsPayload }
  >({
    mutationFn: ({ newsId, payload }) => updateNews(newsId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEY });
    },
  });
};

/** Mutation hook to delete a news article (Admin) */
export const useDeleteNews = () => {
  const queryClient = useQueryClient();
  return useMutation<DeleteNewsResponse, Error, string>({
    mutationFn: (newsId: string) => deleteNews(newsId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEY });
    },
  });
};
