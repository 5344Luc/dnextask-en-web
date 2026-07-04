import { type ReactNode } from 'react'
import { useSidebarStore } from '../../stores/sidebarStore'

interface SecondarySidebarProps {
  title: string
  children?: ReactNode
}

export function SecondarySidebar({ title, children }: SecondarySidebarProps) {
  const { isSecondaryOpen, toggleSecondary } = useSidebarStore()

  return (
    <div
      className="h-full flex flex-col border-r border-[var(--color-border)] shrink-0 overflow-hidden transition-[width] duration-200 ease-in-out"
      style={{
        width: isSecondaryOpen ? '240px' : '0px',
        backgroundColor: 'var(--color-base-100)',
      }}
    >
      <div
        className="w-60 h-full flex flex-col transition-opacity duration-150 ease-in-out"
        style={{ opacity: isSecondaryOpen ? 1 : 0 }}
      >
        <div className="flex items-center justify-between h-14 px-4 border-b border-[var(--color-border)] shrink-0">
          <h2 className="text-sm font-semibold text-[var(--color-base-content)]">{title}</h2>
          <button
            onClick={toggleSecondary}
            className="h-7 w-7 flex items-center justify-center rounded-lg text-[var(--color-base-content)] opacity-60 hover:opacity-100 hover:bg-[var(--color-base-200)] transition-colors"
            title="Collapse sidebar"
          >
            <i className="fi fi-rr-angle-double-small-left" style={{ fontSize: '15px' }} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {children ?? (
            <p className="text-sm text-[var(--color-base-content)] opacity-60 px-2 py-4">
              Nothing here yet.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
