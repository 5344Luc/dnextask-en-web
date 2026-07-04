import { z } from 'zod'

export const registerSchema = z
  .object({
    first_name:            z.string().min(1, 'First name is required').max(100),
    last_name:             z.string().min(1, 'Last name is required').max(100),
    email:                 z.string().min(1, 'Email is required').email('Enter a valid email'),
    password:              z.string().min(8, 'Password must be at least 8 characters'),
    password_confirmation: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match',
    path:    ['password_confirmation'],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>
