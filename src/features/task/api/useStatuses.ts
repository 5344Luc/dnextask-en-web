import { useQuery } from '@tanstack/react-query'
import { api } from '../../../lib/api'
import type { TaskStatus } from '../types/task'

export function useStatuses(workspaceId: string) {
  return useQuery({
    queryKey: ['statuses', workspaceId],
    queryFn: () => api.get<{ data: TaskStatus[] }>(`/v1/workspaces/${workspaceId}/statuses`),
    enabled: !!workspaceId,
  })
}
