import { Typography } from 'antd';
import { useRecentBooks } from './hooks/useRecentBooks.ts';
import {
  Books,
  Container,
  RecentBookImg,
  TextStyles,
} from './RecentBooks.styles.ts';
import { useNavigate } from 'react-router';
import { Paths } from '@/routes/routes.ts';

export const RecentBooks = () => {
  const { recentBooks } = useRecentBooks();
  const navigate = useNavigate();

  const onBookImgClick = (bookId: number) => {
    navigate(`${Paths.BOOK}?id=${bookId}`);
  };

  if (recentBooks.length === 0) {
    return <></>;
  }
  return (
    <Container>
      <Typography.Text style={TextStyles}>최근 본 도서</Typography.Text>
      <Books>
        {recentBooks.map((book) => (
          <RecentBookImg
            key={book.bookId}
            src={book.coverImage}
            onClick={() => onBookImgClick(book.bookId)}
          />
        ))}
      </Books>
    </Container>
  );
};
