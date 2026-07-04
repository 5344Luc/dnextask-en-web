import { useNavigate } from '@tanstack/react-router'
import { ChevronDown, Plus, Grid3x3, Check, PanelLeftOpen } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useMe } from '../../features/auth/api/useMe'
import { useLogout } from '../../features/auth/api/useLogout'
import { useWorkspaces } from '../../features/workspace/api/useWorkspaces'
import { useWorkspaceStore } from '../../stores/workspaceStore'
import { useSidebarStore } from '../../stores/sidebarStore'
import { CreateWorkspaceModal } from '../../features/workspace/components/CreateWorkspaceModal'
import { ThemeToggle } from '../ui/ThemeToggle'
import type { Workspace } from '../../types'

interface TopBarProps {
  workspace: Workspace
}

export function TopBar({ workspace }: TopBarProps) {
  const { data: meData }   = useMe()
  const { data: wsData }   = useWorkspaces()
  const logout             = useLogout()
  const navigate            = useNavigate()
  const setActiveWorkspace  = useWorkspaceStore((s) => s.setActiveWorkspace)
  const { isSecondaryOpen, toggleSecondary } = useSidebarStore()

  const [switcherOpen, setSwitcherOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const switcherRef = useRef<HTMLDivElement>(null)
  const userRef      = useRef<HTMLDivElement>(null)

  const workspaces = wsData?.data ?? []

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setSwitcherOpen(false)
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSwitch = (target: Workspace) => {
    setActiveWorkspace(target)
    setSwitcherOpen(false)
    navigate({ to: '/workspaces/$workspaceId', params: { workspaceId: target.id } })
  }

  const initials = meData?.data
    ? `${meData.data.first_name[0]}${meData.data.last_name[0]}`.toUpperCase()
    : '?'

  return (
    <div className="h-14 flex items-center justify-between px-4 border-b border-[var(--color-border)] bg-[var(--color-base-100)] shrink-0">
      <div className="flex items-center gap-1">
        {/*{!isSecondaryOpen && (
          <button
            onClick={toggleSecondary}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-[var(--color-base-content)] opacity-60 hover:opacity-100 hover:bg-[var(--color-base-200)] transition-colors shrink-0"
            title="Expand sidebar"
          >
            <PanelLeftOpen size={16} />
          </button>
        )}*/}

        <div className="relative" ref={switcherRef}>
          <button
            onClick={() => setSwitcherOpen((v) => !v)}
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-[var(--color-base-200)] transition-colors"
          >
            <div
              className="h-6 w-6 rounded-md flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ backgroundColor: workspace.color }}
            >
              {workspace.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-semibold text-[var(--color-base-content)] max-w-[160px] truncate">
              {workspace.name}
            </span>
            <ChevronDown size={14} className="text-[var(--color-base-content)] opacity-60" />
          </button>

          {switcherOpen && (
            <div
              className="absolute left-0 top-11 w-72 rounded-xl border border-[var(--color-border)] shadow-xl py-1.5 z-50"
              style={{ backgroundColor: 'var(--color-base-100)' }}
            >
              <p className="px-3 pt-1.5 pb-2 text-xs font-semibold text-[var(--color-base-content)] opacity-60 uppercase tracking-wide">
                Workspaces
              </p>

              <div className="max-h-64 overflow-y-auto">
                {workspaces.map((ws) => {
                  const isActive = ws.id === workspace.id
                  return (
                    <button
                      key={ws.id}
                      onClick={() => handleSwitch(ws)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[var(--color-base-200)] transition-colors text-left"
                    >
                      <div
                        className="h-7 w-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ backgroundColor: ws.color }}
                      >
                        {ws.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="flex-1 text-sm text-[var(--color-base-content)] truncate">
                        {ws.name}
                      </span>
                      {isActive && (
                        <Check size={15} className="text-[var(--color-primary)] shrink-0" />
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="border-t border-[var(--color-border)] mt-1.5 pt-1.5">
                <button
                  onClick={() => {
                    setSwitcherOpen(false)
                    navigate({ to: '/workspaces' })
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[var(--color-base-content)] hover:bg-[var(--color-base-200)] transition-colors"
                >
                  <Grid3x3 size={15} className="text-[var(--color-base-content)] opacity-60" />
                  View all workspaces
                </button>
                <button
                  onClick={() => {
                    setSwitcherOpen(false)
                    setCreateModalOpen(true)
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[var(--color-primary)] hover:bg-[var(--color-base-200)] transition-colors"
                >
                  <Plus size={15} />
                  Create workspace
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <div className="relative" ref={userRef}>
          <button
            onClick={() => setUserMenuOpen((v) => !v)}
            className="h-8 w-8 rounded-full bg-[var(--color-primary)] text-white text-xs font-semibold flex items-center justify-center"
          >
            {initials}
          </button>

          {userMenuOpen && (
            <div
              className="absolute right-0 top-10 w-52 rounded-xl border border-[var(--color-border)] shadow-lg py-1.5 z-50"
              style={{ backgroundColor: 'var(--color-base-100)' }}
            >
              <div className="px-3 py-2 border-b border-[var(--color-border)]">
                <p className="text-sm font-medium text-[var(--color-base-content)] truncate">
                  {meData?.data.full_name}
                </p>
                <p className="text-xs text-[var(--color-base-content)] opacity-60 truncate">
                  {meData?.data.email}
                </p>
              </div>
              <button
                onClick={() => logout.mutate()}
                className="w-full text-left px-3 py-2 text-sm text-[var(--color-error)] hover:bg-[var(--color-base-200)] transition-colors"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>

      <CreateWorkspaceModal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} />
    </div>
  )
}
