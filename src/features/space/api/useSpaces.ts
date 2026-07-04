import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../../../lib/api'
import type { ApiResponse, Space } from '../../../types'

export function useSpaces(workspaceId: string) {
  return useQuery({
    queryKey: ['spaces', workspaceId],
    queryFn:  () => apiFetch<ApiResponse<Space[]>>(`/v1/workspaces/${workspaceId}/spaces`),
    enabled:  !!workspaceId,
  })
}
