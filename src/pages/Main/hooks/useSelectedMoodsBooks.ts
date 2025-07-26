import { BookByMood, requestGetBooksWithMood } from '@/apis/books';
import { MoodKeys } from '@/pages/SelectMood/constants';
import { useUserStore } from '@/stores/user';
import { useEffect, useState } from 'react';

export const useSelectedMoodsBooks = () => {
  const [booksList, setBooksList] = useState<BookByMood[][]>([]);

  const { moods } = useUserStore();

  useEffect(() => {
    const getBooksByMood = async () => {
      const fetchedBooks: BookByMood[][] = [];

      for (const mood of moods) {
        const response = await requestGetBooksWithMood(MoodKeys[mood]);

        if (response.ok) {
          const json = await response.json();
          fetchedBooks.push(json);
        }
      }
      setBooksList(fetchedBooks);
    };
    setBooksList([]);
    getBooksByMood();
  }, []);

  return { moods, booksList };
};
