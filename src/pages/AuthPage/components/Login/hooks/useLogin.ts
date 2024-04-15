import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useIntl } from '~/features/i18n';
import { useLoginMutation } from '~/utils/api';
import { LOCAL_STORAGE_KEY, PRIVATE_ROUTE, PUBLIC_ROUTE } from '~/utils/constants';
import { useUserStore } from '~/utils/store';

import { LoginFormScheme, loginFormScheme } from '../constants';

export const useLogin = () => {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const intl = useIntl();

  const loginMutation = useLoginMutation({
    onSuccess: (data) => {
      setUser(data.user);
      if (data.user.isVerified) {
        localStorage.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, data.accessToken);
        navigate(PRIVATE_ROUTE.HOME);
      } else {
        navigate(PUBLIC_ROUTE.VERIFY);
      }
    },
  });

  const loginForm = useForm<LoginFormScheme>({
    defaultValues: { email: '', password: '' },
    resolver: zodResolver(loginFormScheme(intl)),
  });

  const onSubmit = loginForm.handleSubmit((values) =>
    loginMutation.mutateAsync({ params: values }),
  );

  return {
    state: {
      loginMutation,
    },
    form: loginForm,
    functions: {
      translate: intl.t,
      onSubmit,
    },
  };
};
