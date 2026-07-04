import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '../../../lib/api'
import type { ApiResponse, Folder } from '../../../types'

interface UpdateFolderPayload {
  name: string
}

export function useUpdateFolder(workspaceId: string, spaceId: string, folderId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateFolderPayload) =>
      apiFetch<ApiResponse<Folder>>(`/v1/workspaces/${workspaceId}/spaces/${spaceId}/folders/${folderId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders', spaceId] })
    },
  })
}
