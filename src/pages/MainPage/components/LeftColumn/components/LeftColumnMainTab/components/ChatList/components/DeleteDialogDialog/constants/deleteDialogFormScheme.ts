import * as z from 'zod';

export const deleteDialogFormScheme = z.object({
  deleteForEveryone: z.boolean(),
});

export type DeleteDialogFormScheme = z.infer<typeof deleteDialogFormScheme>;
