import { useForm } from 'react-hook-form'
import { Modal } from '../../../components/ui/Modal'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { useUpdateSpace } from '../api/useUpdateSpace'
import { useToastStore } from '../../../stores/toastStore'
import { ApiError } from '../../../lib/api'
import type { Space } from '../../../types'

interface EditSpaceModalProps {
  workspaceId: string
  space: Space
  isOpen: boolean
  onClose: () => void
}

interface EditSpaceFormValues {
  name: string
  description?: string
  color: string
}

const colorOptions = ['#16A34A', '#2563EB', '#D97706', '#DC2626', '#7C3AED', '#0891B2']

export function EditSpaceModal({ workspaceId, space, isOpen, onClose }: EditSpaceModalProps) {
  const updateSpace = useUpdateSpace(workspaceId, space.id)
  const showToast   = useToastStore((s) => s.show)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EditSpaceFormValues>({
    defaultValues: {
      name: space.name,
      description: space.description ?? '',
      color: space.color,
    },
  })

  const selectedColor = watch('color')

  const onSubmit = (values: EditSpaceFormValues) => {
    updateSpace.mutate(values, {
      onSuccess: () => {
        showToast({ type: 'success', title: 'Space updated', message: `"${values.name}" has been saved.` })
        onClose()
      },
      onError: (error) => {
        const message =
          error instanceof ApiError
            ? (error.data as { message?: string })?.message ?? 'Something went wrong.'
            : 'Something went wrong.'
        showToast({ type: 'error', title: 'Could not update space', message })
      },
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit space">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          id="edit-space-name"
          label="Space name"
          error={errors.name?.message}
          {...register('name', { required: 'Space name is required' })}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[var(--color-base-content)]">
            Description <span className="text-[var(--color-base-content)] opacity-60 font-normal">(optional)</span>
          </label>
          <textarea
            rows={3}
            className="px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-base-200)] text-[var(--color-base-content)] text-sm placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] transition-all resize-none"
            {...register('description')}
          />
        </div>

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
          <Button type="submit" className="flex-1" isLoading={updateSpace.isPending}>
            Save changes
          </Button>
        </div>
      </form>
    </Modal>
  )
}
