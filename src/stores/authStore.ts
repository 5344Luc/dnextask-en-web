import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'

interface AuthState {
  token: string | null
  user:  User | null
  setAuth:   (token: string, user: User) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user:  null,
      setAuth: (token, user) => {
        localStorage.setItem('auth_token', token)
        set({ token, user })
      },
      clearAuth: () => {
        localStorage.removeItem('auth_token')
        set({ token: null, user: null })
      },
    }),
    { name: 'auth-storage' },
  ),
)
