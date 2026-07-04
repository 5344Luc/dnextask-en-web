import type { User } from '../../../types'

export interface LoginResponse {
  access_token: string
  token_type:   string
  user:         User
}
