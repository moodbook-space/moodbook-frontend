import { Envs } from '@/utils/env';
import { defaultFetch } from '.';
import { PageContent } from './types';

export interface BookReview {
  reviewId: number;
  reviewerName: string;
  content: string;
  starRating: number;
  /** @example "2025-07-23T16:00:57.185Z" */
  createdAt: string;
}

export type RequestGetBookReviewsResponse = PageContent<BookReview>;
/** @return RequestGetBookReviewsResponse */
export const requestGetBookReviews = (bookId: number) => {
  const url = `${Envs.VITE_API_ENDPOINT}/api/books/${bookId}/reviews`;

  return defaultFetch(url, { method: 'GET' });
};
