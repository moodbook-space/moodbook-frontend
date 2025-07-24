import styles from './Header.module.css';
import { Button, Input } from 'antd';
import { useNavigate } from 'react-router';
import { Paths } from '../../../../routes/routes';
import { ProfileIcon } from './components/ProfileIcon/ProfileIcon';
import { AlarmIcon } from './components/AlarmIcon/AlarmIcon';

export const Header = () => {
  const navigate = useNavigate();

  const onSearch = (value: string) => {
    if (value.trim().length === 0) {
      return;
    }

    navigate(`${Paths.SEARCH}?keyword=${value}`);
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Button type='link' href={Paths.AI_SEARCH}>
          AI 검색
        </Button>
        <Button type='link' href={Paths.SELECT_MOOD}>
          기분 선택
        </Button>
      </nav>
      <div className={styles.flex} />
      <div className={styles.inputWrapper}>
        <Input.Search
          type=''
          placeholder='검색어를 입력하세요.'
          onSearch={onSearch}
        />
      </div>
      <AlarmIcon />
      <ProfileIcon />
    </header>
  );
};
