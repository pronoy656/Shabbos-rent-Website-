// ─────────────────────────────────────────────
// News & Announcements Types
// Based on api-integration/newspost.txt
// ─────────────────────────────────────────────

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  image: string;
  author: string;
  isPublished: boolean;
  views?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNewsPayload {
  title: string;
  content: string;
  summary: string;
  image: string;
  author: string;
  isPublished?: boolean;
}

export interface UpdateNewsPayload {
  title?: string;
  content?: string;
  summary?: string;
  image?: string;
  author?: string;
  isPublished?: boolean;
}

export interface NewsListResponse {
  success: boolean;
  message: string;
  data: NewsArticle[];
}

export interface SingleNewsResponse {
  success: boolean;
  message: string;
  data: NewsArticle;
}

export interface DeleteNewsResponse {
  success: boolean;
  message: string;
}
