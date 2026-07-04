import { Link } from '@tanstack/react-router'
import { useTasks } from '../api/useTasks'
import { StatusBadge } from './StatusBadge'
import { PriorityIcon } from './PriorityIcon'

interface TaskListViewProps {
  workspaceId: string
  spaceId: string
  listId: string
}

export function TaskListView({ workspaceId, spaceId, listId }: TaskListViewProps) {
  const { data, isLoading, isError } = useTasks(workspaceId, spaceId, listId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40 text-[var(--color-base-content)] opacity-50 text-sm">
        Loading tasks…
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-40 text-[var(--color-error)] text-sm">
        Could not load tasks.
      </div>
    )
  }

  const tasks = data?.data ?? []

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-60 gap-2">
        <i className="fi fi-rr-check-double text-[var(--color-base-content)] opacity-30" style={{ fontSize: '32px' }} />
        <p className="text-sm text-[var(--color-base-content)] opacity-50">No tasks yet.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-[1fr_140px_100px_120px] gap-3 px-4 py-2 text-xs font-semibold text-[var(--color-base-content)] opacity-50 uppercase tracking-wide border-b border-[var(--color-border)]">
        <span>Task</span>
        <span>Status</span>
        <span>Priority</span>
        <span>Due date</span>
      </div>

      {tasks.map((task) => (
        <Link
          key={task.id}
          to="/workspaces/$workspaceId/spaces/$spaceId/lists/$listId/tasks/$taskId"
          params={{ workspaceId, spaceId, listId, taskId: task.id }}
          className="grid grid-cols-[1fr_140px_100px_120px] gap-3 px-4 py-3 items-center border-b border-[var(--color-border)] hover:bg-[var(--color-base-200)] transition-colors"
        >
          <span className={`text-sm text-[var(--color-base-content)] truncate ${task.is_completed ? 'line-through opacity-50' : ''}`}>
            {task.title}
          </span>
          <StatusBadge status={task.status} />
          <PriorityIcon priority={task.priority} />
          <span className="text-xs text-[var(--color-base-content)] opacity-60">
            {task.due_date ? new Date(task.due_date).toLocaleDateString() : '—'}
          </span>
        </Link>
      ))}
    </div>
  )
}
