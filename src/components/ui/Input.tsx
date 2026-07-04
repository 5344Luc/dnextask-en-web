import { type InputHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-semibold text-[var(--color-text)]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={clsx(
            'h-11 px-3.5 rounded-xl border bg-[var(--color-background)] text-[var(--color-text)] text-sm',
            'placeholder:text-[var(--color-text-muted)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)]',
            'transition-all duration-150',
            error ? 'border-[var(--color-danger)]' : 'border-[var(--color-border)]',
            className,
          )}
          {...props}
        />
        {error && <span className="text-xs text-[var(--color-danger)]">{error}</span>}
      </div>
    )
  },
)

Input.displayName = 'Input'
