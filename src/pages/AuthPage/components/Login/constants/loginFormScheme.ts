import * as z from 'zod';

import { useIntl } from '~/features/i18n';

export const loginFormScheme = (intl: ReturnType<typeof useIntl>) =>
  z.object({
    email: z
      .string()
      .min(1, {
        message: intl.t('page.auth.login.input.email.helperText.required'),
      })
      .email({
        message: intl.t('page.auth.login.input.email.helperText.invalidFormat'),
      }),
    password: z.string().min(1, {
      message: intl.t('page.auth.login.input.password.helperText.required'),
    }),
  });

export type LoginFormScheme = z.infer<ReturnType<typeof loginFormScheme>>;
