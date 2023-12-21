import { LeftColumn, MiddleColumn } from './components';
import { SocketProvider } from './contexts';

export const HomePage = () => (
  <SocketProvider>
    <main className="flex h-screen bg-neutral-900">
      <LeftColumn />
      <MiddleColumn />
    </main>
  </SocketProvider>
);
