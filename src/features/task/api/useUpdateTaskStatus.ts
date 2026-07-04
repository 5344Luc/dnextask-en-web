import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../../lib/api'
import type { UpdateTaskStatusPayload, TaskDetailResponse } from '../types/task'

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, payload }: { taskId: string; payload: UpdateTaskStatusPayload }) =>
      api.patch<TaskDetailResponse>(`/v1/tasks/${taskId}/status`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}
