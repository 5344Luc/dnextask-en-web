import { ReactNode } from 'react'
import { NavRail } from './NavRail'
import { SecondarySidebar } from './SecondarySidebar'
import { TopBar } from './TopBar'
import type { Workspace } from '../../types'

interface AppShellProps {
  workspace:      Workspace
  sidebarTitle:   string
  sidebarContent?: ReactNode
  children:        ReactNode
}

export function AppShell({ workspace, sidebarTitle, sidebarContent, children }: AppShellProps) {
  return (
    <div className="h-screen w-full flex bg-[var(--color-background)] overflow-hidden">
      <NavRail workspaceId={workspace.id} />
      <SecondarySidebar title={sidebarTitle}>{sidebarContent}</SecondarySidebar>
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar workspace={workspace} />
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
