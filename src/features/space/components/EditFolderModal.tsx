import { useForm } from 'react-hook-form'
import { Modal } from '../../../components/ui/Modal'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { useUpdateFolder } from '../api/useUpdateFolder'
import { useToastStore } from '../../../stores/toastStore'
import { ApiError } from '../../../lib/api'

interface EditFolderModalProps {
  workspaceId: string
  spaceId: string
  folder: { id: string; name: string }
  isOpen: boolean
  onClose: () => void
}

interface EditFolderFormValues {
  name: string
}

export function EditFolderModal({ workspaceId, spaceId, folder, isOpen, onClose }: EditFolderModalProps) {
  const updateFolder = useUpdateFolder(workspaceId, spaceId, folder.id)
  const showToast     = useToastStore((s) => s.show)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditFolderFormValues>({
    defaultValues: { name: folder.name },
  })

  const onSubmit = (values: EditFolderFormValues) => {
    updateFolder.mutate(values, {
      onSuccess: () => {
        showToast({ type: 'success', title: 'Folder updated', message: `Renamed to "${values.name}".` })
        onClose()
      },
      onError: (error) => {
        const message =
          error instanceof ApiError
            ? (error.data as { message?: string })?.message ?? 'Something went wrong.'
            : 'Something went wrong.'
        showToast({ type: 'error', title: 'Could not update folder', message })
      },
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit folder">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          id="edit-folder-name"
          label="Folder name"
          error={errors.name?.message}
          {...register('name', { required: 'Folder name is required' })}
        />

        <div className="flex gap-3 mt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" isLoading={updateFolder.isPending}>
            Save changes
          </Button>
        </div>
      </form>
    </Modal>
  )
}
