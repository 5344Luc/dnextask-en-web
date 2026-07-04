import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { AppShell } from '../../../components/layout/AppShell'
import { SpaceTree } from '../components/SpaceTree'
import { useWorkspace } from '../../workspace/api/useWorkspace'
import { useSpaces } from '../api/useSpaces'
import { useUpdateSpace } from '../api/useUpdateSpace'
import { useDeleteSpace } from '../api/useDeleteSpace'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { useToastStore } from '../../../stores/toastStore'
import { ApiError } from '../../../lib/api'

interface SpaceSettingsPageProps {
  workspaceId: string
  spaceId: string
}

type SettingsTab = 'general' | 'members' | 'danger'

export default function SpaceSettingsPage({ workspaceId, spaceId }: SpaceSettingsPageProps) {
  const navigate = useNavigate()
  const { data: workspaceData, isLoading: workspaceLoading } = useWorkspace(workspaceId)
  const { data: spacesData, isLoading: spacesLoading } = useSpaces(workspaceId)
  const [activeTab, setActiveTab] = useState<SettingsTab>('general')

  const space = spacesData?.data.find((s) => s.id === spaceId)

  if (workspaceLoading || spacesLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-base-100)' }}>
        <span className="h-6 w-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!workspaceData || !space) {
    return (
      <div className="h-screen w-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-base-100)' }}>
        <p className="text-[var(--color-base-content)] opacity-60">Space not found.</p>
      </div>
    )
  }

  return (
    <AppShell
      workspace={workspaceData.data}
      sidebarTitle="Overview"
      sidebarContent={<SpaceTree workspaceId={workspaceId} />}
    >
      <div className="max-w-3xl mx-auto p-8">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: space.color }}
          >
            <span className="text-sm font-bold text-white">{space.name.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-[var(--color-base-content)]">{space.name}</h1>
            <p className="text-xs text-[var(--color-base-content)] opacity-50">Space settings</p>
          </div>
        </div>

        <div className="flex items-center gap-1 border-b border-[var(--color-border)] mb-6">
          {(['general', 'members', 'danger'] as SettingsTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors"
              style={{
                borderColor: activeTab === tab ? 'var(--color-primary)' : 'transparent',
                color: activeTab === tab ? 'var(--color-primary)' : 'var(--color-base-content)',
                opacity: activeTab === tab ? 1 : 0.6,
              }}
            >
              {tab === 'danger' ? 'Danger Zone' : tab}
            </button>
          ))}
        </div>

        {activeTab === 'general' && <GeneralTab workspaceId={workspaceId} space={space} />}
        {activeTab === 'members' && <MembersTab workspaceId={workspaceId} />}
        {activeTab === 'danger' && (
          <DangerZoneTab
            workspaceId={workspaceId}
            space={space}
            onDeleted={() => navigate({ to: '/workspaces/$workspaceId', params: { workspaceId } })}
          />
        )}
      </div>
    </AppShell>
  )
}

function GeneralTab({ workspaceId, space }: { workspaceId: string; space: { id: string; name: string; description?: string | null; color: string; is_private?: boolean } }) {
  const updateSpace = useUpdateSpace(workspaceId, space.id)
  const showToast   = useToastStore((s) => s.show)
  const [name, setName] = useState(space.name)
  const [description, setDescription] = useState(space.description ?? '')
  const [color, setColor] = useState(space.color)
  const [isPrivate, setIsPrivate] = useState(space.is_private ?? false)

  const colorOptions = ['#16A34A', '#2563EB', '#D97706', '#DC2626', '#7C3AED', '#0891B2']

  const handleSave = () => {
    updateSpace.mutate(
      { name, description, color, is_private: isPrivate },
      {
        onSuccess: () => showToast({ type: 'success', title: 'Space updated', message: 'Changes saved.' }),
        onError: (error) => {
          const message =
            error instanceof ApiError ? (error.data as { message?: string })?.message ?? 'Something went wrong.' : 'Something went wrong.'
          showToast({ type: 'error', title: 'Could not save changes', message })
        },
      }
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <Input id="settings-space-name" label="Space name" value={name} onChange={(e) => setName(e.target.value)} />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-[var(--color-base-content)]">Description</label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-base-200)] text-[var(--color-base-content)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] transition-all resize-none"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-[var(--color-base-content)]">Color</label>
        <div className="flex gap-2">
          {colorOptions.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className="h-8 w-8 rounded-full border-2 transition-transform"
              style={{ backgroundColor: c, borderColor: color === c ? 'var(--color-base-content)' : 'transparent', transform: color === c ? 'scale(1.1)' : 'scale(1)' }}
            />
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-[var(--color-base-content)] cursor-pointer select-none">
        <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} className="h-3.5 w-3.5 rounded accent-[var(--color-primary)]" />
        Make this space private
      </label>

      <Button type="button" className="w-fit" isLoading={updateSpace.isPending} onClick={handleSave}>
        Save changes
      </Button>
    </div>
  )
}

function MembersTab({ workspaceId }: { workspaceId: string }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] p-6 flex flex-col items-center text-center gap-2" style={{ backgroundColor: 'var(--color-base-200)' }}>
      <i className="fi fi-rr-users" style={{ fontSize: '24px', color: 'var(--color-base-content)', opacity: 0.4 }} />
      <p className="text-sm font-medium text-[var(--color-base-content)]">Members inherited from Workspace</p>
      <p className="text-xs text-[var(--color-base-content)] opacity-50 max-w-sm">
        This space doesn't have its own member list — anyone in the workspace can access it based on your permission settings. Manage workspace members from workspace settings.
      </p>
    </div>
  )
}

function DangerZoneTab({
  workspaceId,
  space,
  onDeleted,
}: {
  workspaceId: string
  space: { id: string; name: string }
  onDeleted: () => void
}) {
  const deleteSpace = useDeleteSpace(workspaceId)
  const showToast   = useToastStore((s) => s.show)
  const [confirmText, setConfirmText] = useState('')

  const canDelete = confirmText === space.name

  const handleDelete = () => {
    deleteSpace.mutate(space.id, {
      onSuccess: () => {
        showToast({ type: 'success', title: 'Space deleted', message: `"${space.name}" has been removed.` })
        onDeleted()
      },
      onError: (error) => {
        const message =
          error instanceof ApiError ? (error.data as { message?: string })?.message ?? 'Something went wrong.' : 'Something went wrong.'
        showToast({ type: 'error', title: 'Could not delete space', message })
      },
    })
  }

  return (
    <div className="rounded-2xl border p-6 flex flex-col gap-4" style={{ borderColor: 'var(--color-error)' }}>
      <div>
        <h3 className="text-sm font-semibold text-[var(--color-error)]">Delete this space</h3>
        <p className="text-xs text-[var(--color-base-content)] opacity-60 mt-1">
          This permanently removes all folders, lists, and tasks inside. This action cannot be undone.
        </p>
      </div>
      <Input
        id="confirm-delete"
        label={`Type "${space.name}" to confirm`}
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
      />
      <Button type="button" variant="danger" className="w-fit" disabled={!canDelete} isLoading={deleteSpace.isPending} onClick={handleDelete}>
        Delete space
      </Button>
    </div>
  )
}
