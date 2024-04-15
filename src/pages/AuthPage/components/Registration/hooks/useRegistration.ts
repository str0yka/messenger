import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useIntl } from '~/features/i18n';
import { useRegistrationMutation } from '~/utils/api';
import { PUBLIC_ROUTE } from '~/utils/constants';
import { useUserStore } from '~/utils/store';

import { RegisterFormScheme, registerFormScheme } from '../constants';

export const useRegistration = () => {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const intl = useIntl();

  const registerMutation = useRegistrationMutation({
    onSuccess: (data) => {
      setUser(data.user);
      navigate(PUBLIC_ROUTE.VERIFY);
    },
  });

  const registerForm = useForm<RegisterFormScheme>({
    defaultValues: { email: '', password: '', name: '' },
    resolver: zodResolver(registerFormScheme(intl)),
  });

  return {
    state: {
      registerMutation,
    },
    form: registerForm,
    functions: {
      translate: intl.t,
      onSubmit: registerForm.handleSubmit((values) =>
        registerMutation.mutateAsync({ params: values }),
      ),
    },
  };
};
