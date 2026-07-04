import { useWorkspace } from '../api/useWorkspace'
import WorkspaceHome from './WorkspaceHome'

export default function WorkspaceLoader({ workspaceId }: { workspaceId: string }) {
  const { data, isLoading, isError } = useWorkspace(workspaceId)

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[var(--color-background)]">
        <span className="h-6 w-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[var(--color-background)]">
        <p className="text-[var(--color-text-muted)]">Workspace not found.</p>
      </div>
    )
  }

  return <WorkspaceHome workspace={data.data} />
}
