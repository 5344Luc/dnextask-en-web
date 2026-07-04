import type { Task } from '../types/task'

const PRIORITY_CONFIG: Record<NonNullable<Task['priority']>, { icon: string; color: string }> = {
  urgent: { icon: 'fi fi-rr-flag', color: '#ef4444' },
  high:   { icon: 'fi fi-rr-angle-double-up', color: '#f59e0b' },
  normal: { icon: 'fi fi-rr-angle-up', color: '#3b82f6' },
  low:    { icon: 'fi fi-rr-angle-down', color: '#6b7280' },
}

export function PriorityIcon({ priority }: { priority: Task['priority'] }) {
  if (!priority) return null
  const config = PRIORITY_CONFIG[priority]
  return <i className={config.icon} style={{ fontSize: '14px', color: config.color }} title={priority} />
}
