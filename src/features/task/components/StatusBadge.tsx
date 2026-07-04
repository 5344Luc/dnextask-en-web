import type { TaskStatus } from '../types/task'

export function StatusBadge({ status }: { status?: TaskStatus }) {
  if (!status) {
    return (
      <span className="text-xs px-2 py-0.5 rounded-full text-[var(--color-base-content)] opacity-50 border border-[var(--color-border)]">
        No status
      </span>
    )
  }
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full font-medium text-white"
      style={{ backgroundColor: status.color }}
    >
      {status.name}
    </span>
  )
}
