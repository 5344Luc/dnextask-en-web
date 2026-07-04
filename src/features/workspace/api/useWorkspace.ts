import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../../../lib/api'
import type { ApiResponse, Workspace } from '../../../types'

export function useWorkspace(workspaceId: string) {
  return useQuery({
    queryKey: ['workspaces', workspaceId],
    queryFn:  () => apiFetch<ApiResponse<Workspace>>(`/v1/workspaces/${workspaceId}`),
    enabled:  !!workspaceId,
  })
}
