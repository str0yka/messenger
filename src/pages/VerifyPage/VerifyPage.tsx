import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { Navigate, useNavigate } from 'react-router-dom';

import { Input, Button } from '~/components/common';
import { useIntl } from '~/features/i18n';
import {
  PostVerifyByIdFailureResponse,
  PostVerifyByIdSuccessResponse,
  VerifyByIdParams,
  postVerifyById,
} from '~/utils/api';
import { ACCESS_TOKEN_LOCAL_STORAGE_KEY, PRIVATE_ROUTE, PUBLIC_ROUTE } from '~/utils/constants';
import { useUserStore } from '~/utils/store';

export const VerifyPage = () => {
  const navigate = useNavigate();
  const intl = useIntl();
  const { user, setUser } = useUserStore();

  const { mutateAsync: verifyMutation } = useMutation<
    PostVerifyByIdSuccessResponse,
    PostVerifyByIdFailureResponse,
    VerifyByIdParams
  >({
    mutationFn: postVerifyById,
    onSuccess: (data) => {
      localStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY, data.accessToken);
      setUser(data.user);
      navigate(PRIVATE_ROUTE.HOME);
    },
  });

  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm<VerifyByIdParams['body']>();

  if (!user) {
    return <Navigate to={PUBLIC_ROUTE.HOME} />;
  }

  return (
    <main className="flex h-screen items-center justify-center bg-neutral-900">
      <div className="flex w-[350px] flex-col items-center gap-4 rounded bg-neutral-800 p-4">
        <h1 className="text-2xl font-bold text-neutral-50">Messenger</h1>
        <p className="text-center text-neutral-500">
          {intl.t('page.verify.verifyText', { email: user.email })}
        </p>
        <form
          className="flex w-full flex-col gap-4"
          onSubmit={handleSubmit(async (values) => {
            try {
              await verifyMutation({ userId: (user as User).id, body: values });
            } catch {
              console.log('Error'); // $FIXME
            }
          })}
        >
          <Input
            placeholder={intl.t('input.label.verifyCode')}
            type="tel"
            disabled={isSubmitting}
            {...register('verificationCode', {
              required: true,
              valueAsNumber: true,
              minLength: 4,
              maxLength: 4,
            })}
          />
          <Button
            disabled={isSubmitting}
            type="submit"
          >
            {intl.t('button.verify')}
          </Button>
        </form>
      </div>
    </main>
  );
};
