import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { Input, Button, Alert } from '~/components/common';
import { useIntl } from '~/features/i18n';
import { useLoginMutation } from '~/utils/api';
import type { PostLoginParams } from '~/utils/api';
import { ACCESS_TOKEN_LOCAL_STORAGE_KEY, PRIVATE_ROUTE, PUBLIC_ROUTE } from '~/utils/constants';
import { useUserStore } from '~/utils/store';

export const Login = () => {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const intl = useIntl();

  const loginMutation = useLoginMutation({
    onSuccess: (data) => {
      setUser(data.user);
      if (data.user.isVerified) {
        localStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY, data.accessToken);
        navigate(PRIVATE_ROUTE.HOME);
      } else {
        navigate(PUBLIC_ROUTE.VERIFY);
      }
    },
  });

  const loginForm = useForm<PostLoginParams>({
    defaultValues: { email: '', password: '' },
  });

  return (
    <>
      <h1 className="text-2xl font-bold text-neutral-50">Messenger</h1>
      {loginMutation.error?.message && (
        <Alert.Root>
          <Alert.Label>
            {intl.t('page.auth.login.errorText', { status: loginMutation.error.status })}
          </Alert.Label>
          {loginMutation.error.message}
        </Alert.Root>
      )}
      <p className="text-center text-neutral-500">{intl.t('page.auth.logInText')}</p>
      <form
        className="flex w-full flex-col gap-3"
        onSubmit={loginForm.handleSubmit(async (values) => {
          try {
            await loginMutation.mutateAsync({ params: values });
          } catch {
            console.log('Error'); // $FIXME
          }
        })}
      >
        <Input
          placeholder={intl.t('input.label.email')}
          type="email"
          disabled={loginForm.formState.isSubmitting}
          error={!!loginForm.formState.errors.email?.message}
          helperText={loginForm.formState.errors.email?.message}
          rounded
          {...loginForm.register('email', {
            required: intl.t('page.auth.login.input.email.helperText.required'),
            validate: (value) => {
              if (value === value.replace('@', '').replace('.', '')) {
                return intl.t('page.auth.login.input.email.helperText.invalidFormat');
              }
              return true;
            },
          })}
        />
        <Input
          placeholder={intl.t('input.label.password')}
          type="password"
          disabled={loginForm.formState.isSubmitting}
          error={!!loginForm.formState.errors.password?.message}
          helperText={loginForm.formState.errors.password?.message}
          rounded
          {...loginForm.register('password', {
            required: intl.t('page.auth.login.input.password.helperText.required'),
          })}
        />
        <Button
          type="submit"
          disabled={loginForm.formState.isSubmitting}
        >
          {intl.t('button.logIn')}
        </Button>
      </form>
    </>
  );
};
