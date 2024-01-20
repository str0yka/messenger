import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { Navigate, useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

import { Input, Button, Link, Alert } from '~/components/common';
import { IconChevronLeft } from '~/components/common/icons';
import { useIntl } from '~/features/i18n';
import { postVerifyById } from '~/utils/api';
import type {
  PostVerifyByIdFailureResponse,
  PostVerifyByIdSuccessResponse,
  VerifyByIdParams,
} from '~/utils/api';
import { ACCESS_TOKEN_LOCAL_STORAGE_KEY, PRIVATE_ROUTE, PUBLIC_ROUTE } from '~/utils/constants';
import { useUserStore } from '~/utils/store';

export const VerifyPage = () => {
  const navigate = useNavigate();
  const intl = useIntl();
  const { user, setUser } = useUserStore(
    useShallow((state) => ({ user: state.user, setUser: state.setUser })),
  );

  const verifyMutation = useMutation<
    PostVerifyByIdSuccessResponse,
    PostVerifyByIdFailureResponse,
    VerifyByIdParams
  >({
    mutationKey: 'VerifyPageVerifyMutation',
    mutationFn: postVerifyById,
    onSuccess: (data) => {
      localStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY, data.accessToken);
      setUser(data.user);
      navigate(PRIVATE_ROUTE.HOME);
    },
  });

  const verifyForm = useForm<VerifyByIdParams['body']>();

  if (!user) {
    return <Navigate to={PUBLIC_ROUTE.HOME} />;
  }

  return (
    <main className="flex h-screen items-center justify-center bg-neutral-900">
      <div className="flex w-[350px] flex-col items-center gap-4 rounded bg-neutral-800 p-4">
        <Link
          to={PUBLIC_ROUTE.HOME}
          className="flex items-center gap-2 self-start"
        >
          <IconChevronLeft className="text-primary-400" />
          {intl.t('page.verify.header.goBack')}
        </Link>
        <h1 className="text-2xl font-bold text-neutral-50">Messenger</h1>
        {verifyMutation.error?.message && (
          <Alert.Root>
            <Alert.Label>
              {intl.t('page.verify.errorText', { status: verifyMutation.error.status })}
            </Alert.Label>
            {verifyMutation.error.message}
          </Alert.Root>
        )}
        <p className="text-center text-neutral-500">
          {intl.t('page.verify.verifyText', { email: user.email })}
        </p>
        <form
          className="flex w-full flex-col gap-4"
          onSubmit={verifyForm.handleSubmit(async (values) => {
            try {
              await verifyMutation.mutateAsync({ userId: (user as User).id, body: values });
            } catch {
              console.log('Error'); // $FIXME
            }
          })}
        >
          <Input
            placeholder={intl.t('input.label.verifyCode')}
            type="tel"
            disabled={verifyForm.formState.isSubmitting}
            error={!!verifyForm.formState.errors.verificationCode?.message}
            helperText={verifyForm.formState.errors.verificationCode?.message}
            rounded
            {...verifyForm.register('verificationCode', {
              required: intl.t('page.verify.input.code.helperText.required'),
              minLength: {
                value: 4,
                message: intl.t('page.verify.input.code.helperText.codeLength', { number: 4 }),
              },
              maxLength: {
                value: 4,
                message: intl.t('page.verify.input.code.helperText.codeLength', { number: 4 }),
              },
            })}
          />
          <Button
            disabled={verifyForm.formState.isSubmitting}
            type="submit"
          >
            {intl.t('button.verify')}
          </Button>
        </form>
      </div>
    </main>
  );
};
