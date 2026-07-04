import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '../../../components/ui/Modal'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { createTaskSchema, type CreateTaskFormValues } from '../schemas/taskSchema'
import { useCreateTask } from '../api/useCreateTask'
import { useToastStore } from '../../../stores/toastStore'
import { ApiError } from '../../../lib/api'

interface CreateTaskModalProps {
  workspaceId: string
  spaceId: string
  listId: string
  isOpen: boolean
  onClose: () => void
}

const PRIORITY_OPTIONS = [
  { value: 'urgent', label: 'Urgent', color: '#ef4444' },
  { value: 'high',   label: 'High',   color: '#f59e0b' },
  { value: 'normal', label: 'Normal', color: '#3b82f6' },
  { value: 'low',    label: 'Low',    color: '#6b7280' },
] as const

export function CreateTaskModal({ workspaceId, spaceId, listId, isOpen, onClose }: CreateTaskModalProps) {
  const createTask = useCreateTask(workspaceId, spaceId, listId)
  const showToast  = useToastStore((s) => s.show)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskSchema),
  })

  const selectedPriority = watch('priority')

  const onSubmit = (values: CreateTaskFormValues) => {
    createTask.mutate(values, {
      onSuccess: (response) => {
        showToast({ type: 'success', title: 'Task created', message: `"${response.data.title}" is ready.` })
        reset()
        onClose()
      },
      onError: (error) => {
        const message =
          error instanceof ApiError
            ? (error.data as { message?: string })?.message ?? 'Something went wrong.'
            : 'Something went wrong.'
        showToast({ type: 'error', title: 'Could not create task', message })
      },
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a task">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          id="task-title"
          label="Task title"
          placeholder="e.g. Design the login screen"
          error={errors.title?.message}
          {...register('title')}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[var(--color-base-content)]">
            Description <span className="text-[var(--color-base-content)] opacity-60 font-normal">(optional)</span>
          </label>
          <textarea
            rows={3}
            placeholder="Add more detail…"
            className="px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-base-200)] text-[var(--color-base-content)] text-sm placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] transition-all resize-none"
            {...register('description')}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[var(--color-base-content)]">
            Priority <span className="text-[var(--color-base-content)] opacity-60 font-normal">(optional)</span>
          </label>
          <div className="flex gap-2">
            {PRIORITY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setValue('priority', selectedPriority === opt.value ? undefined : opt.value)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all"
                style={{
                  borderColor: selectedPriority === opt.value ? opt.color : 'var(--color-border)',
                  backgroundColor: selectedPriority === opt.value ? `${opt.color}1A` : 'transparent',
                  color: selectedPriority === opt.value ? opt.color : 'var(--color-base-content)',
                }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: opt.color }} />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <Input
          id="task-due-date"
          type="date"
          label="Due date (optional)"
          {...register('due_date')}
        />

        <div className="flex gap-3 mt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" isLoading={createTask.isPending}>
            Create task
          </Button>
        </div>
      </form>
    </Modal>
  )
}
