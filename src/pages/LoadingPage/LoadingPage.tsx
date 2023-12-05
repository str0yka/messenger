import { CircularProgress } from '~/components/common';

export const LoadingPage = () => (
  <main className="flex h-screen items-center justify-center bg-neutral-900">
    <CircularProgress />
  </main>
);
