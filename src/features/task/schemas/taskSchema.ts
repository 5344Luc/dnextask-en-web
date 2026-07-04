import { z } from 'zod'

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(255),
  description: z.string().optional(),
  priority: z.enum(['urgent', 'high', 'normal', 'low']).optional(),
  due_date: z.string().optional(),
})

export type CreateTaskFormValues = z.infer<typeof createTaskSchema>
