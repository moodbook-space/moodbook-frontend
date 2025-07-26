import { useSearchParams } from 'react-router';
import { useBookSearch } from './hooks/useBookSearch';

export const Search = () => {
  const [searchParams, _] = useSearchParams();
  const initKeyword = searchParams.get('keyword') ?? '';

  const { books } = useBookSearch({ keyword: initKeyword });

  return (
    <section>
      <div>검색한 키워드: {initKeyword}</div>
      <div>검색된 도서 수: {books.length}</div>
    </section>
  );
};
