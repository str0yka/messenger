import * as z from 'zod';

import { useIntl } from '~/features/i18n';

export const verifyFormScheme = (intl: ReturnType<typeof useIntl>) =>
  z.object({
    verificationCode: z
      .string()
      .min(4, { message: intl.t('page.verify.input.code.helperText.codeLength', { number: 4 }) })
      .max(4, { message: intl.t('page.verify.input.code.helperText.codeLength', { number: 4 }) }),
  });

export type VerifyFormScheme = z.infer<ReturnType<typeof verifyFormScheme>>;
