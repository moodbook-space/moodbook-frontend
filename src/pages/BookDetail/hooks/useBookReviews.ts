import {
  BookReview,
  requestGetBookReviews,
  RequestGetBookReviewsResponse,
} from '@/apis/reviews';
import { useEffect, useState } from 'react';

interface UseBookReviewsProps {
  bookId?: number;
}
export const useBookReviews = (props: UseBookReviewsProps) => {
  const { bookId } = props;

  // TODO dummy 데이터 제거
  const [reviews, setReviews] = useState<BookReview[]>([]);

  useEffect(() => {
    const requestBookReviews = async () => {
      if (!bookId) {
        return;
      }

      const response = await requestGetBookReviews(bookId);

      if (response.ok) {
        const json = (await response.json()) as RequestGetBookReviewsResponse;
        setReviews(json.content);
      } else {
        console.error('getBook Error');
      }
    };
    requestBookReviews();
  }, [bookId]);

  return { reviews };
};
