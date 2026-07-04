import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../../lib/api'
import type { UpdateTaskPayload, TaskDetailResponse } from '../types/task'

export function useUpdateTask(
  workspaceId: string,
  spaceId: string,
  listId: string,
  taskId: string
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateTaskPayload) =>
      api.put<TaskDetailResponse>(
        `/v1/workspaces/${workspaceId}/spaces/${spaceId}/lists/${listId}/tasks/${taskId}`,
        payload
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', workspaceId, spaceId, listId] })
      queryClient.invalidateQueries({ queryKey: ['task', taskId] })
    },
  })
}
