import { defaultFetch } from '.';
import { Envs } from '../utils/env';
import { PageContent } from './types';

export interface Book {
  bookId: number;
  isbn13: string;
  title: string;
  author: string;
  publisher: string;
  /** @example "2025-07-19T09:18:33.333Z" */
  pubDate: string;
  /** 0~10 */
  reputation: number;
  coverImage: string;
  description: string;
  categoryName: string;
  /** @example "2025-07-19T09:18:33.333Z" */
  createdAt: string;
  viewCount: number;
}

export type TrendingBooksResponse = PageContent<Book>;

export const requestGetTrendingBooks = () => {
  const url = `${Envs.VITE_API_ENDPOINT}/api/books/trending`;

  return defaultFetch(url, { method: 'GET' });
};

export const requestGetRecommendationBooks = () => {
  const url = `${Envs.VITE_API_ENDPOINT}/api/books/recommendations/star`;

  return defaultFetch(url, { method: 'GET' });
};

/** @returns {Book} */
export const requestGetBookDetail = (id: number) => {
  const url = `${Envs.VITE_API_ENDPOINT}/api/books/${id}`;

  return defaultFetch(url, { method: 'GET' });
};

export interface RecentBook {
  bookId: number;
  title: string;
  coverImage: string;
  /** @example '2025-07-22T14:28:34.852305' */
  viewedAt: string;
}

// * 리턴 타입이 묘하게 다름
export interface RecentBooksResponse extends PageContent<RecentBook> {
  data: {
    content: RecentBook[];
  };
}
/** @return {RecentBooksResponse} */
export const requestGetRecentBooks = () => {
  const url = `${Envs.VITE_API_ENDPOINT}/api/recent-books`;

  return defaultFetch(url, { method: 'GET' });
};

export const requestAddBookMark = (bookId: number) => {
  const url = `${Envs.VITE_API_ENDPOINT}/api/bookmark`;

  return defaultFetch(url, {
    method: 'POST',
    body: JSON.stringify({ bookId }),
  });
};

export const requestDeleteBookMark = (bookId: number) => {
  const url = `${Envs.VITE_API_ENDPOINT}/api/bookmark/${bookId}`;

  return defaultFetch(url, { method: 'DELETE' });
};

export interface Bookmark {
  bookId: number;
  title: string;
  coverImage: string;
  description: string;
  categoryName: string;
}
export type RequestGetBookMarksResponse = Bookmark[];
/** @return RequestGetBookMarksResponse */
export const requestGetBookMarks = () => {
  const url = `${Envs.VITE_API_ENDPOINT}/api/bookmark`;

  return defaultFetch(url, { method: 'GET' });
};

export type RequestGetBooksWithKeywordResponse = PageContent<Book>;
/**
 * 전체 도서 조회
 * @return RequestGetBooksResponse
 */
export const requestGetBooksWithKeyword = (keyword: string) => {
  const url = `${Envs.VITE_API_ENDPOINT}/api/books?keyword=${keyword}`;

  return defaultFetch(url, { method: 'GET' });
};

export interface BookByMood {
  bookId: number;
  isbn13: string;
  title: string;
  coverImage: string;
  reputation: number;
}
export type RequestGetBooksWithMoodResponse = BookByMood[];
/** @return RequestGetBooksWithMoodResponse */
export const requestGetBooksWithMood = (mood: string) => {
  const url = `${Envs.VITE_API_ENDPOINT}/api/books/recommend/emotion/top10?emotion=${mood}`;

  return defaultFetch(url, { method: 'GET' });
};
