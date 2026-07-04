import { redirect } from '@tanstack/react-router'
import { useAuthStore } from '../stores/authStore'

/**
 * Use in beforeLoad of protected routes.
 * Redirects to /login if no token is present.
 */
export function requireAuth() {
  const token = useAuthStore.getState().token
  if (!token) {
    throw redirect({ to: '/login' })
  }
}

/**
 * Use in beforeLoad of auth routes (login/register).
 * Redirects to /workspaces if already authenticated.
 */
export function requireGuest() {
  const token = useAuthStore.getState().token
  if (token) {
    throw redirect({ to: '/workspaces' })
  }
}
