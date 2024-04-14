import * as z from 'zod';

import { useIntl } from '~/features/i18n';

export const registerFormScheme = (intl: ReturnType<typeof useIntl>) =>
  z
    .object({
      name: z
        .string()
        .min(1, {
          message: intl.t('page.auth.registration.input.name.helperText.required'),
        })
        .max(25, { message: intl.t('page.auth.registration.input.name.helperText.maxLength') }),
      email: z
        .string()
        .min(1, {
          message: intl.t('page.auth.registration.input.email.helperText.required'),
        })
        .email({
          message: intl.t('page.auth.registration.input.email.helperText.invalidFormat'),
        }),
      password: z.string().min(8, {
        message: intl.t('page.auth.registration.input.password.helperText.minCharacters', {
          number: 8,
        }),
      }),
    })
    .superRefine(({ password }, ctx) => {
      const containsUppercase = (char: string) => /[A-Z]/.test(char);
      const containsLowercase = (char: string) => /[a-z]/.test(char);
      const containsNumber = (char: string) => /[0-9]/.test(char);

      let countOfUppercase = 0;
      let countOfLowercase = 0;
      let countOfNumbers = 0;

      for (let i = 0; i < password.length; i += 1) {
        const char = password.charAt(i);
        if (containsUppercase(char)) countOfUppercase += 1;
        if (containsLowercase(char)) countOfLowercase += 1;
        if (containsNumber(char)) countOfNumbers += 1;
      }

      if (countOfLowercase < 1) {
        ctx.addIssue({
          code: 'custom',
          path: ['password'],
          message: intl.t('page.auth.registration.input.password.helperText.upperCase'),
        });
      }

      if (countOfUppercase < 1) {
        ctx.addIssue({
          code: 'custom',
          path: ['password'],
          message: intl.t('page.auth.registration.input.password.helperText.lowerCase'),
        });
      }

      if (countOfNumbers < 1) {
        ctx.addIssue({
          code: 'custom',
          path: ['password'],
          message: intl.t('page.auth.registration.input.password.helperText.minDigit', {
            number: 1,
          }),
        });
      }
    });

export type RegisterFormScheme = z.infer<ReturnType<typeof registerFormScheme>>;
