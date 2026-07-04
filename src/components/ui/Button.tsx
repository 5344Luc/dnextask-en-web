import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?:    'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-base-100)]'
    const variants = {
      primary:   'bg-[var(--color-primary)] text-[var(--color-primary-content)] hover:opacity-90 focus:ring-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/20 hover:shadow-[var(--color-primary)]/30',
      secondary: 'bg-[var(--color-base-100)] text-[var(--color-base-content)] border border-[var(--color-border)] hover:bg-[var(--color-base-200)]',
      ghost:     'text-[var(--color-base-content)] hover:bg-[var(--color-base-200)]',
      danger:    'bg-[var(--color-error)] text-[var(--color-error-content)] hover:opacity-90',
    }
    const sizes = {
      sm: 'h-9 px-3.5 text-sm',
      md: 'h-11 px-4 text-sm',
      lg: 'h-12 px-6 text-[15px]',
    }
    return (
      <button
        ref={ref}
        className={clsx(base, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          children
        )}
      </button>
    )
  },
)
Button.displayName = 'Button'
