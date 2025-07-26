import {
  RecentBook,
  RecentBooksResponse,
  requestGetRecentBooks,
} from '@/apis/books';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

export const useRecentBooks = () => {
  const location = useLocation();

  const [recentBooks, setRecentBooks] = useState<RecentBook[]>([]);

  useEffect(() => {
    const requestGetBooks = async () => {
      const response = await requestGetRecentBooks();

      if (response.ok) {
        const json = (await response.json()) as RecentBooksResponse;
        setRecentBooks(json.data.content);
      } else {
        console.error('getBooks Error');
      }
    };
    requestGetBooks();
    // * 페이지 이돔아다 recentBook을 다시 불러온다.
  }, [location]);

  return { recentBooks };
};
