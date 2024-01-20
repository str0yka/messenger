import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { Input, Button, Alert } from '~/components/common';
import { useIntl } from '~/features/i18n';
import { postLogin } from '~/utils/api';
import type { PostLoginSuccessResponse, PostLoginFailureResponse, LoginParams } from '~/utils/api';
import { PRIVATE_ROUTE, PUBLIC_ROUTE } from '~/utils/constants';
import { useUserStore } from '~/utils/store';

export const Login = () => {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const intl = useIntl();

  const loginMutation = useMutation<
    PostLoginSuccessResponse,
    PostLoginFailureResponse,
    LoginParams
  >({
    mutationFn: postLogin,
    onSuccess: (data) => {
      setUser(data.user);
      if (data.user.isVerified) {
        navigate(PRIVATE_ROUTE.HOME);
      } else {
        navigate(PUBLIC_ROUTE.VERIFY);
      }
    },
    onError: () => {},
  });

  const loginForm = useForm<LoginParams>({
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
            await loginMutation.mutateAsync(values);
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
