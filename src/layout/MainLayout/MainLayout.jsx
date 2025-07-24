import { Outlet } from 'react-router';
import { SideBar } from './components/SideBar/SideBar';
// * module css 사용, 컴포넌트 단위로 className이 유니크하게 결정됩니다. 이름이 섞일 우려가 없음
import styles from './MainLayout.module.css';
import { Header } from './components/Header/Header';

export const MainLayout = () => {
  return (
    <main className={styles.container}>
      <SideBar />
      <section className={styles.content}>
        <Header />
        <Outlet />
      </section>
    </main>
  );
};
