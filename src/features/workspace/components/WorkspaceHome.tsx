import { CheckSquare, Target, Clock, Users, Plus, FileText, MessageSquare } from 'lucide-react'
import { AppShell } from '../../../components/layout/AppShell'
import { useMe } from '../../auth/api/useMe'
import { SpaceTree } from '../../space/components/SpaceTree'
import type { Workspace } from '../../../types'

export default function WorkspaceHome({ workspace }: { workspace: Workspace }) {
  const { data: meData } = useMe()
  const firstName = meData?.data.first_name ?? ''

  const greeting = getGreeting()

  return (
    <AppShell
      workspace={workspace}
      sidebarTitle="Overview"
      sidebarContent={<SpaceTree workspaceId={workspace.id} />}
    >
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            {greeting}, {firstName} 👋
          </h1>
          <p className="text-[var(--color-text-muted)] mt-1">
            Here's what's happening in {workspace.name} today.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={CheckSquare} label="Open Tasks"   value="—" color="#22C55E" />
          <StatCard icon={Target}      label="Active Goals" value="—" color="#3B82F6" />
          <StatCard icon={Clock}       label="Hours Logged" value="—" color="#F59E0B" />
          <StatCard icon={Users}       label="Team Members" value="—" color="#A855F7" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick actions */}
          <div className="lg:col-span-1">
            <h2 className="text-sm font-semibold text-[var(--color-text)] mb-3">
              Quick actions
            </h2>
            <div className="flex flex-col gap-2">
              <QuickAction icon={Plus}           label="Create a task" />
              <QuickAction icon={Target}         label="Set a goal" />
              <QuickAction icon={FileText}       label="New document" />
              <QuickAction icon={MessageSquare}  label="Start a chat" />
            </div>
          </div>

          {/* Recent activity */}
          <div className="lg:col-span-2">
            <h2 className="text-sm font-semibold text-[var(--color-text)] mb-3">
              Recent activity
            </h2>
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center mb-3">
                <Clock size={20} className="text-[var(--color-primary)]" />
              </div>
              <p className="text-sm font-medium text-[var(--color-text)]">
                No activity yet
              </p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1 max-w-[220px]">
                Once you start creating tasks and docs, activity will show up here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof CheckSquare
  label: string
  value: string
  color: string
}) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-[var(--color-text-muted)]">{label}</span>
        <div
          className="h-8 w-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}1A` }}
        >
          <Icon size={15} style={{ color }} />
        </div>
      </div>
      <p className="text-2xl font-bold text-[var(--color-text)]">{value}</p>
    </div>
  )
}

function QuickAction({ icon: Icon, label }: { icon: typeof Plus; label: string }) {
  return (
    <button className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)] hover:bg-[var(--color-surface-hover)] transition-all text-left">
      <div className="h-8 w-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
        <Icon size={15} className="text-[var(--color-primary)]" />
      </div>
      <span className="text-sm font-medium text-[var(--color-text)]">{label}</span>
    </button>
  )
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}
