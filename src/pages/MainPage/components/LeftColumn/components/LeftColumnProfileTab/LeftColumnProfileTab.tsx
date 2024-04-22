import cn from 'classnames';
import { motion } from 'framer-motion';

import { Intl } from '~/components';
import { Avatar, IconButton, Input } from '~/components/common';
import { IconCameraWithPlus, IconCheck, IconChevronLeft } from '~/components/common/icons';
import { getUserName } from '~/utils/helpers';

import { useLeftColumnProfileTab } from './hooks';

export const LeftColumnProfileTab = () => {
  const { state, form, functions } = useLeftColumnProfileTab();

  return (
    <>
      <div className="flex h-14 items-center gap-2 border-b border-b-neutral-700 px-4">
        <IconButton onClick={functions.goPreviousTab}>
          <IconChevronLeft className="h-6 w-6" />
        </IconButton>
        <span className="grow text-xl font-semibold">
          <Intl path="page.home.leftColumn.settings.profile" />
        </span>
      </div>
      <div className="relative flex grow flex-col gap-3 bg-neutral-900 font-medium">
        <form
          className="flex flex-col gap-4 bg-neutral-800 p-4"
          onSubmit={functions.onSubmit}
        >
          <div className="flex items-center justify-center">
            <Avatar.Root className="relative h-28 w-28 text-4xl">
              <label
                aria-label={functions.translate(
                  'page.home.leftColumn.settings.profile.updateAvatar',
                )}
                className="group absolute inset-0 flex cursor-pointer items-center justify-center bg-black/50"
              >
                <IconCameraWithPlus
                  className={cn(
                    'h-12 w-12 text-white transition-all',
                    'group-hover:h-14 group-hover:w-14',
                  )}
                />
                <input
                  type="file"
                  className="hidden"
                  onChange={functions.onFileInputChange}
                />
              </label>
              <Avatar.Image avatar={state.user?.avatar} />
              <Avatar.Fallback>{getUserName(state.user!)[0]}</Avatar.Fallback>
            </Avatar.Root>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-neutral-400">
              <Intl path="page.home.leftColumn.settings.name" />
            </p>
            <Input
              s="l"
              placeholder={functions.translate('page.home.leftColumn.settings.name')}
              {...form.register('name')}
              {...(form.formState.errors.name && {
                error: true,
                helperText: form.formState.errors.name.message,
              })}
              disabled={form.formState.isSubmitting}
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-neutral-400">
              <Intl path="page.home.leftColumn.settings.lastname" />
            </p>
            <Input
              s="l"
              placeholder={functions.translate('page.home.leftColumn.settings.lastname')}
              {...form.register('lastname')}
              {...(form.formState.errors.lastname && {
                error: true,
                helperText: form.formState.errors.lastname.message,
              })}
              disabled={form.formState.isSubmitting}
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-neutral-400">
              <Intl path="page.home.leftColumn.settings.bio" />
            </p>
            <Input
              s="l"
              placeholder={functions.translate('page.home.leftColumn.settings.bio')}
              {...form.register('bio')}
              {...(form.formState.errors.bio && {
                error: true,
                helperText: form.formState.errors.bio.message,
              })}
              disabled={form.formState.isSubmitting}
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-neutral-400">
              <Intl path="page.home.leftColumn.settings.username" />
            </p>
            <Input
              s="l"
              placeholder={functions.translate('page.home.leftColumn.settings.username')}
              {...form.register('username')}
              {...(form.formState.errors.username && {
                error: true,
                helperText: form.formState.errors.username.message,
              })}
              disabled={form.formState.isSubmitting}
            />
          </div>
          <motion.div
            className="absolute bottom-4 right-4"
            animate={form.formState.isDirty ? 'visible' : 'hidden'}
            transition={{ duration: 0.2, type: 'spring' }}
            variants={{ hidden: { y: 100 }, visible: { y: 0 } }}
          >
            <IconButton
              color="primary"
              s="xl"
              type="submit"
            >
              <IconCheck className="h-7 w-7" />
            </IconButton>
          </motion.div>
        </form>
      </div>
    </>
  );
};
