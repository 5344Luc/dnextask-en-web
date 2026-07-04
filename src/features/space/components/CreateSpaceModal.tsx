import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '../../../components/ui/Modal'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { createSpaceSchema, type CreateSpaceFormValues } from '../schemas/spaceSchema'
import { useCreateSpace } from '../api/useCreateSpace'
import { useToastStore } from '../../../stores/toastStore'
import { ApiError } from '../../../lib/api'

interface CreateSpaceModalProps {
  workspaceId: string
  isOpen:  boolean
  onClose: () => void
}

const colorOptions = ['#16A34A', '#2563EB', '#D97706', '#DC2626', '#7C3AED', '#0891B2']

export function CreateSpaceModal({ workspaceId, isOpen, onClose }: CreateSpaceModalProps) {
  const createSpace = useCreateSpace(workspaceId)
  const showToast    = useToastStore((s) => s.show)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateSpaceFormValues>({
    resolver:      zodResolver(createSpaceSchema),
    defaultValues: { color: '#16A34A', is_private: false },
  })

  const selectedColor = watch('color')

  const onSubmit = (values: CreateSpaceFormValues) => {
    createSpace.mutate(values, {
      onSuccess: (response) => {
        showToast({ type: 'success', title: 'Space created', message: `"${response.data.name}" is ready.` })
        reset()
        onClose()
      },
      onError: (error) => {
        const message =
          error instanceof ApiError
            ? (error.data as { message?: string })?.message ?? 'Something went wrong.'
            : 'Something went wrong.'
        showToast({ type: 'error', title: 'Could not create space', message })
      },
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a space">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          id="space-name"
          label="Space name"
          placeholder="e.g. Marketing"
          error={errors.name?.message}
          {...register('name')}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[var(--color-base-content)]">
            Description <span className="text-[var(--color-base-content)] opacity-60 font-normal">(optional)</span>
          </label>
          <textarea
            rows={2}
            placeholder="What's this space for?"
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

        <label className="flex items-center gap-2 text-sm text-[var(--color-base-content)] opacity-70 cursor-pointer select-none">
          <input type="checkbox" className="h-3.5 w-3.5 rounded accent-[var(--color-primary)]" {...register('is_private')} />
          Make this space private
        </label>

        <div className="flex gap-3 mt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" isLoading={createSpace.isPending}>
            Create space
          </Button>
        </div>
      </form>
    </Modal>
  )
}
