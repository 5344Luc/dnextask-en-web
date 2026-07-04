import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '../../../lib/api'

export function useDeleteFolder(workspaceId: string, spaceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (folderId: string) =>
      apiFetch<void>(`/v1/workspaces/${workspaceId}/spaces/${spaceId}/folders/${folderId}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders', spaceId] })
    },
  })
}
