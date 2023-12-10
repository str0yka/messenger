import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { Input, Button, Alert } from '~/components/common';
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

  const { mutateAsync: registerMutation, error: registerError } = useMutation<
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
    formState: { isSubmitting, errors },
  } = useForm<RegistrationParams>({
    defaultValues: { email: '', password: '' },
  });

  return (
    <>
      <h1 className="text-2xl font-bold text-neutral-50">Messenger</h1>
      {registerError?.message && (
        <Alert.Root>
          <Alert.Label>
            {intl.t('page.auth.registration.errorText', { status: registerError.status })}
          </Alert.Label>
          {registerError.message}
        </Alert.Root>
      )}
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
          error={!!errors.email?.message}
          helperText={errors.email?.message}
          {...register('email', {
            required: intl.t('page.auth.registration.input.email.helperText.required'),
            validate: (value) => {
              if (value === value.replace('@', '').replace('.', ''))
                return intl.t('page.auth.registration.input.email.helperText.invalidFormat');
            },
          })}
        />
        <Input
          placeholder={intl.t('input.label.password')}
          type="password"
          disabled={isSubmitting}
          error={!!errors.password?.message}
          helperText={errors.password?.message}
          {...register('password', {
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
              if (!isNaN(Number(value))) {
                return intl.t('page.auth.registration.input.password.helperText.minLetters', {
                  number: 1,
                });
              }
            },
          })}
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
