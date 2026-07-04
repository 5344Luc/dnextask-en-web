import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '../../../lib/api'
import type { ApiResponse, Folder } from '../../../types'

interface CreateFolderPayload {
  name: string
}

export function useCreateFolder(workspaceId: string, spaceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateFolderPayload) =>
      apiFetch<ApiResponse<Folder>>(`/v1/workspaces/${workspaceId}/spaces/${spaceId}/folders`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders', spaceId] })
    },
  })
}
