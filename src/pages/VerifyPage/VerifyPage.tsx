import { Intl } from '~/components';
import { Input, Button, Link, Alert } from '~/components/common';
import { IconChevronLeft } from '~/components/common/icons';
import { PUBLIC_ROUTE } from '~/utils/constants';

import { useVerifyPage } from './hooks';

export const VerifyPage = () => {
  const { state, form, functions } = useVerifyPage();

  return (
    <main className="flex h-screen items-center justify-center bg-neutral-900">
      <div className="flex w-[350px] flex-col items-center gap-4 rounded bg-neutral-800 p-4">
        <Link
          to={PUBLIC_ROUTE.HOME}
          className="flex items-center gap-2 self-start"
        >
          <IconChevronLeft className="text-primary-400" />
          <Intl path="page.verify.header.goBack" />
        </Link>
        <h1 className="text-2xl font-bold text-neutral-50">Messenger</h1>
        {state.verifyMutation.error?.message && (
          <Alert.Root>
            <Alert.Label>
              <Intl
                path="page.verify.errorText"
                values={{ status: state.verifyMutation.error.status }}
              />
            </Alert.Label>
            {state.verifyMutation.error.message}
          </Alert.Root>
        )}
        <p className="text-center text-neutral-500">
          <Intl
            path="page.verify.verifyText"
            values={{ email: state.user!.email }}
          />
        </p>
        <form
          className="flex w-full flex-col gap-4"
          onSubmit={functions.onSubmit}
        >
          <Input
            placeholder={functions.translate('input.label.verifyCode')}
            type="tel"
            disabled={form.formState.isSubmitting}
            error={!!form.formState.errors.verificationCode?.message}
            helperText={form.formState.errors.verificationCode?.message}
            rounded
            {...form.register('verificationCode')}
          />
          <Button
            disabled={form.formState.isSubmitting}
            type="submit"
          >
            <Intl path="button.verify" />
          </Button>
        </form>
      </div>
    </main>
  );
};
