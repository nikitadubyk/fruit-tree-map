import { z } from 'zod';

export const schema = z.object({
  name: z.string('Введите имя'),
});

export type FormValues = z.infer<typeof schema>;
