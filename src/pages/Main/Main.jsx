import { BookList } from './components/BookList/BookList';
import styles from './Main.module.css';
import { useTrendingNowBooks } from './hooks/useTrendingNowBooks';
import { useRecommendationBooks } from './hooks/useRecommendationBooks';
import { useSelectedMoodsBooks } from './hooks/useSelectedMoodsBooks';
import { Divider } from 'antd';
import { Fragment } from 'react';

export const Main = () => {
  const { books: trendingNowBooks } = useTrendingNowBooks();
  const { books: recommendationBooks } = useRecommendationBooks();
  const { booksList, moods } = useSelectedMoodsBooks();

  return (
    <section className={styles.container}>
      <BookList title='Trending Now' books={trendingNowBooks} />
      <BookList title='Recommendation' books={recommendationBooks} />
      {moods.length > 0 && (
        <>
          <Divider />
          <div className={styles.emotionBooks}>
            {booksList.map((books, index) => (
              <Fragment key={moods[index]}>
                <BookList
                  title={`감정별 추천도서: ${moods[index]}`}
                  books={books}
                />
              </Fragment>
            ))}
          </div>
        </>
      )}
    </section>
  );
};
