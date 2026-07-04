import { useQuery } from '@tanstack/react-query'
import { api } from '../../../lib/api'
import type { TaskDetailResponse } from '../types/task'

export function useTask(
  workspaceId: string,
  spaceId: string,
  listId: string,
  taskId: string
) {
  return useQuery({
    queryKey: ['task', taskId],
    queryFn: () =>
      api.get<TaskDetailResponse>(
        `/v1/workspaces/${workspaceId}/spaces/${spaceId}/lists/${listId}/tasks/${taskId}`
      ),
    enabled: !!taskId,
  })
}
