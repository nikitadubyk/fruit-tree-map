import { z } from 'zod';

export const schema = z.object({
  email: z.email('Введите корректный email'),
});

export type FormValues = z.infer<typeof schema>;
