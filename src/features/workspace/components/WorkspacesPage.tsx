import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useMe } from '../../auth/api/useMe'
import { useLogout } from '../../auth/api/useLogout'
import { useWorkspaces } from '../api/useWorkspaces'
import { useWorkspaceStore } from '../../../stores/workspaceStore'
import { Button } from '../../../components/ui/Button'
import { Logo } from '../../../components/shared/Logo'
import { ThemeToggle } from '../../../components/ui/ThemeToggle'
import { CreateWorkspaceModal } from './CreateWorkspaceModal'
import type { Workspace } from '../../../types'

export default function WorkspacesPage() {
  const navigate = useNavigate()
  const { data: meData }        = useMe()
  const { data, isLoading }     = useWorkspaces()
  const logout                  = useLogout()
  const setActiveWorkspace      = useWorkspaceStore((s) => s.setActiveWorkspace)
  const [modalOpen, setModalOpen] = useState(false)
  const [autoOpened, setAutoOpened] = useState(false)

  const workspaces     = data?.data ?? []
  const hasWorkspaces  = workspaces.length > 0

  // Auto-open the create modal the moment we know there are zero workspaces
  useEffect(() => {
    if (!isLoading && !hasWorkspaces && !autoOpened) {
      setModalOpen(true)
      setAutoOpened(true)
    }
  }, [isLoading, hasWorkspaces, autoOpened])

  const handleSelect = (workspace: Workspace) => {
    setActiveWorkspace(workspace)
    navigate({ to: '/workspaces/$workspaceId', params: { workspaceId: workspace.id } })
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="flex items-center justify-between px-8 py-6 border-b border-[var(--color-border)]">
        <Logo className="text-[var(--color-text)]" />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button variant="secondary" onClick={() => logout.mutate()} isLoading={logout.isPending}>
            Log out
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[calc(100vh-77px)]">
          <span className="h-6 w-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !hasWorkspaces ? (
        <EmptyState
          name={meData?.data.first_name}
          onCreate={() => setModalOpen(true)}
        />
      ) : (
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-text)]">
                Welcome back, {meData?.data.first_name}!
              </h1>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">
                Select a workspace to continue, or create a new one.
              </p>
            </div>
            <Button onClick={() => setModalOpen(true)}>
              <Plus size={16} className="mr-1.5" /> New workspace
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {workspaces.map((workspace) => (
              <button
                key={workspace.id}
                onClick={() => handleSelect(workspace)}
                className="flex items-start gap-4 p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)] hover:shadow-lg transition-all text-left"
              >
                <div
                  className="h-11 w-11 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
                  style={{ backgroundColor: workspace.color }}
                >
                  {workspace.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-[var(--color-text)] truncate">
                    {workspace.name}
                  </p>
                  <p className="text-sm text-[var(--color-text-muted)] mt-0.5 line-clamp-2">
                    {workspace.description || 'No description'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <CreateWorkspaceModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}

function EmptyState({ name, onCreate }: { name?: string; onCreate: () => void }) {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-77px)] px-6">
      <div className="w-full max-w-md text-center">
        <WorkspaceIllustration />

        <h1 className="text-2xl font-bold text-[var(--color-text)] mt-8 mb-2">
          Welcome, {name}! 👋
        </h1>
        <p className="text-[var(--color-text-muted)] text-[15px] leading-relaxed mb-8">
          You don't have any workspaces yet. Create your first workspace to start organizing tasks, goals, and docs with your team.
        </p>
        <Button size="lg" onClick={onCreate} className="mx-auto">
          <Plus size={18} className="mr-2" /> Create your first workspace
        </Button>
      </div>
    </div>
  )
}

function WorkspaceIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-[280px] h-[180px]">
      {/* Glow backdrop */}
      <div className="absolute inset-0 bg-[var(--color-primary)]/10 blur-3xl rounded-full" />

      {/* Layered cards composition */}
      <div className="absolute left-1/2 top-8 -translate-x-1/2 w-40 h-24 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xl -rotate-6" />
      <div className="absolute left-1/2 top-6 -translate-x-1/2 w-40 h-24 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xl rotate-3" />
      <div className="absolute left-1/2 top-4 -translate-x-1/2 w-44 h-28 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl flex flex-col p-4 gap-2">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
            <Plus size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <div className="h-2 w-16 rounded-full bg-[var(--color-border)]" />
          </div>
        </div>
        <div className="h-2 w-full rounded-full bg-[var(--color-border)]" />
        <div className="h-2 w-2/3 rounded-full bg-[var(--color-border)]" />
      </div>
    </div>
  )
}
