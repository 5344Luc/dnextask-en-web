import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { Logo } from '../../../components/shared/Logo'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { ThemeToggle } from '../../../components/ui/ThemeToggle'
import { AuthIllustration } from './AuthIllustration'
import { registerSchema, type RegisterFormValues } from '../schemas/registerSchema'
import { useRegister } from '../api/useRegister'
import { useLogin } from '../api/useLogin'
import { ApiError } from '../../../lib/api'

export default function RegisterPage() {
  const navigate     = useNavigate()
  const registerUser = useRegister()
  const login        = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = (values: RegisterFormValues) => {
    registerUser.mutate(values, {
      onSuccess: () => {
        // Auto-login using the same credentials right after successful registration
        login.mutate(
          { email: values.email, password: values.password },
          { onSuccess: () => navigate({ to: '/workspaces' }) },
        )
      },
    })
  }

  const isSubmitting = registerUser.isPending || login.isPending

  const serverError =
    registerUser.error instanceof ApiError
      ? (registerUser.error.data as { message?: string })?.message ?? 'Registration failed.'
      : login.error instanceof ApiError
        ? (login.error.data as { message?: string })?.message ?? 'Auto sign-in failed. Please log in manually.'
        : null

  return (
    <div className="h-screen w-full grid md:grid-cols-[1.1fr_1fr] bg-[var(--color-surface)] overflow-hidden">

      <div className="hidden md:block h-screen">
        <AuthIllustration />
      </div>

      <div className="h-screen flex flex-col overflow-y-auto">
        <div className="flex items-center justify-between px-8 sm:px-12 h-20 shrink-0">
          <Logo className="text-[var(--color-text)]" />
          <ThemeToggle />
        </div>

        <div className="flex-1 flex items-center justify-center px-8 sm:px-12 py-6">
          <div className="w-full max-w-[380px]">
            <h1 className="text-[28px] leading-tight font-bold text-[var(--color-text)] mb-1.5">
              Create your account
            </h1>
            <p className="text-sm text-[var(--color-text-muted)] mb-8">
              Start organizing your work with dNextask.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  id="first_name"
                  label="First name"
                  placeholder="John"
                  autoComplete="given-name"
                  error={errors.first_name?.message}
                  {...register('first_name')}
                />
                <Input
                  id="last_name"
                  label="Last name"
                  placeholder="Doe"
                  autoComplete="family-name"
                  error={errors.last_name?.message}
                  {...register('last_name')}
                />
              </div>

              <Input
                id="email"
                type="email"
                label="Email address"
                placeholder="you@example.com"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                id="password"
                type="password"
                label="Password"
                placeholder="At least 8 characters"
                autoComplete="new-password"
                error={errors.password?.message}
                {...register('password')}
              />

              <Input
                id="password_confirmation"
                type="password"
                label="Confirm password"
                placeholder="Re-enter your password"
                autoComplete="new-password"
                error={errors.password_confirmation?.message}
                {...register('password_confirmation')}
              />

              {serverError && (
                <p className="text-sm text-[var(--color-danger)]">{serverError}</p>
              )}

              <Button type="submit" size="lg" isLoading={isSubmitting}>
                Create account →
              </Button>
            </form>

            <p className="text-sm text-[var(--color-text-muted)] text-center mt-8">
              Already have an account?{' '}
              <Link to="/login" className="text-[var(--color-primary)] font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
