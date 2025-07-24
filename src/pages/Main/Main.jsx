import { BookList } from './components/BookList/BookList';
import styles from './Main.module.css';
import { useTrendingNowBooks } from './hooks/useTrendingNowBooks';
import { useRecommendationBooks } from './hooks/useRecommendationBooks';

export const Main = () => {
  const { books: trendingNowBooks } = useTrendingNowBooks();
  const { books: recommendationBooks } = useRecommendationBooks();

  return (
    <section className={styles.container}>
      <BookList title='Trending Now' books={trendingNowBooks} />
      <BookList title='Recommendation' books={recommendationBooks} />
    </section>
  );
};
