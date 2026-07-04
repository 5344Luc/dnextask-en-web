import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../../../lib/api'
import type { ApiResponse, Folder } from '../../../types'

export function useFolders(workspaceId: string, spaceId: string) {
  return useQuery({
    queryKey: ['folders', spaceId],
    queryFn:  () => apiFetch<ApiResponse<Folder[]>>(`/v1/workspaces/${workspaceId}/spaces/${spaceId}/folders`),
    enabled:  !!spaceId,
  })
}
