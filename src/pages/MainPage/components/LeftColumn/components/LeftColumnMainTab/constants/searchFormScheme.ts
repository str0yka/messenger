import * as z from 'zod';

export const searchFormScheme = z.object({
  query: z.string(),
});

export type SearchFormScheme = z.infer<typeof searchFormScheme>;
