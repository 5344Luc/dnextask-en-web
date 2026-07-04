import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../../../lib/api'
import { useAuthStore } from '../../../stores/authStore'
import type { ApiResponse, User } from '../../../types'

export function useMe() {
  const token = useAuthStore((s) => s.token)

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn:  () => apiFetch<ApiResponse<User>>('/v1/auth/me'),
    enabled:  !!token,
    retry:    false,
  })
}
