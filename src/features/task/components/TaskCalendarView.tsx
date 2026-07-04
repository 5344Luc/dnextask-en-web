import { useMemo, useState } from 'react'
import { useTasks } from '../api/useTasks'
import { StatusBadge } from './StatusBadge'
import type { Task } from '../types/task'

interface TaskCalendarViewProps {
  workspaceId: string
  spaceId: string
  listId: string
}

function getMonthGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1)
  const startOffset = firstDay.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (Date | null)[] = []

  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))
  while (cells.length % 7 !== 0) cells.push(null)

  return cells
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function TaskCalendarView({ workspaceId, spaceId, listId }: TaskCalendarViewProps) {
  const { data, isLoading } = useTasks(workspaceId, spaceId, listId)
  const [cursor, setCursor] = useState(new Date())

  const tasks = data?.data ?? []
  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const cells = useMemo(() => getMonthGrid(year, month), [year, month])

  const tasksByDay = useMemo(() => {
    const map = new Map<string, Task[]>()
    tasks.forEach((task) => {
      if (!task.due_date) return
      const key = new Date(task.due_date).toDateString()
      const existing = map.get(key) ?? []
      existing.push(task)
      map.set(key, existing)
    })
    return map
  }, [tasks])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40 text-[var(--color-base-content)] opacity-50 text-sm">
        Loading calendar…
      </div>
    )
  }

  const monthLabel = cursor.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
  const today = new Date()

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-[var(--color-base-content)]">{monthLabel}</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCursor(new Date(year, month - 1, 1))}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-[var(--color-base-content)] opacity-60 hover:opacity-100 hover:bg-[var(--color-base-200)] transition-colors"
          >
            <i className="fi fi-rr-angle-small-left" style={{ fontSize: '16px' }} />
          </button>
          <button
            onClick={() => setCursor(new Date())}
            className="px-3 h-8 flex items-center justify-center rounded-lg text-sm text-[var(--color-base-content)] hover:bg-[var(--color-base-200)] transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => setCursor(new Date(year, month + 1, 1))}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-[var(--color-base-content)] opacity-60 hover:opacity-100 hover:bg-[var(--color-base-200)] transition-colors"
          >
            <i className="fi fi-rr-angle-small-right" style={{ fontSize: '16px' }} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="text-xs font-semibold text-[var(--color-base-content)] opacity-50 text-center py-2">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px flex-1 border border-[var(--color-border)] rounded-lg overflow-hidden">
        {cells.map((date, i) => {
          const dayTasks = date ? tasksByDay.get(date.toDateString()) ?? [] : []
          const isToday = date && isSameDay(date, today)

          return (
            <div
              key={i}
              className="p-1.5 min-h-[90px] border-[var(--color-border)]"
              style={{
                backgroundColor: date ? 'var(--color-base-100)' : 'var(--color-base-200)',
                borderRightWidth: '1px',
                borderBottomWidth: '1px',
              }}
            >
              {date && (
                <>
                  <span
                    className={`text-xs font-medium inline-flex h-5 w-5 items-center justify-center rounded-full ${
                      isToday ? 'text-white' : 'text-[var(--color-base-content)] opacity-70'
                    }`}
                    style={isToday ? { backgroundColor: 'var(--color-primary)' } : undefined}
                  >
                    {date.getDate()}
                  </span>
                  <div className="mt-1 flex flex-col gap-0.5">
                    {dayTasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className="text-[11px] px-1.5 py-0.5 rounded truncate text-white"
                        style={{ backgroundColor: task.status?.color ?? '#6b7280' }}
                        title={task.title}
                      >
                        {task.title}
                      </div>
                    ))}
                    {dayTasks.length > 3 && (
                      <span className="text-[10px] text-[var(--color-base-content)] opacity-50 px-1.5">
                        +{dayTasks.length - 3} more
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
