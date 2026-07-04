import { AppShell } from '../../../components/layout/AppShell'
import { SpaceTree } from '../../space/components/SpaceTree'
import { useWorkspace } from '../../workspace/api/useWorkspace'
import { TaskViewTabs } from './TaskViewTabs'

interface TaskListPageProps {
  workspaceId: string
  spaceId: string
  listId: string
}

export default function TaskListPage({ workspaceId, spaceId, listId }: TaskListPageProps) {
  const { data, isLoading, isError } = useWorkspace(workspaceId)

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-base-100)' }}>
        <span className="h-6 w-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="h-screen w-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-base-100)' }}>
        <p className="text-[var(--color-base-content)] opacity-60">Workspace not found.</p>
      </div>
    )
  }

  return (
    <AppShell
      workspace={data.data}
      sidebarTitle="Overview"
      sidebarContent={<SpaceTree workspaceId={workspaceId} />}
    >
      <TaskViewTabs workspaceId={workspaceId} spaceId={spaceId} listId={listId} />
    </AppShell>
  )
}
