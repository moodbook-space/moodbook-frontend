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
