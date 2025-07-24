import { useEffect, useState } from 'react';
import { requestGetRecommendationBooks } from '../../../apis/books';

export const useRecommendationBooks = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const requestGetBooks = async () => {
      const response = await requestGetRecommendationBooks();

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
