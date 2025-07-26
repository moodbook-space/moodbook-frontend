import { requestDeleteBookMark } from '@/apis/books';
import { useBookmarks } from '@/hooks/useBookmarks';
import { Button } from 'antd';
import styled from 'styled-components';

export const BookmarkSection = () => {
  const { bookmarks, fetchBookmarkedIds } = useBookmarks();

  const onDeleteBookmarkClick = async (bookId: number) => {
    await requestDeleteBookMark(Number(bookId));
    await fetchBookmarkedIds();
  };

  return (
    <Container>
      <Title>북마크</Title>
      <Books>
        {bookmarks.map((book) => (
          <Book key={book.bookId}>
            <CoverImg src={book.coverImage} />
            <Button
              size='small'
              type='default'
              onClick={() => onDeleteBookmarkClick(book.bookId)}
            >
              북마크에서 삭제
            </Button>
          </Book>
        ))}
      </Books>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 12px;
`;

export const Title = styled.span`
  font-size: 1.2em;
  font-weight: 700;
`;

const Books = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 12px;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

const Book = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 8px;
`;

const CoverImg = styled.img`
  width: 150px;
`;
