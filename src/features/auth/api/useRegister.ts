import { useMutation } from '@tanstack/react-query'
import { apiFetch } from '../../../lib/api'
import type { ApiResponse, User } from '../../../types'
import type { RegisterFormValues } from '../schemas/registerSchema'

export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterFormValues) =>
      apiFetch<ApiResponse<User>>('/v1/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          first_name:            payload.first_name,
          last_name:             payload.last_name,
          email:                 payload.email,
          password:              payload.password,
          password_confirmation: payload.password_confirmation,
          timezone:              Intl.DateTimeFormat().resolvedOptions().timeZone,
          locale:                'en',
        }),
      }),
  })
}
