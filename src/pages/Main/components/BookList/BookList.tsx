import { Image, Typography } from 'antd';
import {
  CardContent,
  Cover,
  Description,
  Title,
  Card,
  CustomArrow,
  Wrapper,
  Texts,
} from './BookList.styles';
import Slider, { CustomArrowProps, Settings } from 'react-slick';
import { Book } from '@/apis/books';
import { useNavigate } from 'react-router';
import { Paths } from '@/routes/routes';

const Arrow = (props: CustomArrowProps) => {
  return <CustomArrow {...props} />;
};

interface BookListProps {
  books: Book[];
  title: string;
}
export const BookList = (props: BookListProps) => {
  const { title, books } = props;
  const navigate = useNavigate();

  const sliderSettings: Settings = {
    infinite: true,
    speed: 500,
    autoplay: true,
    swipeToSlide: true,
    variableWidth: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 600, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
    prevArrow: <Arrow />,
    nextArrow: <Arrow />,
  };

  const onTitleClick = (bookId: number) => {
    navigate(`${Paths.BOOK}?id=${bookId}`);
  };

  return (
    <Wrapper>
      <Typography.Title level={4}>{title}</Typography.Title>
      <Slider {...sliderSettings}>
        {books.map((book) => (
          <div key={book.bookId}>
            <Card size='small'>
              <CardContent>
                {/* 제목, 설명에 커서 올리면 툴팁으로 전문이 뜸 */}
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
          </div>
        ))}
      </Slider>
    </Wrapper>
  );
};
