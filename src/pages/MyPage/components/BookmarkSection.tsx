import { Button, Typography, Image } from 'antd';
import Slider, { CustomArrowProps, Settings } from 'react-slick';
import styled from 'styled-components';
import { useNavigate } from 'react-router';
import { requestDeleteBookMark } from '@/apis/books';
import { useBookmarks } from '@/hooks/useBookmarks';
import { Paths } from '@/routes/routes';

// 커스텀 화살표
const Arrow = (props: CustomArrowProps) => <CustomArrow {...props} />;

export const BookmarkSection = () => {
  const { bookmarks, fetchBookmarkedIds } = useBookmarks();
  const navigate = useNavigate();

  const onDeleteBookmarkClick = async (bookId: number) => {
    await requestDeleteBookMark(bookId);
    await fetchBookmarkedIds();
  };

  const onTitleClick = (bookId: number) => {
    navigate(`${Paths.BOOK}?id=${bookId}`);
  };

  const sliderSettings: Settings = {
    infinite: true,
    speed: 500,
    autoplay: false,
    swipeToSlide: true,
    variableWidth: true,
    arrows: true,
    prevArrow: <Arrow />,
    nextArrow: <Arrow />,
  };

  return (
    <Wrapper>
      <Typography.Title level={4}>북마크</Typography.Title>
      {bookmarks.length === 0 ? (
        <EmptyText>북마크된 도서가 없습니다.</EmptyText>
      ) : (
        <Slider {...sliderSettings}>
          {bookmarks.map((book) => (
            <CardWrapper key={book.bookId}>
              <CardContent>
                <Texts>
                  <Title
                    title={book.title}
                    onClick={() => onTitleClick(book.bookId)}
                  >
                    {book.title}
                  </Title>
                  <Description title={book.description}>
                    {book.description}
                  </Description>
                </Texts>
                <Cover>
                  <Image
                    width={100}
                    src={book.coverImage}
                    alt={`cover-${book.title}`}
                  />
                </Cover>
              </CardContent>
              <Button
                size="small"
                type="default"
                onClick={() => onDeleteBookmarkClick(book.bookId)}
              >
                북마크에서 삭제
              </Button>
            </CardWrapper>
          ))}
        </Slider>
      )}
    </Wrapper>
  );
};

// ==================== 스타일 ====================

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  margin-top: 16px;
`;

const EmptyText = styled.span`
  font-size: 14px;
  color: #999;
`;

const CardWrapper = styled.div`
  width: 240px !important;
  display: flex !important;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin: 0 8px;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 8px;
`;

const Cover = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 8px;
`;

const Texts = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 4px;
  text-align: center;
`;

const Title = styled.span`
  font-weight: bold;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const Description = styled.span`
  font-size: 12px;
  color: #555;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
`;

const CustomArrow = styled.div`
  &::before {
    color: black;
    font-size: 24px;
  }
`;
