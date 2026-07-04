import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '../../../lib/api'

export function useDeleteSpace(workspaceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (spaceId: string) =>
      apiFetch<void>(`/v1/workspaces/${workspaceId}/spaces/${spaceId}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spaces', workspaceId] })
    },
  })
}
