import * as z from 'zod';

import { useIntl } from '~/features/i18n';

export const updateProfileFormScheme = (intl: ReturnType<typeof useIntl>) =>
  z
    .object({
      name: z
        .string()
        .min(1, {
          message: intl.t('page.home.leftColumn.settings.profile.name.required'),
        })
        .max(25, {
          message: intl.t('page.home.leftColumn.settings.profile.name.maxLength', {
            number: 25,
          }),
        }),
      lastname: z.string().max(25, {
        message: intl.t('page.home.leftColumn.settings.profile.lastname.maxLength', {
          number: 25,
        }),
      }),
      bio: z.string().max(25, {
        message: intl.t('page.home.leftColumn.settings.profile.bio.maxLength', {
          number: 25,
        }),
      }),
      username: z
        .string()
        .max(25, {
          message: intl.t('page.home.leftColumn.settings.profile.username.maxLength', {
            number: 25,
          }),
        })
        .min(5, {
          message: intl.t('page.home.leftColumn.settings.profile.username.minLength', {
            number: 5,
          }),
        })
        .optional()
        .or(z.literal('')),
    })
    .superRefine(({ username }, ctx) => {
      if (!username) return;
      if (!/^[a-zA-Z0-9]*$/.test(username)) {
        ctx.addIssue({
          code: 'custom',
          path: ['username'],
          message: intl.t('page.home.leftColumn.settings.profile.username.format'),
        });
      }
    });

export type UpdateProfileFormScheme = z.infer<ReturnType<typeof updateProfileFormScheme>>;
