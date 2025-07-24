import { useSearchParams } from 'react-router';
import { useBook } from './hooks/useBook';
import {
  BookInfo,
  Container,
  Content,
  DetailList,
  ReviewerName,
  Texts,
  Title,
} from './BookDetail.styles';
import { Button, Card, Image, Space } from 'antd';
import { ScoreStars } from './components/ScoreStars';
import { useBookReviews } from './hooks/useBookReviews';

export const BookDetail = () => {
  const [searchParams, _] = useSearchParams();
  const bookId = searchParams.get('id') ?? '';

  const { book } = useBook({ bookId: Number(bookId) });
  const { reviews } = useBookReviews({ bookId: Number(bookId) });

  if (!bookId) {
    return <p>잘못된 경로입니다.</p>;
  }
  if (!book) {
    return <p>{`도서 정보가 없습니다. id: ${bookId}`}</p>;
  }

  const onGoReportsClick = () => {
    alert('TODO: report 페이지로 이동');
    // navigate(report ?id={id})
  };

  const onBookmarkClick = () => {
    alert('TODO: add to bookmark (API 모르는 상태)');
  };

  return (
    <Container>
      <BookInfo>
        <Image src={book.coverImage} alt='book cover image' width={150} />
        <Texts>
          <Title>{book.title}</Title>
          <DetailList>
            <li>{`저자 :    ${book.author}`}</li>
            <li>{`장르 :    ${book.categoryName}`}</li>
            <li>{`출판일:  ${book.pubDate}`}</li>
          </DetailList>
          <ScoreStars reputation={book.reputation} />
          <Space>
            <Button type='primary' onClick={onGoReportsClick}>
              다른 유저들의 독후감 보기
            </Button>
            <Button type='primary' onClick={onBookmarkClick}>
              북마크에 추가
            </Button>
          </Space>
        </Texts>
      </BookInfo>
      <Content>
        <Title>책 소개</Title>
        <p>{book.description}</p>
        <Title>사용자 리뷰</Title>
        {reviews.map((review) => (
          <Card key={review.reviewId}>
            <ReviewerName>{review.reviewerName}</ReviewerName>
            <ScoreStars reputation={review.starRating} />
            <p>{review.content}</p>
          </Card>
        ))}
      </Content>
    </Container>
  );
};
