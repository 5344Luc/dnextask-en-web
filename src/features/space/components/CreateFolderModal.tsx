import { useForm } from 'react-hook-form'
import { Modal } from '../../../components/ui/Modal'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { useCreateFolder } from '../api/useCreateFolder'
import { useToastStore } from '../../../stores/toastStore'
import { ApiError } from '../../../lib/api'

interface CreateFolderModalProps {
  workspaceId: string
  spaceId: string
  isOpen: boolean
  onClose: () => void
}

interface CreateFolderFormValues {
  name: string
}

export function CreateFolderModal({ workspaceId, spaceId, isOpen, onClose }: CreateFolderModalProps) {
  const createFolder = useCreateFolder(workspaceId, spaceId)
  const showToast     = useToastStore((s) => s.show)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateFolderFormValues>()

  const onSubmit = (values: CreateFolderFormValues) => {
    createFolder.mutate(values, {
      onSuccess: (response) => {
        showToast({ type: 'success', title: 'Folder created', message: `"${response.data.name}" is ready.` })
        reset()
        onClose()
      },
      onError: (error) => {
        const message =
          error instanceof ApiError
            ? (error.data as { message?: string })?.message ?? 'Something went wrong.'
            : 'Something went wrong.'
        showToast({ type: 'error', title: 'Could not create folder', message })
      },
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a folder">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          id="folder-name"
          label="Folder name"
          placeholder="e.g. Client Projects"
          error={errors.name?.message}
          {...register('name', { required: 'Folder name is required' })}
        />

        <div className="flex gap-3 mt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" isLoading={createFolder.isPending}>
            Create folder
          </Button>
        </div>
      </form>
    </Modal>
  )
}
