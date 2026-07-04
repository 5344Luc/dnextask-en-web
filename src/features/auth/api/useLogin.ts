import { useMutation } from '@tanstack/react-query'
import { apiFetch } from '../../../lib/api'
import { useAuthStore } from '../../../stores/authStore'
import type { ApiResponse } from '../../../types'
import type { LoginFormValues } from '../schemas/loginSchema'
import type { LoginResponse } from '../types/auth.types'

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation({
    mutationFn: (payload: LoginFormValues) =>
      apiFetch<ApiResponse<LoginResponse>>('/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email:       payload.email,
          password:    payload.password,
          device_name: 'web',
        }),
      }),
    onSuccess: (response) => {
      setAuth(response.data.access_token, response.data.user)
    },
  })
}
