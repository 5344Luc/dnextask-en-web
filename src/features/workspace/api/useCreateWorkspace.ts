import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '../../../lib/api'
import type { ApiResponse, Workspace } from '../../../types'
import type { CreateWorkspaceFormValues } from '../schemas/workspaceSchema'

export function useCreateWorkspace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateWorkspaceFormValues) =>
      apiFetch<ApiResponse<Workspace>>('/v1/workspaces', {
        method: 'POST',
        body:   JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] })
    },
  })
}
