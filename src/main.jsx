// * Antd v5가 React 16~18만 Full로 지원함, 호환성을 위한 패키지 추가
import '@ant-design/v5-patch-for-react-19';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { router } from './routes/routes';
import { RouterProvider } from 'react-router';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
