import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '../../../lib/api'
import type { ApiResponse, Space } from '../../../types'
import type { CreateSpaceFormValues } from '../schemas/spaceSchema'

export function useCreateSpace(workspaceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateSpaceFormValues) =>
      apiFetch<ApiResponse<Space>>(`/v1/workspaces/${workspaceId}/spaces`, {
        method: 'POST',
        body:   JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spaces', workspaceId] })
    },
  })
}
