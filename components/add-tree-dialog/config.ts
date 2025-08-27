import { z } from 'zod';

export const schema = z.object({
  species: z.string().min(3, 'Введите тип дерева'),
  note: z.string('Введите комментарий').optional(),
});

export type FormValues = z.infer<typeof schema>;
