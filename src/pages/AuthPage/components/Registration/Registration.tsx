import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { Input, Button } from '~/components/common';
import { useIntl } from '~/features/i18n';
import { postRegistration } from '~/utils/api';
import type {
  PostRegistrationFailureResponse,
  PostRegistrationSuccessResponse,
  RegistrationParams,
} from '~/utils/api';
import { PUBLIC_ROUTE } from '~/utils/constants';
import { useUserStore } from '~/utils/store';

export const Registration = () => {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const intl = useIntl();

  const { mutateAsync: registerMutation } = useMutation<
    PostRegistrationSuccessResponse,
    PostRegistrationFailureResponse,
    RegistrationParams
  >({
    mutationFn: postRegistration,
    onSuccess: (data) => {
      setUser(data.user);
      navigate(PUBLIC_ROUTE.VERIFY);
    },
  });

  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm<RegistrationParams>({
    defaultValues: { email: '', password: '' },
  });

  return (
    <>
      <h1 className="text-2xl font-bold text-neutral-50">Messenger</h1>
      <p className="text-center text-neutral-500">{intl.t('page.auth.registerText')}</p>
      <form
        className="flex w-full flex-col gap-4"
        onSubmit={handleSubmit(async (values) => {
          try {
            await registerMutation(values);
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
          {intl.t('button.register')}
        </Button>
      </form>
    </>
  );
};
