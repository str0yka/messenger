import * as z from 'zod';

export const sendMessageFormScheme = z.object({
  text: z.string(),
});

export type SendMessageFormScheme = z.infer<typeof sendMessageFormScheme>;
