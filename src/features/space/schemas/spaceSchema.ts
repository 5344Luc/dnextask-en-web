import { z } from 'zod'

export const createSpaceSchema = z.object({
  name:        z.string().min(1, 'Space name is required').max(100),
  description: z.string().max(500).optional(),
  color:       z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#16A34A'),
  is_private:  z.boolean().default(false),
})

export type CreateSpaceFormValues = z.infer<typeof createSpaceSchema>
