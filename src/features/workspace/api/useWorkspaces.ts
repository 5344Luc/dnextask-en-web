import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../../../lib/api'
import type { ApiResponse, Workspace } from '../../../types'

export function useWorkspaces() {
  return useQuery({
    queryKey: ['workspaces'],
    queryFn:  () => apiFetch<ApiResponse<Workspace[]>>('/v1/workspaces'),
  })
}
