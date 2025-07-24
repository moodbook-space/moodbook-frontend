import { Envs } from '@/utils/env';
import { defaultFetch } from '.';

export interface BookReport {
  id: number;
  title: string;
  authorName: string;
  /** @example '2025-07-22T11:19:36.876608' */
  createdAt: string;
  viewCount: number;
  likeCount: number;
  /** @example ['inspring'] */
  tags: string[];
  likedByMe: boolean;
}

export interface RequestGetBookReportsResponse {
  content: BookReport[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      unsorted: boolean;
      sorted: boolean;
    };
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  numberOfElements: number;
  empty: false;
}

/**
 * @return RequestGetBookReportsResponse
 */
export const requestGetBookReports = (id: number) => {
  const url = `${Envs.VITE_API_ENDPOINT}/api/reports/books/${id}/reports`;

  return defaultFetch(url, { method: 'GET' });
};
