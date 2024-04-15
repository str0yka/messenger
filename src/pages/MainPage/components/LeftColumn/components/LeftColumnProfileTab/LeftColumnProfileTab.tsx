import { zodResolver } from '@hookform/resolvers/zod';
import cn from 'classnames';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';

import { Intl } from '~/components';
import { Avatar, IconButton, Input } from '~/components/common';
import { IconCameraWithPlus, IconCheck, IconChevronLeft } from '~/components/common/icons';
import { useIntl } from '~/features/i18n';
import { useProfileUpdateMutation } from '~/utils/api';
import { getDirty, getUserName } from '~/utils/helpers';
import { useUserStore } from '~/utils/store';

import { TAB } from '../../constants';
import { useTabSetter } from '../../contexts';

import { updateProfileFormScheme } from './constants';
import type { UpdateProfileFormScheme } from './constants';

export const LeftColumnProfileTab = () => {
  const intl = useIntl();
  const { user, setUser } = useUserStore((state) => ({ user: state.user, setUser: state.setUser }));

  const setTab = useTabSetter();

  const updateProfileForm = useForm<UpdateProfileFormScheme>({
    defaultValues: {
      bio: user?.bio ?? '',
      lastname: user?.lastname ?? '',
      name: user?.name ?? '',
      username: user?.username ?? '',
    },
    resolver: zodResolver(updateProfileFormScheme(intl)),
  });

  const profileUpdateMutation = useProfileUpdateMutation({
    onSuccess: (data) => {
      setUser(data.user);
      updateProfileForm.reset({
        bio: data.user?.bio ?? '',
        lastname: data.user?.lastname ?? '',
        name: data.user?.name ?? '',
        username: data.user?.username ?? '',
      });
    },
  });

  return (
    <>
      <div className="flex h-14 items-center gap-2 border-b border-b-neutral-700 px-4">
        <IconButton onClick={() => setTab(TAB.SETTINGS)}>
          <IconChevronLeft className="h-6 w-6" />
        </IconButton>
        <span className="grow text-xl font-semibold">
          <Intl path="page.home.leftColumn.settings.profile" />
        </span>
      </div>
      <div className="relative flex grow flex-col gap-3 bg-neutral-900 font-medium">
        <form
          className="flex flex-col gap-4 bg-neutral-800 p-4"
          onSubmit={updateProfileForm.handleSubmit((values) => {
            if (!updateProfileForm.formState.isDirty) return;
            profileUpdateMutation.mutateAsync({
              params: getDirty(values, updateProfileForm.formState.dirtyFields),
            });
          })}
        >
          <div className="flex items-center justify-center">
            <Avatar.Root className="relative h-28 w-28 text-4xl">
              <label
                aria-label={intl.t('page.home.leftColumn.settings.profile.updateAvatar')}
                className="group absolute inset-0 flex cursor-pointer items-center justify-center bg-black/50"
              >
                <IconCameraWithPlus
                  className={cn('h-12 w-12 transition-all', 'group-hover:h-14 group-hover:w-14')}
                />
                <input
                  type="file"
                  className="hidden"
                  onChange={(event) => {
                    if (event.target.files?.length) {
                      const formData = new FormData();
                      formData.append('image', event.target.files[0]);
                      profileUpdateMutation.mutateAsync({ params: formData });
                    }
                  }}
                />
              </label>
              <Avatar.Image avatar={user?.avatar} />
              <Avatar.Fallback>{getUserName(user!)[0]}</Avatar.Fallback>
            </Avatar.Root>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-neutral-400">
              <Intl path="page.home.leftColumn.settings.name" />
            </p>
            <Input
              s="l"
              placeholder={intl.t('page.home.leftColumn.settings.name')}
              {...updateProfileForm.register('name')}
              {...(updateProfileForm.formState.errors.name && {
                error: true,
                helperText: updateProfileForm.formState.errors.name.message,
              })}
              disabled={updateProfileForm.formState.isSubmitting}
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-neutral-400">
              <Intl path="page.home.leftColumn.settings.lastname" />
            </p>
            <Input
              s="l"
              placeholder={intl.t('page.home.leftColumn.settings.lastname')}
              {...updateProfileForm.register('lastname')}
              {...(updateProfileForm.formState.errors.lastname && {
                error: true,
                helperText: updateProfileForm.formState.errors.lastname.message,
              })}
              disabled={updateProfileForm.formState.isSubmitting}
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-neutral-400">
              <Intl path="page.home.leftColumn.settings.bio" />
            </p>
            <Input
              s="l"
              placeholder={intl.t('page.home.leftColumn.settings.bio')}
              {...updateProfileForm.register('bio')}
              {...(updateProfileForm.formState.errors.bio && {
                error: true,
                helperText: updateProfileForm.formState.errors.bio.message,
              })}
              disabled={updateProfileForm.formState.isSubmitting}
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-neutral-400">
              <Intl path="page.home.leftColumn.settings.username" />
            </p>
            <Input
              s="l"
              placeholder={intl.t('page.home.leftColumn.settings.username')}
              {...updateProfileForm.register('username')}
              {...(updateProfileForm.formState.errors.username && {
                error: true,
                helperText: updateProfileForm.formState.errors.username.message,
              })}
              disabled={updateProfileForm.formState.isSubmitting}
            />
          </div>
          <motion.div
            className="absolute bottom-4 right-4"
            animate={updateProfileForm.formState.isDirty ? 'visible' : 'hidden'}
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
