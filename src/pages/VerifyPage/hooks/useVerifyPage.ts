import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

import { useIntl } from '~/features/i18n';
import { useVerifyByIdMutation } from '~/utils/api';
import { LOCAL_STORAGE_KEY, PRIVATE_ROUTE } from '~/utils/constants';
import { useUserStore } from '~/utils/store';

import { verifyFormScheme } from '../constants';
import type { VerifyFormScheme } from '../constants';

export const useVerifyPage = () => {
  const navigate = useNavigate();
  const intl = useIntl();
  const { user, setUser } = useUserStore(
    useShallow((state) => ({ user: state.user, setUser: state.setUser })),
  );

  const verifyMutation = useVerifyByIdMutation({
    onSuccess: (data) => {
      localStorage.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, data.accessToken);
      setUser(data.user);
      navigate(PRIVATE_ROUTE.HOME);
    },
  });

  const verifyForm = useForm<VerifyFormScheme>({ resolver: zodResolver(verifyFormScheme(intl)) });

  const onSubmit = verifyForm.handleSubmit(async ({ verificationCode }) =>
    verifyMutation.mutateAsync({
      params: { userId: user!.id, verificationCode },
    }),
  );

  return {
    state: {
      user,
      verifyMutation,
    },
    form: verifyForm,
    functions: {
      onSubmit,
      translate: intl.t,
    },
  };
};
