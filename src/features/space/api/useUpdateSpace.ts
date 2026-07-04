import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '../../../lib/api'
import type { ApiResponse, Space } from '../../../types'

interface UpdateSpacePayload {
  name?: string
  description?: string
  color?: string
  is_private?: boolean
}

export function useUpdateSpace(workspaceId: string, spaceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateSpacePayload) =>
      apiFetch<ApiResponse<Space>>(`/v1/workspaces/${workspaceId}/spaces/${spaceId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spaces', workspaceId] })
    },
  })
}
