import { z } from 'zod';
export const productFilterSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  sort: z.enum(['newest', 'price_asc', 'price_desc', 'name']).optional(),
});
export type ProductFilterInput = z.infer<typeof productFilterSchema>;
