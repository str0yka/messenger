import cn from 'classnames';

import { Intl } from '~/components';
import { IconButton, RadioGroup } from '~/components/common';
import { IconChevronLeft } from '~/components/common/icons';
import { LANGUAGES } from '~/utils/constants';

import { useLeftColumnLanguageTab } from './hooks';

export const LeftColumnLanguageTab = () => {
  const { state, functions } = useLeftColumnLanguageTab();

  return (
    <>
      <div className="flex h-14 items-center gap-2 border-b border-b-neutral-700 px-4">
        <IconButton onClick={functions.goPreviousTab}>
          <IconChevronLeft className="h-6 w-6" />
        </IconButton>
        <span className="grow text-xl font-semibold">
          <Intl path="page.home.leftColumn.settings.language" />
        </span>
      </div>
      <div className="flex grow flex-col gap-3 bg-neutral-900 font-medium">
        <RadioGroup.Root
          className="flex flex-col bg-neutral-800 p-2"
          defaultValue={state.locale}
          onValueChange={functions.handleChangeLocale}
        >
          {LANGUAGES.map((language) => (
            <RadioGroup.Item
              value={language.locale}
              key={language.locale}
              type="button"
              className={cn(
                'flex items-center gap-6 rounded-xl px-4 py-2',
                'hover:bg-neutral-600/50',
              )}
            >
              <div className="flex flex-col items-start">
                {language.englishName}
                <span className="text-sm text-neutral-400">{language.name}</span>
              </div>
            </RadioGroup.Item>
          ))}
        </RadioGroup.Root>
      </div>
    </>
  );
};
