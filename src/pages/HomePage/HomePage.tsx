import cn from 'classnames';
import { Outlet } from 'react-router-dom';

import { useExtendedTheme } from '~/utils/hooks';

import { SocketProvider, MessagesProvider, DialogProvider } from './contexts';

export const HomePage = () => {
  const { extendedTheme } = useExtendedTheme();

  return (
    <MessagesProvider>
      <DialogProvider>
        <SocketProvider>
          <main
            className={cn('flex h-screen', {
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
    </MessagesProvider>
  );
};
