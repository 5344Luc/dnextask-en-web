import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../../../lib/api'
import type { ApiResponse, TaskList } from '../../../types'

export function useLists(workspaceId: string, spaceId: string) {
  return useQuery({
    queryKey: ['lists', spaceId],
    queryFn:  () => apiFetch<ApiResponse<TaskList[]>>(`/v1/workspaces/${workspaceId}/spaces/${spaceId}/lists`),
    enabled:  !!spaceId,
  })
}
