import { Envs } from '@/utils/env';
import { defaultFetch } from '.';

export interface RequestAskChatResponse {
  mesaage: string;
  isbn13: [
    {
      bookId: number;
      isbn13: string;
      title: string;
      author: string;
      publisher: string;
      pubDate: string;
      reputation: number;
      coverImage: string;
      description: string;
      categoryName: string;
      /** @example '2025-07-27T04:34:54.884Z' */
      createdAt: string;
      viewCount: number;
    },
  ];
}

/** @return RequestAskChatResponse */
export const requestAskChat = (text: string) => {
  const url = `${Envs.VITE_API_ENDPOINT}/api/openai/ask`;

  return defaultFetch(url, {
    method: 'POST',
    body: JSON.stringify({ prompt: text }),
  });
};
