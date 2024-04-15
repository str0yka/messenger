import { Intl } from '~/components';
import { Input, Button, Alert } from '~/components/common';

import { useLogin } from './hooks';

export const Login = () => {
  const { state, form, functions } = useLogin();

  return (
    <>
      <h1 className="text-2xl font-bold text-neutral-50">Messenger</h1>
      {state.loginMutation.error?.message && (
        <Alert.Root>
          <Alert.Label>
            <Intl
              path="page.auth.login.errorText"
              values={{ status: state.loginMutation.error.status }}
            />
          </Alert.Label>
          {state.loginMutation.error.message}
        </Alert.Root>
      )}
      <p className="text-center text-neutral-500">
        <Intl path="page.auth.logInText" />
      </p>
      <form
        className="flex w-full flex-col gap-3"
        onSubmit={functions.onSubmit}
      >
        <Input
          placeholder={functions.translate('input.label.email')}
          type="email"
          disabled={form.formState.isSubmitting}
          error={!!form.formState.errors.email?.message}
          helperText={form.formState.errors.email?.message}
          rounded
          {...form.register('email')}
        />
        <Input
          placeholder={functions.translate('input.label.password')}
          type="password"
          disabled={form.formState.isSubmitting}
          error={!!form.formState.errors.password?.message}
          helperText={form.formState.errors.password?.message}
          rounded
          {...form.register('password')}
        />
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          <Intl path="button.logIn" />
        </Button>
      </form>
    </>
  );
};
