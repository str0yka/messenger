import * as Avatar from '@radix-ui/react-avatar';
import cn from 'classnames';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { io } from 'socket.io-client';
import { useShallow } from 'zustand/react/shallow';

import { IconButton, Input, DropdownMenu } from '~/components/common';
import {
  IconCross,
  IconHamburgerMenu,
  IconMagnifyingGlass,
  IconPaperClip,
  IconSmilingFace,
} from '~/components/common/icons';
import { useIntl } from '~/features/i18n';
import { useTheme } from '~/features/theme';
import { PostLogoutFailureResponse, PostLogoutSuccessResponse, postLogout } from '~/utils/api';
import { EXTENDED_THEMES, LANGUAGES } from '~/utils/constants';
import { useUserStore } from '~/utils/store';

// $FIXME

export const HomePage = () => {
  const { user, resetUser } = useUserStore(
    useShallow((state) => ({ user: state.user, resetUser: state.resetUser })),
  );
  const { theme, setTheme } = useTheme();
  const intl = useIntl();

  const chatRef = useRef<HTMLDivElement>(null);

  const [dialogs, setDialogs] = useState<Parameters<ServerToClientEvents['dialogs:put']>['0']>([]);
  const [dialog, setDialog] = useState<Parameters<ServerToClientEvents['dialog:put']>['0']>(null);

  const socketRef = useRef<IO.Socket>(
    io('http://localhost:5000', {
      query: user!,
    }),
  );

  useEffect(() => {
    socketRef.current.on('dialogs:put', (ds) => {
      console.log('dialogs:put', ds);
      setDialogs(ds);
    });

    socketRef.current.on('dialogs:updateRequired', () => {
      socketRef.current.emit('dialogs:get');
    });

    socketRef.current.on('messages:add', (message) => {
      console.log('messages:add', message);
      setDialog((prevDialog) => {
        if (!prevDialog) return prevDialog;

        return { ...prevDialog, messages: [...prevDialog.messages, message] };
      });
    });

    socketRef.current.on('dialog:put', (d) => {
      console.log('dialog:put', d);
      setDialog(d);
    });

    return () => {
      socketRef.current.close();
    };
  }, []);

  useLayoutEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, []);

  const { mutate: logoutMutation } = useMutation<
    PostLogoutSuccessResponse,
    PostLogoutFailureResponse
  >({
    mutationFn: postLogout,
    onSuccess: () => {
      resetUser();
    },
  });

  const { handleSubmit, register, reset } = useForm({
    defaultValues: {
      message: '',
    },
  });

  return (
    <main className="flex h-screen bg-neutral-900">
      <aside
        className={cn(
          'flex w-full flex-col border-r border-r-neutral-700 bg-neutral-800',
          'lg:min-w-[400px] lg:max-w-[400px]',
          '2xl:min-w-[450px] 2xl:max-w-[450px]',
        )}
      >
        <div className="flex justify-between gap-2 border-b border-b-neutral-700 p-4">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <IconButton aria-label="Customise options">
                <IconHamburgerMenu />
              </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
              className="w-[250px]"
              align="start"
            >
              <DropdownMenu.Label>{intl.t('page.home.settings')}</DropdownMenu.Label>
              <DropdownMenu.Sub>
                <DropdownMenu.SubTrigger>Language</DropdownMenu.SubTrigger>
                <DropdownMenu.SubContent>
                  <DropdownMenu.RadioGroup
                    value={intl.locale}
                    onValueChange={(value) => intl.setLocale(value as Locale)}
                  >
                    {LANGUAGES.map((language) => (
                      <DropdownMenu.RadioItem
                        key={language.locale}
                        value={language.locale}
                      >
                        {language.name}
                      </DropdownMenu.RadioItem>
                    ))}
                  </DropdownMenu.RadioGroup>
                </DropdownMenu.SubContent>
              </DropdownMenu.Sub>
              <DropdownMenu.Sub>
                <DropdownMenu.SubTrigger>{intl.t('page.home.theme')}</DropdownMenu.SubTrigger>
                <DropdownMenu.SubContent>
                  <DropdownMenu.RadioGroup
                    value={theme}
                    onValueChange={(value) => setTheme(value as Theme)}
                  >
                    {EXTENDED_THEMES.map((extendedTheme) => (
                      <DropdownMenu.RadioItem
                        key={extendedTheme.theme}
                        className="flex gap-1"
                        value={extendedTheme.theme}
                      >
                        <div className={`h-4 w-4 rounded-full ${extendedTheme.tailwind.bg}`} />
                        <div
                          className={`h-4 w-4 rounded-full ${
                            extendedTheme.mode === 'light' ? 'bg-white' : 'bg-black'
                          }`}
                        />
                      </DropdownMenu.RadioItem>
                    ))}
                  </DropdownMenu.RadioGroup>
                </DropdownMenu.SubContent>
              </DropdownMenu.Sub>
              <DropdownMenu.Separator />
              <DropdownMenu.Item onClick={() => logoutMutation()}>
                {intl.t('page.home.logOut')}
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={() => socketRef.current.emit('dialogs:create', 1, 'warface212@gmail.com')}
              >
                create dialog
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
          <div className="grow">
            <Input startAdornment={<IconMagnifyingGlass />} />
          </div>
        </div>
        <ul className="flex grow flex-col overflow-auto p-2">
          {dialogs.map((d, index) => (
            <li key={index}>
              <div
                className={cn(
                  'flex cursor-pointer select-none gap-2 rounded-lg p-2',
                  'hover:bg-neutral-700/50',
                  'active:bg-neutral-600/50',
                )}
                role="tab"
                tabIndex={0}
                onClick={() => socketRef.current.emit('dialog:join', d.id)}
                onKeyDown={(event) => {
                  if (event.code === 'Enter') socketRef.current.emit('dialog:join', d.id);
                  if (event.code === 'Escape') socketRef.current.emit('dialog:leave', d.id);
                }}
              >
                <Avatar.Root className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-primary-300 to-primary-500">
                  <Avatar.Fallback className="text-xl font-semibold text-white">
                    {d.partner.email[0]}
                  </Avatar.Fallback>
                </Avatar.Root>
                <div className="flex min-w-[0] grow flex-col">
                  <div className="flex items-center gap-2">
                    <h2 className="grow truncate font-semibold text-neutral-50">
                      {d.partner.email}
                    </h2>
                    <p className="text-xs text-neutral-400">
                      {d.lastMessage &&
                        `${new Date(d.lastMessage.createdAt).getHours()}:${new Date(
                          d.lastMessage.createdAt,
                        ).getMinutes()}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="grow truncate text-neutral-400">{d.lastMessage?.message}</p>
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-400 text-xs font-medium text-white">
                      2
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </aside>
      <div
        className={cn(
          'flex grow flex-col overflow-hidden',
          dialog && 'absolute inset-0',
          theme.split('-')[1] === 'dark' &&
            "bg-neutral-900 bg-[url('/images/chat-bg-pattern-dark.png')]",
          theme.split('-')[1] === 'light' &&
            "bg-primary-300 bg-[url('/images/chat-bg-pattern-light.png')] bg-contain",
          'lg:static',
        )}
      >
        {dialog && (
          <>
            <div className="flex cursor-pointer items-center gap-4 border-b border-b-neutral-700 bg-neutral-800 px-4 py-2">
              <div>
                <IconButton onClick={() => socketRef.current.emit('dialog:leave', dialog.id)}>
                  <IconCross />
                </IconButton>
              </div>
              <Avatar.Root className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-primary-300 to-primary-500">
                <Avatar.Fallback className="text-md  font-semibold text-white">MA</Avatar.Fallback>
              </Avatar.Root>
              <h2 className="truncate font-semibold text-neutral-50">{dialog.partner.email}</h2>
            </div>
            <div className="flex w-full grow flex-col overflow-hidden">
              <div
                ref={chatRef}
                className="grow overflow-auto px-2"
              >
                <div
                  className={cn(
                    'mx-auto my-0 flex flex-col gap-2 break-words',
                    'md:w-8/12',
                    'xl:w-6/12',
                  )}
                >
                  {dialog.messages.map((message) => {
                    const isUserMessage = message.userId === user?.id;

                    return (
                      <div
                        key={message.id}
                        className={cn('w-fit max-w-[66%] rounded-xl p-2', {
                          'bg-neutral-800 text-neutral-50': !isUserMessage,
                          'self-end bg-primary-500 text-white': isUserMessage,
                        })}
                      >
                        {message.message}
                      </div>
                    );
                  })}
                </div>
              </div>
              <form
                className={cn('mx-auto w-full px-2 pb-4 pt-2', 'md:w-8/12', 'xl:w-6/12')}
                onSubmit={handleSubmit((values) => {
                  socketRef.current.emit('messages:add', dialog.chatId, values.message);
                  reset();
                })}
              >
                <Input
                  startAdornment={<IconSmilingFace />}
                  endAdornment={<IconPaperClip />}
                  {...register('message')}
                />
              </form>
            </div>
          </>
        )}
      </div>
    </main>
  );
};
