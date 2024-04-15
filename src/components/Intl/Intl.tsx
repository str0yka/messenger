import { useIntl } from '~/features/i18n';

interface IntlProps {
  path: LocaleMessageId;
  values?: Record<string, string | number>;
}

export const Intl: React.FC<IntlProps> = ({ path, values }) => {
  const intl = useIntl();

  return <>{intl.t(path, values)}</>;
};
