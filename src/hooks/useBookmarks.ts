import {
  Bookmark,
  requestGetBookMarks,
  RequestGetBookMarksResponse,
} from '@/apis/books';
import { useEffect, useState } from 'react';

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const bookmarkedIds = bookmarks.map((each) => each.bookId);

  const fetchBookmarkedIds = async () => {
    const response = await requestGetBookMarks();

    if (response.status === 200) {
      const json = (await response.json()) as RequestGetBookMarksResponse;
      setBookmarks(json);
    }
  };

  useEffect(() => {
    fetchBookmarkedIds();
  }, []);

  return { bookmarks, bookmarkedIds, fetchBookmarkedIds };
};
