import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { apiFetch } from '../../../lib/api'
import { useAuthStore } from '../../../stores/authStore'

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const navigate   = useNavigate()

  return useMutation({
    mutationFn: () =>
      apiFetch('/v1/auth/logout', { method: 'POST' }),
    onSettled: () => {
      // Clear auth regardless of success/failure (token may already be invalid)
      clearAuth()
      navigate({ to: '/login' })
    },
  })
}
