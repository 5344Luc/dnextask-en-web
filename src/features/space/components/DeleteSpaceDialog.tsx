import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import { useDeleteSpace } from '../api/useDeleteSpace'
import { useToastStore } from '../../../stores/toastStore'
import { ApiError } from '../../../lib/api'
import type { Space } from '../../../types'

interface DeleteSpaceDialogProps {
  workspaceId: string
  space: Space
  isOpen: boolean
  onClose: () => void
}

export function DeleteSpaceDialog({ workspaceId, space, isOpen, onClose }: DeleteSpaceDialogProps) {
  const deleteSpace = useDeleteSpace(workspaceId)
  const showToast   = useToastStore((s) => s.show)

  const handleDelete = () => {
    deleteSpace.mutate(space.id, {
      onSuccess: () => {
        showToast({ type: 'success', title: 'Space deleted', message: `"${space.name}" has been removed.` })
        onClose()
      },
      onError: (error) => {
        const message =
          error instanceof ApiError
            ? (error.data as { message?: string })?.message ?? 'Something went wrong.'
            : 'Something went wrong.'
        showToast({ type: 'error', title: 'Could not delete space', message })
      },
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete space">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-[var(--color-base-content)]">
          Are you sure you want to delete <span className="font-semibold">"{space.name}"</span>? This will
          permanently remove all folders, lists, and tasks inside it. This action cannot be undone.
        </p>

        <div className="flex gap-3 mt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="danger" className="flex-1" isLoading={deleteSpace.isPending} onClick={handleDelete}>
            Delete space
          </Button>
        </div>
      </div>
    </Modal>
  )
}
