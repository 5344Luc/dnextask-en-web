import { z } from 'zod'

export const createWorkspaceSchema = z.object({
  name:        z.string().min(1, 'Workspace name is required').max(100),
  description: z.string().max(500).optional(),
  color:       z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Pick a valid color').default('#16A34A'),
})

export type CreateWorkspaceFormValues = z.infer<typeof createWorkspaceSchema>
