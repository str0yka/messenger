import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { Input, Button } from '~/components/common';
import { useIntl } from '~/features/i18n';
import { postLogin } from '~/utils/api';
import type { PostLoginSuccessResponse, PostLoginFailureResponse, LoginParams } from '~/utils/api';
import { PRIVATE_ROUTE, PUBLIC_ROUTE } from '~/utils/constants';
import { useUserStore } from '~/utils/store';

export const Login = () => {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const intl = useIntl();

  const { mutateAsync: loginMutation } = useMutation<
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

  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm<LoginParams>({
    defaultValues: { email: '', password: '' },
  });

  return (
    <>
      <h1 className="text-2xl font-bold text-neutral-50">Messenger</h1>
      <p className="text-center text-neutral-500">{intl.t('page.auth.logInText')}</p>
      <form
        className="flex w-full flex-col gap-4"
        onSubmit={handleSubmit(async (values) => {
          try {
            await loginMutation(values);
          } catch {
            console.log('Error'); // $FIXME
          }
        })}
      >
        <Input
          placeholder={intl.t('input.label.email')}
          type="email"
          disabled={isSubmitting}
          {...register('email', { required: true })}
        />
        <Input
          placeholder={intl.t('input.label.password')}
          type="password"
          disabled={isSubmitting}
          {...register('password', { required: true })}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {intl.t('button.logIn')}
        </Button>
      </form>
    </>
  );
};
