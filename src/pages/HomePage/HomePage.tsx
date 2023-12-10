import * as Avatar from '@radix-ui/react-avatar';
import cn from 'classnames';
import { useLayoutEffect, useRef, useState } from 'react';
import { useMutation } from 'react-query';

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

export const HomePage = () => {
  const resetUser = useUserStore((state) => state.resetUser);
  const { theme, setTheme } = useTheme();
  const intl = useIntl();

  const [isOpen, setIsOpen] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

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

  return (
    <main className="flex h-screen bg-neutral-900">
      <aside
        className={cn(
          'flex w-full flex-col border-r border-r-neutral-700 bg-neutral-800',
          'lg:w-[400px]',
          '2xl:w-[450px]',
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
            </DropdownMenu.Content>
          </DropdownMenu.Root>
          <div className="grow">
            <Input startAdornment={<IconMagnifyingGlass />} />
          </div>
        </div>
        <ul className="flex grow flex-col overflow-auto p-2">
          {Array(20)
            .fill(null)
            .map((_, index) => (
              <li
                key={index}
                // tabIndex={0}
                // onClick={() => setIsOpen(true)}
              >
                <div
                  className={cn(
                    'flex cursor-pointer select-none gap-2 rounded-lg p-2',
                    'hover:bg-neutral-700/50',
                    'active:bg-neutral-600/50',
                  )}
                >
                  <Avatar.Root className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-primary-300 to-primary-500">
                    <Avatar.Fallback className="text-xl font-semibold text-white">
                      MA
                    </Avatar.Fallback>
                  </Avatar.Root>
                  <div className="flex min-w-[0] grow flex-col">
                    <div className="flex items-center gap-2">
                      <h2 className="grow truncate font-semibold text-neutral-50">
                        some 124124124412124124124124124124channel
                      </h2>
                      <p className="text-xs text-neutral-400">19:32</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="grow truncate text-neutral-400">
                        afjawfaafkaafjawfaafkaafjawfaaafjawfaafkaafjawfaafkaafjawfaafkaafjawfaafkaafjawfaafkafkaafjawfaafkaafjawfaafkaafjawfaafkaafjawfaafkaafjawfaafkaafjawfaafka
                      </p>
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
          isOpen && 'absolute inset-0',
          theme.split('-')[1] === 'dark' &&
            "bg-neutral-900 bg-[url('/images/chat-bg-pattern-dark.png')]",
          theme.split('-')[1] === 'light' &&
            "bg-primary-300 bg-[url('/images/chat-bg-pattern-light.png')] bg-contain",
          'lg:static',
        )}
      >
        {isOpen && (
          <>
            <div className="flex cursor-pointer items-center gap-4 border-b border-b-neutral-700 bg-neutral-800 px-4 py-2">
              <div>
                <IconButton onClick={() => setIsOpen(false)}>
                  <IconCross />
                </IconButton>
              </div>
              <Avatar.Root className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-primary-300 to-primary-500">
                <Avatar.Fallback className="text-md  font-semibold text-white">MA</Avatar.Fallback>
              </Avatar.Root>
              <h2 className="truncate font-semibold text-neutral-50">
                Saved MessagesSaved MessagesSaved MessagesSaved MessagesSaved MessagesSaved
                MessagesSavedSaved MessagesSaved MessagesSaved MessagesSaved MessagesSaved
                MessagesSaved MessagesSaved Messages MessagesSaved MessagesSaved Messages
              </h2>
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
                  <div className="w-fit max-w-[66%] rounded-xl bg-neutral-800 p-2 text-neutral-50">
                    привет.
                  </div>
                  <div className="w-fit max-w-[66%] rounded-xl bg-neutral-800 p-2 text-neutral-50">
                    Сегодня еду к Ване дипонсу смотреть фильм, который у него на ауке выиграл. А
                    завтра у меня фильм.
                    <br />
                    <br />
                    «Куклы» вроде, то ли «Кукла». Хз короче. Я вас уведомил, вот.
                  </div>
                  <div className="w-fit max-w-[66%] self-end rounded-xl bg-primary-500 p-2 text-white">
                    Сегодня еду к Ване дипонсу смотреть фильм, который у него на ауке выиграл. А
                    завтра у меня фильм.
                    <br />
                    <br />
                    «Куклы» вроде, то ли «Кукла». Хз короче. Я вас уведомил, вот.
                  </div>
                  <div className="w-fit max-w-[66%] rounded-xl bg-neutral-800 p-2 text-neutral-50">
                    Сегодня еду к Ване дипонсу смотреть фильм, который у него на ауке выиграл. А
                    завтра у меня фильм.
                    <br />
                    <br />
                    «Куклы» вроде, то ли «Кукла». Хз короче. Я вас уведомил, вот.
                  </div>
                  <div className="w-fit max-w-[66%] rounded-xl bg-neutral-800 p-2 text-neutral-50">
                    Сегодня еду к Ване дипонсу смотреть фильм, который у него на ауке выиграл. А
                    завтра у меня фильм.
                    <br />
                    <br />
                    «Куклы» вроде, то ли «Кукла». Хз короче. Я вас уведомил, вот.
                  </div>
                  <div className="w-fit max-w-[66%] self-end rounded-xl bg-primary-500 p-2 text-white">
                    Сегодня еду к Ване дипонсу смотреть фильм, который у него на ауке выиграл. А
                    завтра у меня фильм.
                    <br />
                    <br />
                    «Куклы» вроде, то ли «Кукла». Хз короче. Я вас уведомил, вот.
                  </div>
                  <div className="w-fit max-w-[66%] rounded-xl bg-neutral-800 p-2 text-neutral-50">
                    Добрый день, меня зовут Никита, мне 20 лет, являюсь Frontend разработчиком, буду
                    рад если рассмотрите меня в качестве кандидата на должность :) Имею опыт
                    построения SPA, SSR web-приложений на языке TypeScript с использованием
                    библиотеки React и фреймворка Next. Постоянно росту и совершенствуюсь) Моё
                    резюме тут:
                    <br />
                    <br />
                    https://drive.google.com/file/d/1t54MBwMyqvEcsr3Ks19pZZCWo9pXJHHt/view
                  </div>
                  <div className="w-fit max-w-[66%] rounded-xl bg-neutral-800 p-2 text-neutral-50">
                    Сегодня еду к Ване дипонсу смотреть фильм, который у него на ауке выиграл. А
                    завтра у меня фильм.
                    <br />
                    <br />
                    «Куклы» вроде, то ли «Кукла». Хз короче. Я вас уведомил, вот.
                  </div>
                  <div className="w-fit max-w-[66%] self-end rounded-xl bg-primary-500 p-2 text-white">
                    Сегодня еду к Ване дипонсу смотреть фильм, который у него на ауке выиграл. А
                    завтра у меня фильм.
                    <br />
                    <br />
                    «Куклы» вроде, то ли «Кукла». Хз короче. Я вас уведомил, вот.
                  </div>
                  <div className="w-fit max-w-[66%] rounded-xl bg-neutral-800 p-2 text-neutral-50">
                    тест
                  </div>
                </div>
              </div>
              <div className={cn('mx-auto w-full px-2 pb-4 pt-2', 'md:w-8/12', 'xl:w-6/12')}>
                <Input
                  startAdornment={<IconSmilingFace />}
                  endAdornment={<IconPaperClip />}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
};
