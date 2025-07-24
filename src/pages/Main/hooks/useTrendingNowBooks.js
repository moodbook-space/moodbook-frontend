import { useEffect, useState } from 'react';
import { requestGetTrendingBooks } from '../../../apis/books';

export const useTrendingNowBooks = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const requestGetBooks = async () => {
      const response = await requestGetTrendingBooks();

      if (response.ok) {
        const json = await response.json();
        setBooks(json.content);
      } else {
        console.error('getBooks Error');
      }
    };
    requestGetBooks();
  }, []);

  return { books };
};
