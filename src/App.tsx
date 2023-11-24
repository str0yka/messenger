import * as Avatar from '@radix-ui/react-avatar';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import cn from 'classnames';
import { useLayoutEffect, useRef, useState } from 'react';

import { IconButton, Input } from '~/components/common';
import {
  IconCross,
  IconHamburgerMenu,
  IconMagnifyingGlass,
  IconPaperClip,
  IconSmilingFace,
} from '~/components/common/icons';

export const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, []);

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
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="w-80 rounded-xl bg-neutral-800/75 p-2 shadow-[0_0_35px_rgba(0,0,0,0.5)] backdrop-blur-lg">
                <DropdownMenu.Item
                  className={cn(
                    'cursor-pointer rounded p-2 outline-none transition-all',
                    'focus-visible:bg-neutral-900/50',
                    'active:scale-95',
                  )}
                >
                  <p className="text-sm font-semibold text-neutral-50">Saved Messages</p>
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  className={cn(
                    'cursor-pointer rounded p-2 outline-none transition-all',
                    'focus-visible:bg-neutral-900/50',
                    'active:scale-95',
                  )}
                >
                  <p className="text-sm font-semibold text-neutral-50">My stories</p>
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  className={cn(
                    'cursor-pointer rounded p-2 outline-none transition-all',
                    'focus-visible:bg-neutral-900/50',
                    'active:scale-95',
                  )}
                >
                  <p className="text-sm font-semibold text-neutral-50">Contacts</p>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
          <div className="flex-grow">
            <Input startAdornment={<IconMagnifyingGlass />} />
          </div>
        </div>
        <ul className="flex flex-grow flex-col overflow-auto p-2">
          {Array(20)
            .fill(null)
            .map((_, index) => (
              <li
                key={index}
                tabIndex={0}
                onClick={() => setIsOpen(true)}
              >
                <div
                  className={cn(
                    'flex cursor-pointer select-none gap-2 rounded-lg p-2',
                    'hover:bg-neutral-700/50',
                    'active:bg-neutral-600/50',
                  )}
                >
                  <Avatar.Root className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-violet-300 to-violet-500">
                    <Avatar.Fallback className="text-xl font-semibold text-neutral-50">
                      MA
                    </Avatar.Fallback>
                  </Avatar.Root>
                  <div className="flex min-w-[0] flex-grow flex-col">
                    <div className="flex items-center gap-2">
                      <h2 className="flex-grow truncate font-semibold text-neutral-50">
                        some 124124124412124124124124124124channel
                      </h2>
                      <p className="text-xs text-neutral-400">19:32</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="flex-grow truncate text-neutral-400">
                        afjawfaafkaafjawfaafkaafjawfaaafjawfaafkaafjawfaafkaafjawfaafkaafjawfaafkaafjawfaafkafkaafjawfaafkaafjawfaafkaafjawfaafkaafjawfaafkaafjawfaafkaafjawfaafka
                      </p>
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-violet-400 text-xs font-medium text-neutral-50">
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
          "flex flex-grow flex-col overflow-hidden bg-neutral-900 bg-[url('/images/chat-bg.png')]",
          isOpen && 'absolute inset-0',
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
              <Avatar.Root className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-violet-300 to-violet-500">
                <Avatar.Fallback className="text-md font-semibold text-neutral-50">
                  MA
                </Avatar.Fallback>
              </Avatar.Root>
              <h2 className="truncate font-semibold text-neutral-50">
                Saved MessagesSaved MessagesSaved MessagesSaved MessagesSaved MessagesSaved
                MessagesSavedSaved MessagesSaved MessagesSaved MessagesSaved MessagesSaved
                MessagesSaved MessagesSaved Messages MessagesSaved MessagesSaved Messages
              </h2>
            </div>
            <div className="flex w-full flex-grow flex-col overflow-hidden">
              <div
                ref={chatRef}
                className="flex-grow overflow-auto px-2"
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
                  <div className="w-fit max-w-[66%] self-end rounded-xl bg-violet-500 p-2 text-neutral-50">
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
                  <div className="w-fit max-w-[66%] self-end rounded-xl bg-violet-500 p-2 text-neutral-50">
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
                  <div className="w-fit max-w-[66%] self-end rounded-xl bg-violet-500 p-2 text-neutral-50">
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
