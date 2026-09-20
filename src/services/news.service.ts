import { api } from "@/lib/api";
import type {
  NewsArticle,
  CreateNewsPayload,
  UpdateNewsPayload,
  NewsListResponse,
  SingleNewsResponse,
  DeleteNewsResponse,
} from "@/types/news.types";

// ─────────────────────────────────────────────
// News & Announcements Service
// Based on api-integration/newspost.txt
// ─────────────────────────────────────────────

/** Get all news articles (Public & Admin) */
export const getNewsList = (): Promise<NewsListResponse> =>
  api.get("/news").then((res) => res.data);

/** Get single news article by ID (Public & Admin) */
export const getNewsById = (newsId: string): Promise<SingleNewsResponse> =>
  api.get(`/news/${newsId}`).then((res) => res.data);

/** Create a news article (Admin) */
export const createNews = (
  payload: CreateNewsPayload
): Promise<SingleNewsResponse> =>
  api.post("/news", payload).then((res) => res.data);

/** Update a news article (Admin) */
export const updateNews = (
  newsId: string,
  payload: UpdateNewsPayload
): Promise<SingleNewsResponse> =>
  api.patch(`/news/${newsId}`, payload).then((res) => res.data);

/** Delete a news article (Admin) */
export const deleteNews = (newsId: string): Promise<DeleteNewsResponse> =>
  api.delete(`/news/${newsId}`).then((res) => res.data);
