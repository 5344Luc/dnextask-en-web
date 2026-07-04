import { useQuery } from '@tanstack/react-query'
import { api } from '../../../lib/api'
import type { TaskListResponse } from '../types/task'

export function useTasks(workspaceId: string, spaceId: string, listId: string) {
  return useQuery({
    queryKey: ['tasks', workspaceId, spaceId, listId],
    queryFn: () =>
      api.get<TaskListResponse>(
        `/v1/workspaces/${workspaceId}/spaces/${spaceId}/lists/${listId}/tasks`
      ),
    enabled: !!workspaceId && !!spaceId && !!listId,
  })
}
