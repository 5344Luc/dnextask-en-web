import { useState } from 'react'
import { TaskListView } from './TaskListView'
import { TaskBoardView } from './TaskBoardView'
import { TaskCalendarView } from './TaskCalendarView'
import { TaskGanttView } from './TaskGanttView'
import { CreateTaskModal } from './CreateTaskModal'

interface TaskViewTabsProps {
  workspaceId: string
  spaceId: string
  listId: string
}

type ViewType = 'list' | 'board' | 'calendar' | 'gantt'

const VIEWS: { key: ViewType; label: string; icon: string }[] = [
  { key: 'list',     label: 'List',     icon: 'fi fi-rr-list' },
  { key: 'board',    label: 'Board',    icon: 'fi fi-rr-apps' },
  { key: 'calendar', label: 'Calendar', icon: 'fi fi-rr-calendar' },
  { key: 'gantt',    label: 'Gantt',    icon: 'fi fi-rr-chart-histogram' },
]

export function TaskViewTabs({ workspaceId, spaceId, listId }: TaskViewTabsProps) {
  const [activeView, setActiveView] = useState<ViewType>('list')
  const [createModalOpen, setCreateModalOpen] = useState(false)

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 h-11 border-b border-[var(--color-border)] shrink-0">
        <div className="flex items-center gap-1">
          {VIEWS.map((view) => (
            <button
              key={view.key}
              onClick={() => setActiveView(view.key)}
              className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: activeView === view.key ? 'var(--color-base-200)' : 'transparent',
                color: 'var(--color-base-content)',
                opacity: activeView === view.key ? 1 : 0.6,
              }}
            >
              <i className={view.icon} style={{ fontSize: '14px' }} />
              {view.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-sm font-medium text-white transition-colors"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <i className="fi fi-rr-plus" style={{ fontSize: '12px' }} />
          Create task
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeView === 'list' && <TaskListView workspaceId={workspaceId} spaceId={spaceId} listId={listId} />}
        {activeView === 'board' && <TaskBoardView workspaceId={workspaceId} spaceId={spaceId} listId={listId} />}
        {activeView === 'calendar' && <TaskCalendarView workspaceId={workspaceId} spaceId={spaceId} listId={listId} />}
        {activeView === 'gantt' && <TaskGanttView workspaceId={workspaceId} spaceId={spaceId} listId={listId} />}
      </div>

      <CreateTaskModal
        workspaceId={workspaceId}
        spaceId={spaceId}
        listId={listId}
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  )
}
