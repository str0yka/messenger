import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';

import { IconButton, Input } from '~/components/common';
import { IconCheck, IconChevronLeft } from '~/components/common/icons';
import { useIntl } from '~/features/i18n';
import { useProfileUpdateMutation } from '~/utils/api';
import { getDirty } from '~/utils/helpers';
import { useUserStore } from '~/utils/store';

import { TAB } from '../../constants';
import { useSetTab } from '../../contexts';

type UpdateProfileValues = Pick<User, 'bio' | 'name' | 'lastname' | 'username'>;

export const LeftColumnProfileTab = () => {
  const intl = useIntl();
  const { user, setUser } = useUserStore((state) => ({ user: state.user, setUser: state.setUser }));

  const setTab = useSetTab();

  const updateProfileForm = useForm<UpdateProfileValues>({
    defaultValues: {
      bio: user?.bio ?? '',
      lastname: user?.lastname ?? '',
      name: user?.name ?? '',
      username: user?.username ?? '',
    },
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
          {intl.t('page.home.leftColumn.settings.profile')}
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
          <div className="flex flex-col gap-1">
            <p className="text-sm text-neutral-400">
              {intl.t('page.home.leftColumn.settings.name')}
            </p>
            <Input
              s="l"
              placeholder={intl.t('page.home.leftColumn.settings.name')}
              {...updateProfileForm.register('name', {
                required: {
                  value: true,
                  message: intl.t('page.home.leftColumn.settings.profile.name.required'),
                },
                maxLength: {
                  value: 25,
                  message: intl.t('page.home.leftColumn.settings.profile.name.maxLength'),
                },
              })}
              {...(updateProfileForm.formState.errors.name && {
                error: true,
                helperText: updateProfileForm.formState.errors.name.message,
              })}
              disabled={updateProfileForm.formState.isSubmitting}
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-neutral-400">
              {intl.t('page.home.leftColumn.settings.lastname')}
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
              {intl.t('page.home.leftColumn.settings.bio')}
            </p>
            <Input
              s="l"
              placeholder={intl.t('page.home.leftColumn.settings.bio')}
              {...updateProfileForm.register('bio', {
                maxLength: {
                  value: 25,
                  message: intl.t('page.home.leftColumn.settings.profile.bio.maxLength', {
                    number: 25,
                  }),
                },
              })}
              {...(updateProfileForm.formState.errors.bio && {
                error: true,
                helperText: updateProfileForm.formState.errors.bio.message,
              })}
              disabled={updateProfileForm.formState.isSubmitting}
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-neutral-400">
              {intl.t('page.home.leftColumn.settings.username')}
            </p>
            <Input
              s="l"
              placeholder={intl.t('page.home.leftColumn.settings.username')}
              {...updateProfileForm.register('username', {
                maxLength: {
                  value: 25,
                  message: intl.t('page.home.leftColumn.settings.profile.username.maxLength', {
                    number: 25,
                  }),
                },
                minLength: {
                  value: 5,
                  message: intl.t('page.home.leftColumn.settings.profile.username.minLength', {
                    number: 5,
                  }),
                },
              })}
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
