import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../../lib/api'

export function useDeleteTask(workspaceId: string, spaceId: string, listId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (taskId: string) =>
      api.delete(
        `/v1/workspaces/${workspaceId}/spaces/${spaceId}/lists/${listId}/tasks/${taskId}`
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', workspaceId, spaceId, listId] })
    },
  })
}
