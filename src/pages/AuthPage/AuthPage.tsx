import { Input } from '~/components/common';
import { useIntl } from '~/features/i18n';

export const AuthPage = () => {
  const intl = useIntl();

  return (
    <main className="flex h-screen items-center justify-center bg-neutral-900">
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-neutral-50">Messenger</h1>
        <p className="text-neutral-500">{intl.t('page.auth.logInText')}</p>
        <Input
          placeholder={intl.t('input.label.email')}
          type="email"
        />
        <Input
          placeholder={intl.t('input.label.password')}
          type="password"
        />
      </div>
    </main>
  );
};
