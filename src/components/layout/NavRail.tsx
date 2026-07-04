import { Link, useMatchRoute } from '@tanstack/react-router'
import { useSidebarStore } from '../../stores/sidebarStore'

interface NavRailProps {
  workspaceId: string
}

const navItems = [
  { icon: 'fi-rr-home',          label: 'Home',          path: '' },
  { icon: 'fi-rr-check-double',  label: 'Tasks',         path: '/tasks' },
  { icon: 'fi-rr-target',        label: 'Goals',         path: '/goals' },
  { icon: 'fi-rr-document',      label: 'Docs',          path: '/docs' },
  { icon: 'fi-rr-comment-alt',   label: 'Chat',          path: '/chat' },
  { icon: 'fi-rr-clock',         label: 'Time Tracking', path: '/time-tracking' },
]

export function NavRail({ workspaceId }: NavRailProps) {
  const matchRoute = useMatchRoute()
  const { isSecondaryOpen, toggleSecondary } = useSidebarStore()

  return (
    <div className="w-14 h-full flex flex-col items-center bg-[var(--color-base-100)] border-r border-[var(--color-border)] py-4 gap-1 shrink-0">
      <Link to="/workspaces" className="shrink-0">
        <div
          className="h-10 w-10 rounded-[10px] flex items-center justify-center text-white font-bold text-base shadow-sm"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          N
        </div>
      </Link>

      <div
        className="w-full overflow-hidden transition-[height,opacity] duration-200 ease-in-out flex justify-center"
        style={{
          height: isSecondaryOpen ? '0px' : '40px',
          opacity: isSecondaryOpen ? 0 : 1,
          marginTop: isSecondaryOpen ? '0px' : '4px',
        }}
      >
        <button
          onClick={toggleSecondary}
          className="flex items-center justify-center h-10 w-10 rounded-[10px] text-white transition-all shrink-0"
          style={{ backgroundColor: 'var(--color-primary)' }}
          title="Expand sidebar"
        >
          <i className="fi fi-rr-angle-double-small-right" style={{ fontSize: '16px' }} />
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-1 w-full px-2 mt-1">
        {navItems.map(({ icon, label, path }) => {
          const fullPath = `/workspaces/${workspaceId}${path}`
          const isActive = !!matchRoute({ to: fullPath, fuzzy: path === '' ? false : true })
          return (
            <Link
              key={label}
              to={fullPath}
              className={`group relative flex items-center justify-center h-10 w-10 mx-auto rounded-[10px] transition-all shrink-0 ${
                isActive
                  ? 'bg-[var(--color-primary)] text-[var(--color-primary-content)] shadow-md shadow-[var(--color-primary)]/25'
                  : 'text-[var(--color-base-content)] opacity-60 hover:opacity-100 hover:bg-[var(--color-base-200)]'
              }`}
              title={label}
            >
              <i className={`fi ${icon}`} style={{ fontSize: '19px' }} />
              <span className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-[var(--color-neutral)] text-[var(--color-neutral-content)] text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                {label}
              </span>
            </Link>
          )
        })}
      </div>

      <div className="flex flex-col gap-1 w-full px-2">
        <Link
          to={`/workspaces/${workspaceId}/notifications`}
          className="group relative flex items-center justify-center h-10 w-10 mx-auto rounded-[10px] text-[var(--color-base-content)] opacity-60 hover:opacity-100 hover:bg-[var(--color-base-200)] transition-all"
          title="Notifications"
        >
          <i className="fi fi-rr-bell" style={{ fontSize: '19px' }} />
        </Link>
        <Link
          to={`/workspaces/${workspaceId}/settings/profile`}
          className="group relative flex items-center justify-center h-10 w-10 mx-auto rounded-[10px] text-[var(--color-base-content)] opacity-60 hover:opacity-100 hover:bg-[var(--color-base-200)] transition-all"
          title="Settings"
        >
          <i className="fi fi-rr-settings" style={{ fontSize: '19px' }} />
        </Link>
      </div>
    </div>
  )
}
