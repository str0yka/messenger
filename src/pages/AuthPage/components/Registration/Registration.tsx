import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { Input, Button, Alert } from '~/components/common';
import { useIntl } from '~/features/i18n';
import type { PostRegistrationParams } from '~/utils/api';
import { useRegistrationMutation } from '~/utils/api';
import { PUBLIC_ROUTE } from '~/utils/constants';
import { useUserStore } from '~/utils/store';

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

  const registerForm = useForm<PostRegistrationParams>({
    defaultValues: { email: '', password: '' },
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
        onSubmit={registerForm.handleSubmit(async (values) => {
          try {
            await registerMutation.mutateAsync({ params: values });
          } catch {
            console.log('Error'); // $FIXME
          }
        })}
      >
        <Input
          placeholder={intl.t('input.label.email')}
          type="email"
          disabled={registerForm.formState.isSubmitting}
          error={!!registerForm.formState.errors.email?.message}
          helperText={registerForm.formState.errors.email?.message}
          rounded
          {...registerForm.register('email', {
            required: intl.t('page.auth.registration.input.email.helperText.required'),
            validate: (value) => {
              if (value === value.replace('@', '').replace('.', ''))
                return intl.t('page.auth.registration.input.email.helperText.invalidFormat');

              return true;
            },
          })}
        />
        <Input
          placeholder={intl.t('input.label.password')}
          type="password"
          disabled={registerForm.formState.isSubmitting}
          error={!!registerForm.formState.errors.password?.message}
          helperText={registerForm.formState.errors.password?.message}
          rounded
          {...registerForm.register('password', {
            required: intl.t('page.auth.registration.input.password.helperText.required'),
            minLength: {
              value: 8,
              message: intl.t('page.auth.registration.input.password.helperText.minCharacters', {
                number: 8,
              }),
            },
            validate: (value) => {
              if (value === value.toLowerCase()) {
                return intl.t('page.auth.registration.input.password.helperText.upperCase');
              }
              if (value === value.toUpperCase()) {
                return intl.t('page.auth.registration.input.password.helperText.lowerCase');
              }
              if (value === value.replace(/[0-9]/g, '')) {
                return intl.t('page.auth.registration.input.password.helperText.minDigit', {
                  number: 1,
                });
              }
              if (!Number.isNaN(Number(value))) {
                return intl.t('page.auth.registration.input.password.helperText.minLetters', {
                  number: 1,
                });
              }
              return true;
            },
          })}
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
