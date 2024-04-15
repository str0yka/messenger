import cn from 'classnames';
import { Outlet } from 'react-router-dom';

import { SocketProvider, DialogProvider } from './contexts';
import { useMainPage } from './hooks';

export const MainPage = () => {
  const { state } = useMainPage();

  return (
    <SocketProvider>
      <DialogProvider>
        <main
          className={cn('flex h-screen overflow-hidden', {
            "bg-neutral-900 bg-[url('/images/chat-bg-pattern-dark.png')]":
              state.extendedTheme.mode === 'dark',
            "bg-primary-300 bg-[url('/images/chat-bg-pattern-light.png')] bg-contain":
              state.extendedTheme.mode === 'light',
          })}
        >
          <Outlet />
        </main>
      </DialogProvider>
    </SocketProvider>
  );
};
