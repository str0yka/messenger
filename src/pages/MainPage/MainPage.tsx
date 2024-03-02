import cn from 'classnames';
import { Outlet } from 'react-router-dom';

import { useExtendedTheme } from '~/utils/hooks';

import { SocketProvider, DialogProvider } from './contexts';

export const MainPage = () => {
  const { extendedTheme } = useExtendedTheme();

  return (
    <DialogProvider>
      <SocketProvider>
        <main
          className={cn('flex h-screen overflow-hidden', {
            "bg-neutral-900 bg-[url('/images/chat-bg-pattern-dark.png')]":
              extendedTheme.mode === 'dark',
            "bg-primary-300 bg-[url('/images/chat-bg-pattern-light.png')] bg-contain":
              extendedTheme.mode === 'light',
          })}
        >
          <Outlet />
        </main>
      </SocketProvider>
    </DialogProvider>
  );
};
