import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '../../../components/ui/Modal'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { createListSchema, type CreateListFormValues } from '../schemas/listSchema'
import { useCreateList } from '../api/useCreateList'
import { useToastStore } from '../../../stores/toastStore'
import { ApiError } from '../../../lib/api'

interface CreateListModalProps {
  workspaceId: string
  spaceId: string
  folderId?: string | null
  isOpen: boolean
  onClose: () => void
}

const colorOptions = ['#16A34A', '#2563EB', '#D97706', '#DC2626', '#7C3AED', '#0891B2']

export function CreateListModal({ workspaceId, spaceId, folderId, isOpen, onClose }: CreateListModalProps) {
  const createList = useCreateList(workspaceId, spaceId)
  const showToast  = useToastStore((s) => s.show)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateListFormValues>({
    resolver: zodResolver(createListSchema),
    defaultValues: { color: '#16A34A', folder_id: folderId ?? null },
  })

  const selectedColor = watch('color')

  const onSubmit = (values: CreateListFormValues) => {
    createList.mutate(values, {
      onSuccess: (response) => {
        showToast({ type: 'success', title: 'List created', message: `"${response.data.name}" is ready.` })
        reset()
        onClose()
      },
      onError: (error) => {
        const message =
          error instanceof ApiError
            ? (error.data as { message?: string })?.message ?? 'Something went wrong.'
            : 'Something went wrong.'
        showToast({ type: 'error', title: 'Could not create list', message })
      },
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a list">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          id="list-name"
          label="List name"
          placeholder="e.g. Sprint Backlog"
          error={errors.name?.message}
          {...register('name')}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[var(--color-base-content)]">Color</label>
          <div className="flex gap-2">
            {colorOptions.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setValue('color', color)}
                className="h-8 w-8 rounded-full border-2 transition-transform"
                style={{
                  backgroundColor: color,
                  borderColor: selectedColor === color ? 'var(--color-base-content)' : 'transparent',
                  transform: selectedColor === color ? 'scale(1.1)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" isLoading={createList.isPending}>
            Create list
          </Button>
        </div>
      </form>
    </Modal>
  )
}
