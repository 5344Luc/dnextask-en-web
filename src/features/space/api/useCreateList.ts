import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '../../../lib/api'
import type { ApiResponse, TaskList } from '../../../types'
import type { CreateListFormValues } from '../schemas/listSchema'

export function useCreateList(workspaceId: string, spaceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateListFormValues) =>
      apiFetch<ApiResponse<TaskList>>(`/v1/workspaces/${workspaceId}/spaces/${spaceId}/lists`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists', spaceId] })
    },
  })
}
