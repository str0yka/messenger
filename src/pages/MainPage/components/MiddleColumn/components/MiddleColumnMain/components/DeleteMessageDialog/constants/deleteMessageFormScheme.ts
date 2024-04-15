import * as z from 'zod';

export const deleteMessageFormScheme = z.object({
  deleteForEveryone: z.boolean(),
});

export type DeleteMessageFormScheme = z.infer<typeof deleteMessageFormScheme>;
