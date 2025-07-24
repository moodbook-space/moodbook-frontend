import { Book, requestGetBookDetail } from '@/apis/books';
import { useEffect, useState } from 'react';

interface UseBookProps {
  bookId?: number;
}
export const useBook = (props: UseBookProps) => {
  const { bookId } = props;

  // TODO remove dummy data
  const [book, setBook] = useState<Book>({
    bookId: 1,
    isbn13: '9791139724394',
    title:
      '[큰글자도서] 예민해서 힘들 땐 뇌과학 - 이유 없이 우울하고, 피곤하고, 아픈 HSP를 위한 5단계 치유 플랜',
    author: '린네아 파살러 (지은이), 김미정 (옮긴이)',
    publisher: '현대지성',
    pubDate: '2025-06-30',
    reputation: 3,
    coverImage:
      'https://image.aladin.co.kr/product/36754/0/coversum/k772030298_1.jpg',
    description:
      '‘매우 예민한 사람들’은 남들보다 예민한 신경계를 가진 탓에 외부 스트레스에 취약하다. 그러니 남들은 그러려니 하고 넘기는 일도 이들에게는 스트레스로 쌓이고, 신경계는 24시간 경계 상태를 유지하면서 온전히 쉬지 못한다. 이 책은 예민한 신경계 탓에 반복적으로 불안과 만성피로를 비롯한 여러 신체적 증상으로 힘들어하는 사람들을 위해 쓰였다.',
    categoryName: '국내도서>과학>뇌과학>뇌과학 일반',
    createdAt: '2025-07-17T17:24:03.478416',
    viewCount: 2,
  });

  useEffect(() => {
    const requestBookDetail = async () => {
      if (!bookId) {
        return;
      }

      const response = await requestGetBookDetail(bookId);

      if (response.ok) {
        const json = await response.json();
        setBook(json);
      } else {
        console.error('getBook Error');
      }
    };
    requestBookDetail();
  }, [bookId]);

  return { book };
};
