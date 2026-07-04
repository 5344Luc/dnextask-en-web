import { useForm } from 'react-hook-form'
import { useNavigate } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '../../../components/ui/Modal'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { createWorkspaceSchema, type CreateWorkspaceFormValues } from '../schemas/workspaceSchema'
import { useCreateWorkspace } from '../api/useCreateWorkspace'
import { useWorkspaceStore } from '../../../stores/workspaceStore'
import { useToastStore } from '../../../stores/toastStore'
import { ApiError } from '../../../lib/api'

interface CreateWorkspaceModalProps {
  isOpen:  boolean
  onClose: () => void
}

const colorOptions = ['#16A34A', '#2563EB', '#D97706', '#DC2626', '#7C3AED', '#0891B2']

export function CreateWorkspaceModal({ isOpen, onClose }: CreateWorkspaceModalProps) {
  const navigate = useNavigate()
  const createWorkspace    = useCreateWorkspace()
  const setActiveWorkspace = useWorkspaceStore((s) => s.setActiveWorkspace)
  const showToast          = useToastStore((s) => s.show)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateWorkspaceFormValues>({
    resolver:      zodResolver(createWorkspaceSchema),
    defaultValues: { color: '#16A34A' },
  })

  const selectedColor = watch('color')

  const onSubmit = (values: CreateWorkspaceFormValues) => {
    createWorkspace.mutate(values, {
      onSuccess: (response) => {
        setActiveWorkspace(response.data)
        showToast({
          type:    'success',
          title:   'Workspace created!',
          message: `"${response.data.name}" is ready to go.`,
        })
        reset()
        onClose()
        navigate({ to: '/workspaces/$workspaceId', params: { workspaceId: response.data.id } })
      },
      onError: (error) => {
        const message =
          error instanceof ApiError
            ? (error.data as { message?: string })?.message ?? 'Something went wrong.'
            : 'Something went wrong.'

        showToast({
          type:  'error',
          title: 'Could not create workspace',
          message,
        })
      },
    })
  }

  const serverError =
    createWorkspace.error instanceof ApiError
      ? (createWorkspace.error.data as { message?: string })?.message ?? null
      : null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a workspace">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          id="name"
          label="Workspace name"
          placeholder="e.g. Acme Inc."
          error={errors.name?.message || serverError || undefined}
          {...register('name')}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[var(--color-base-content)]">
            Description <span className="text-[var(--color-base-content)] opacity-60 font-normal">(optional)</span>
          </label>
          <textarea
            rows={3}
            placeholder="What's this workspace for?"
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
          <Button type="submit" className="flex-1" isLoading={createWorkspace.isPending}>
            Create workspace
          </Button>
        </div>
      </form>
    </Modal>
  )
}
