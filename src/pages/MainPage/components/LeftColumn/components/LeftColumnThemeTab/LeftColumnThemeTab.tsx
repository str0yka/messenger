import cn from 'classnames';

import { Intl } from '~/components';
import { IconButton, RadioGroup } from '~/components/common';
import { IconChevronLeft } from '~/components/common/icons';
import { EXTENDED_THEMES } from '~/utils/constants';

import { useLeftColumnThemeTab } from './hooks';

export const LeftColumnThemeTab = () => {
  const { state, functions } = useLeftColumnThemeTab();

  return (
    <>
      <div className="flex h-14 items-center gap-2 border-b border-b-neutral-700 px-4">
        <IconButton onClick={functions.goPreviousTab}>
          <IconChevronLeft className="h-6 w-6" />
        </IconButton>
        <span className="grow text-xl font-semibold">
          <Intl path="page.home.leftColumn.settings.theme" />
        </span>
      </div>
      <div className="flex grow flex-col gap-3 bg-neutral-900 font-medium">
        <RadioGroup.Root
          className="flex flex-col bg-neutral-800 p-2"
          defaultValue={state.extendedTheme.theme}
          onValueChange={functions.handleChangeTheme}
        >
          {EXTENDED_THEMES.map((extTheme) => (
            <RadioGroup.Item
              value={extTheme.theme}
              key={extTheme.theme}
              type="button"
              className={cn(
                'flex items-center gap-6 rounded-xl px-4 py-2',
                'hover:bg-neutral-600/50',
              )}
            >
              <div className="flex flex-col items-start">
                <Intl path={extTheme.intl} />
                <div className="flex gap-0.5">
                  <div className={cn('h-4 w-4 rounded-full', extTheme.tailwind.bg)} />
                  <div
                    className={cn(
                      'h-4 w-4 rounded-full',
                      extTheme.mode === 'light' ? 'bg-white' : 'bg-black',
                    )}
                  />
                </div>
              </div>
            </RadioGroup.Item>
          ))}
        </RadioGroup.Root>
      </div>
    </>
  );
};
