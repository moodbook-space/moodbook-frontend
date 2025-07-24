import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { SignIn } from './pages/SignIn/SignIn';

interface RootErrorBoundaryProps {
  children: ReactNode;
}
export const RootErrorBoundary = (props: RootErrorBoundaryProps) => {
  const { children } = props;

  return (
    <ErrorBoundary
      fallbackRender={({ error }) =>
        error?.status === 401 ? <SignIn /> : <>{props.children}</>
      }
    >
      {children}
    </ErrorBoundary>
  );
};
