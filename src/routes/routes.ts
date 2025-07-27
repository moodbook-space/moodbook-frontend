// @ts-nocheck
import { createBrowserRouter } from 'react-router';
import { Main } from '@/pages/Main/Main';
import { Books } from '@/pages/Books/Books';
import { MyPage } from '@/pages/MyPage/MyPage';
import { Admin } from '@/pages/Admin/Admin';
import { SignUp } from '@/pages/SignUp/SignUp';
import { MainLayout } from '@/layout/MainLayout/MainLayout';
import { Search } from '@/pages/Search/Search';
import { AiSearch } from '@/pages/AiSearch/AiSearch';
import { SelectMood } from '@/pages/SelectMood/SelectMood';
import { SignIn } from '@/pages/SignIn/SignIn';
import { BookDetail } from '@/pages/BookDetail/BookDetail';
import { MeetingCreatePage } from '@/pages/Meeting/MeetingCreatePage';
import { MeetingDetailPage } from '@/pages/Meeting/MeetingDetailPage';
import { VerifyEmail } from '@/pages/VerifyEmail/VerifyEmail';

export const Paths = {
  MAIN: '/',
  BOOKS: '/books',
  BOOK: '/book',
  ME: '/me',
  ADMIN: '/admin',
  SEARCH: '/search',
  AI_SEARCH: '/ai-search',
  SELECT_MOOD: '/select-mood',
  MEETING_CREATE: '/meeting/create',
  MEETING: '/meeting',
  MYPAGE: '/mypage',

  SIGN_UP: '/sign-up',
  SIGN_IN: '/sign-in',
  VERIFY_EMAIL: '/auth/verify-email',
};

export const router = createBrowserRouter([
  {
    path: '/',
    children: [
      // * 아래 항목들의 `Component`에 해당되는 부분이 MainLayout에 있는 <Outlet />에 들어갑니다.
      {
        Component: MainLayout,
        children: [
          { index: true, Component: Main },
          { path: Paths.BOOKS, Component: Books },
          { path: Paths.BOOK, Component: BookDetail },
          { path: Paths.ME, Component: MyPage },
          { path: Paths.ADMIN, Component: Admin },
          { path: Paths.SEARCH, Component: Search },
          { path: Paths.AI_SEARCH, Component: AiSearch },
          { path: Paths.SELECT_MOOD, Component: SelectMood },
          { path: Paths.MEETING_CREATE, Component: MeetingCreatePage },
          { path: Paths.MEETING, Component: MeetingDetailPage },
          { path: Paths.MYPAGE, Component: MyPage}
        ],
      },
      { path: Paths.SIGN_UP, Component: SignUp },
      { path: Paths.SIGN_IN, Component: SignIn },
      { path: Paths.VERIFY_EMAIL, Component: VerifyEmail },
    ],
  },
]);
