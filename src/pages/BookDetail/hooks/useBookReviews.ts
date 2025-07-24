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
  const [reviews, setReviews] = useState<BookReview[]>([
    {
      reviewId: 0,
      reviewerName: '이름',
      content: '정말 유익한 책입니다.',
      starRating: 3,
      createdAt: '2025-07-23T16:00:57.185Z',
    },
  ]);

  useEffect(() => {
    const requestBookReviews = async () => {
      if (!bookId) {
        return;
      }

      const response = await requestGetBookReviews(bookId);

      if (response.ok) {
        const json = (await response.json()) as RequestGetBookReviewsResponse;
        // TODO dummy 데이터 제거하면 주석 해제
        // setReviews(json.content);
      } else {
        console.error('getBook Error');
      }
    };
    requestBookReviews();
  }, [bookId]);

  return { reviews };
};
