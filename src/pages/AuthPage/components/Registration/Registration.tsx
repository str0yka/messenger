import { Intl } from '~/components';
import { Input, Button, Alert } from '~/components/common';

import { useRegistration } from './hooks';

export const Registration = () => {
  const { form, functions, state } = useRegistration();

  return (
    <>
      <h1 className="text-2xl font-bold text-neutral-50">Messenger</h1>
      {state.registerMutation.error?.message && (
        <Alert.Root>
          <Alert.Label>
            <Intl
              path="page.auth.registration.errorText"
              values={{ status: state.registerMutation.error.status }}
            />
          </Alert.Label>
          {state.registerMutation.error.message}
        </Alert.Root>
      )}
      <p className="text-center text-neutral-500">
        <Intl path="page.auth.registerText" />
      </p>
      <form
        className="flex w-full flex-col gap-4"
        onSubmit={functions.onSubmit}
      >
        <Input
          placeholder={functions.translate('input.label.name')}
          type="text"
          disabled={form.formState.isSubmitting}
          error={!!form.formState.errors.name?.message}
          helperText={form.formState.errors.name?.message}
          rounded
          {...form.register('name')}
        />
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
          <Intl path="button.register" />
        </Button>
      </form>
    </>
  );
};
