import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { Input, Button, Alert } from '~/components/common';
import { useIntl } from '~/features/i18n';
import { useRegistrationMutation } from '~/utils/api';
import { PUBLIC_ROUTE } from '~/utils/constants';
import { useUserStore } from '~/utils/store';

import { registerFormScheme } from './constants';
import type { RegisterFormScheme } from './constants';

export const Registration = () => {
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

  return (
    <>
      <h1 className="text-2xl font-bold text-neutral-50">Messenger</h1>
      {registerMutation.error?.message && (
        <Alert.Root>
          <Alert.Label>
            {intl.t('page.auth.registration.errorText', { status: registerMutation.error.status })}
          </Alert.Label>
          {registerMutation.error.message}
        </Alert.Root>
      )}
      <p className="text-center text-neutral-500">{intl.t('page.auth.registerText')}</p>
      <form
        className="flex w-full flex-col gap-4"
        onSubmit={registerForm.handleSubmit((values) =>
          registerMutation.mutateAsync({ params: values }),
        )}
      >
        <Input
          placeholder={intl.t('input.label.name')}
          type="text"
          disabled={registerForm.formState.isSubmitting}
          error={!!registerForm.formState.errors.name?.message}
          helperText={registerForm.formState.errors.name?.message}
          rounded
          {...registerForm.register('name')}
        />
        <Input
          placeholder={intl.t('input.label.email')}
          type="email"
          disabled={registerForm.formState.isSubmitting}
          error={!!registerForm.formState.errors.email?.message}
          helperText={registerForm.formState.errors.email?.message}
          rounded
          {...registerForm.register('email')}
        />
        <Input
          placeholder={intl.t('input.label.password')}
          type="password"
          disabled={registerForm.formState.isSubmitting}
          error={!!registerForm.formState.errors.password?.message}
          helperText={registerForm.formState.errors.password?.message}
          rounded
          {...registerForm.register('password')}
        />
        <Button
          type="submit"
          disabled={registerForm.formState.isSubmitting}
        >
          {intl.t('button.register')}
        </Button>
      </form>
    </>
  );
};
