import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import { useDeleteFolder } from '../api/useDeleteFolder'
import { useToastStore } from '../../../stores/toastStore'
import { ApiError } from '../../../lib/api'

interface DeleteFolderDialogProps {
  workspaceId: string
  spaceId: string
  folder: { id: string; name: string }
  isOpen: boolean
  onClose: () => void
}

export function DeleteFolderDialog({ workspaceId, spaceId, folder, isOpen, onClose }: DeleteFolderDialogProps) {
  const deleteFolder = useDeleteFolder(workspaceId, spaceId)
  const showToast     = useToastStore((s) => s.show)

  const handleDelete = () => {
    deleteFolder.mutate(folder.id, {
      onSuccess: () => {
        showToast({ type: 'success', title: 'Folder deleted', message: `"${folder.name}" has been removed.` })
        onClose()
      },
      onError: (error) => {
        const message =
          error instanceof ApiError
            ? (error.data as { message?: string })?.message ?? 'Something went wrong.'
            : 'Something went wrong.'
        showToast({ type: 'error', title: 'Could not delete folder', message })
      },
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete folder">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-[var(--color-base-content)]">
          Are you sure you want to delete <span className="font-semibold">"{folder.name}"</span>? Any lists and
          tasks inside it will also be removed. This action cannot be undone.
        </p>

        <div className="flex gap-3 mt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="danger" className="flex-1" isLoading={deleteFolder.isPending} onClick={handleDelete}>
            Delete folder
          </Button>
        </div>
      </div>
    </Modal>
  )
}
