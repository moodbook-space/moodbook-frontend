import { useSearchParams } from 'react-router';

export const Search = () => {
  const [searchParams, _] = useSearchParams();
  const keyword = searchParams.get('keyword') ?? '';

  return <section>검색한 키워드: {keyword}</section>;
};
