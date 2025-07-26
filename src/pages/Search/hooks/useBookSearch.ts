import { requestGetBooksWithKeyword } from '@/apis/books';
import { useEffect, useState } from 'react';

interface UseBookSearchProps {
  keyword: string;
}
export const useBookSearch = (props: UseBookSearchProps) => {
  const { keyword } = props;

  const [books, setBooks] = useState([]);

  useEffect(() => {
    const getSearchedBooks = async () => {
      const response = await requestGetBooksWithKeyword(keyword);
      const json = await response.json();

      setBooks(json);
    };
    getSearchedBooks();
  }, [keyword]);

  return { books };
};
