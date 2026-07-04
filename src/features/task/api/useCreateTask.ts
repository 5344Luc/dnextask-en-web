import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../../lib/api'
import type { CreateTaskPayload, TaskDetailResponse } from '../types/task'

export function useCreateTask(workspaceId: string, spaceId: string, listId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateTaskPayload) =>
      api.post<TaskDetailResponse>(
        `/v1/workspaces/${workspaceId}/spaces/${spaceId}/lists/${listId}/tasks`,
        payload
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', workspaceId, spaceId, listId] })
    },
  })
}
