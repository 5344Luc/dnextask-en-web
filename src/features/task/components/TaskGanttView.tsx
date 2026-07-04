import { useMemo } from 'react'
import { useTasks } from '../api/useTasks'
import type { Task } from '../types/task'

interface TaskGanttViewProps {
  workspaceId: string
  spaceId: string
  listId: string
}

const DAY_WIDTH = 32

function daysBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
}

export function TaskGanttView({ workspaceId, spaceId, listId }: TaskGanttViewProps) {
  const { data, isLoading } = useTasks(workspaceId, spaceId, listId)
  const tasks = (data?.data ?? []).filter((t) => t.start_date || t.due_date)

  const { rangeStart, days } = useMemo(() => {
    if (tasks.length === 0) {
      const today = new Date()
      return { rangeStart: today, days: 30 }
    }
    const dates = tasks.flatMap((t) => [
      t.start_date ? new Date(t.start_date) : null,
      t.due_date ? new Date(t.due_date) : null,
    ]).filter((d): d is Date => d !== null)

    const min = new Date(Math.min(...dates.map((d) => d.getTime())))
    const max = new Date(Math.max(...dates.map((d) => d.getTime())))
    min.setDate(min.getDate() - 2)
    max.setDate(max.getDate() + 5)

    return { rangeStart: min, days: Math.max(daysBetween(min, max), 14) }
  }, [tasks])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40 text-[var(--color-base-content)] opacity-50 text-sm">
        Loading timeline…
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-60 gap-2">
        <i className="fi fi-rr-time-past text-[var(--color-base-content)] opacity-30" style={{ fontSize: '32px' }} />
        <p className="text-sm text-[var(--color-base-content)] opacity-50">No dated tasks to show on the timeline.</p>
      </div>
    )
  }

  const dateHeaders = Array.from({ length: days }, (_, i) => {
    const d = new Date(rangeStart)
    d.setDate(d.getDate() + i)
    return d
  })

  const today = new Date()
  const todayOffset = daysBetween(rangeStart, today)

  return (
    <div className="h-full overflow-auto">
      <div className="flex" style={{ minWidth: `${240 + days * DAY_WIDTH}px` }}>
        <div className="w-60 shrink-0 sticky left-0 z-10" style={{ backgroundColor: 'var(--color-base-100)' }}>
          <div className="h-10 border-b border-[var(--color-border)] flex items-center px-3">
            <span className="text-xs font-semibold text-[var(--color-base-content)] opacity-50 uppercase">Task</span>
          </div>
          {tasks.map((task) => (
            <div
              key={task.id}
              className="h-11 flex items-center px-3 border-b border-[var(--color-border)] text-sm text-[var(--color-base-content)] truncate"
            >
              {task.title}
            </div>
          ))}
        </div>

        <div className="relative flex-1">
          <div className="flex h-10 border-b border-[var(--color-border)]">
            {dateHeaders.map((d, i) => (
              <div
                key={i}
                className="shrink-0 flex flex-col items-center justify-center text-[10px] text-[var(--color-base-content)] opacity-50 border-r border-[var(--color-border)]"
                style={{ width: DAY_WIDTH }}
              >
                <span>{d.toLocaleDateString(undefined, { weekday: 'narrow' })}</span>
                <span className="font-medium">{d.getDate()}</span>
              </div>
            ))}
          </div>

          {todayOffset >= 0 && todayOffset < days && (
            <div
              className="absolute top-0 bottom-0 w-px z-10"
              style={{ left: todayOffset * DAY_WIDTH + DAY_WIDTH / 2, backgroundColor: 'var(--color-error)' }}
            />
          )}

          {tasks.map((task) => {
            const start = task.start_date ? new Date(task.start_date) : task.due_date ? new Date(task.due_date) : rangeStart
            const end = task.due_date ? new Date(task.due_date) : start
            const offset = Math.max(daysBetween(rangeStart, start), 0)
            const span = Math.max(daysBetween(start, end) + 1, 1)

            return (
              <div key={task.id} className="h-11 relative border-b border-[var(--color-border)]">
                <div
                  className="absolute top-2 h-7 rounded-md flex items-center px-2 text-[11px] text-white truncate shadow-sm"
                  style={{
                    left: offset * DAY_WIDTH,
                    width: span * DAY_WIDTH - 4,
                    backgroundColor: task.status?.color ?? 'var(--color-primary)',
                  }}
                  title={task.title}
                >
                  {task.title}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
