import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useIntl } from '~/features/i18n';
import { useProfileUpdateMutation } from '~/utils/api';
import { getDirty } from '~/utils/helpers';
import { useUserStore } from '~/utils/store';

import { TAB } from '../../../constants';
import { useTabSetter } from '../../../contexts';
import { UpdateProfileFormScheme, updateProfileFormScheme } from '../constants';

export const useLeftColumnProfileTab = () => {
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

  const onSubmit = updateProfileForm.handleSubmit((values) => {
    if (!updateProfileForm.formState.isDirty) return;
    profileUpdateMutation.mutateAsync({
      params: getDirty(values, updateProfileForm.formState.dirtyFields),
    });
  });

  const goPreviousTab = () => setTab(TAB.SETTINGS);

  const onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const formData = new FormData();
      formData.append('image', event.target.files[0]);
      profileUpdateMutation.mutateAsync({ params: formData });
    }
  };

  return {
    state: {
      user,
    },
    form: updateProfileForm,
    functions: {
      translate: intl.t,
      onSubmit,
      goPreviousTab,
      onFileInputChange,
    },
  };
};
