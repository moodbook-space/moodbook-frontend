import { useNavigate, useSearchParams } from 'react-router';
import { useBookSearch } from './hooks/useBookSearch';
import {
  CardContent,
  Cover,
  Description,
  Title,
  Card,
  Texts,
  Wrapper,
  Books,
} from './Search.styles';
import { Image } from 'antd';
import { Paths } from '@/routes/routes';

export const Search = () => {
  const navigate = useNavigate();
  const [searchParams, _] = useSearchParams();
  const keyword = searchParams.get('keyword') ?? '';

  const { books } = useBookSearch({ keyword });

  const onTitleClick = (bookId: number) => {
    navigate(`${Paths.BOOK}?id=${bookId}`);
  };

  return (
    <Wrapper>
      <h3>"{keyword}"로 검색한 결과입니다.</h3>
      <Books>
        {books.map((book) => (
          <Card key={book.bookId} size='small'>
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
                  alt={`image-alt-${book.title}`}
                />
              </Cover>
            </CardContent>
          </Card>
        ))}
      </Books>
    </Wrapper>
  );
};
