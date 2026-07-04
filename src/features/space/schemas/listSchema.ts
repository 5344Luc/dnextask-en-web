import { z } from 'zod'

export const createListSchema = z.object({
  name: z.string().min(1, 'List name is required').max(100),
  color: z.string(),
  folder_id: z.string().uuid().optional().nullable(),
})

export type CreateListFormValues = z.infer<typeof createListSchema>
