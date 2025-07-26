import { Layout } from 'antd';
import styles from './SideBar.module.css';
import moodBookLogo from '@/assets/moodbook_logo.png';
import { Link } from 'react-router';
import { RecentBooks } from './components/RecentBooks/RecentBooks';

export const SideBar = () => {
  return (
    <Layout.Sider breakpoint='md' width={200}>
      <h1 className={styles.title}>MoodBook</h1>
      <div className={styles.content}>
        <Link to='/' className={styles.logoAnchor}>
          <img className={styles.logo} src={moodBookLogo} alt='MoodBook Logo' />
        </Link>
        <RecentBooks />
      </div>
    </Layout.Sider>
  );
};
