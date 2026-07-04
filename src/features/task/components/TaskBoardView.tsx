import { DndContext, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { useState } from 'react'
import { useTasks } from '../api/useTasks'
import { useStatuses } from '../api/useStatuses'
import { useUpdateTaskStatus } from '../api/useUpdateTaskStatus'
import { PriorityIcon } from './PriorityIcon'
import type { Task } from '../types/task'

interface TaskBoardViewProps {
  workspaceId: string
  spaceId: string
  listId: string
}

function TaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  })

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, opacity: isDragging ? 0.4 : 1 }
    : undefined

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="rounded-lg border border-[var(--color-border)] p-3 mb-2 cursor-grab active:cursor-grabbing"
      style={{ ...style, backgroundColor: 'var(--color-base-100)' }}
    >
      <p className="text-sm text-[var(--color-base-content)] mb-2">{task.title}</p>
      <div className="flex items-center justify-between">
        <PriorityIcon priority={task.priority} />
        {task.due_date && (
          <span className="text-xs text-[var(--color-base-content)] opacity-50">
            {new Date(task.due_date).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  )
}

function BoardColumn({ statusId, name, color, tasks }: { statusId: string; name: string; color: string; tasks: Task[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: statusId })

  return (
    <div
      ref={setNodeRef}
      className="w-72 shrink-0 rounded-xl p-2 transition-colors"
      style={{ backgroundColor: isOver ? 'var(--color-base-200)' : 'transparent' }}
    >
      <div className="flex items-center gap-2 px-2 py-2 mb-1">
        <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
        <span className="text-sm font-semibold text-[var(--color-base-content)]">{name}</span>
        <span className="text-xs text-[var(--color-base-content)] opacity-40">{tasks.length}</span>
      </div>
      <div className="min-h-[40px]">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  )
}

export function TaskBoardView({ workspaceId, spaceId, listId }: TaskBoardViewProps) {
  const { data: tasksData, isLoading: tasksLoading } = useTasks(workspaceId, spaceId, listId)
  const { data: statusesData, isLoading: statusesLoading } = useStatuses(workspaceId)
  const updateStatus = useUpdateTaskStatus()
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const tasks = tasksData?.data ?? []
  const statuses = statusesData?.data ?? []

  if (tasksLoading || statusesLoading) {
    return (
      <div className="flex items-center justify-center h-40 text-[var(--color-base-content)] opacity-50 text-sm">
        Loading board…
      </div>
    )
  }

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id)
    setActiveTask(task ?? null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null)
    const { active, over } = event
    if (!over) return
    const taskId = active.id as string
    const newStatusId = over.id as string
    const task = tasks.find((t) => t.id === taskId)
    if (task && task.status_id !== newStatusId) {
      updateStatus.mutate({ taskId, payload: { status_id: newStatusId } })
    }
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-3 p-4 overflow-x-auto h-full">
        {statuses.map((status) => (
          <BoardColumn
            key={status.id}
            statusId={status.id}
            name={status.name}
            color={status.color}
            tasks={tasks.filter((t) => t.status_id === status.id)}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask && (
          <div className="rounded-lg border border-[var(--color-border)] p-3 shadow-xl" style={{ backgroundColor: 'var(--color-base-100)', width: '272px' }}>
            <p className="text-sm text-[var(--color-base-content)]">{activeTask.title}</p>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
