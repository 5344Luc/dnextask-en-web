import { useForm } from 'react-hook-form'
import { useWorkspaceStore } from '../../../stores/workspaceStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { Logo } from '../../../components/shared/Logo'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { ThemeToggle } from '../../../components/ui/ThemeToggle'
import { AuthIllustration } from './AuthIllustration'
import { loginSchema, type LoginFormValues } from '../schemas/loginSchema'
import { useLogin } from '../api/useLogin'
import { ApiError } from '../../../lib/api'

export default function LoginPage() {
  const navigate = useNavigate()
  const login    = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (values: LoginFormValues) => {
    login.mutate(values, {
      onSuccess: () => {
        const lastWorkspace = useWorkspaceStore.getState().activeWorkspace
        if (lastWorkspace) {
          navigate({ to: '/workspaces/$workspaceId', params: { workspaceId: lastWorkspace.id } })
        } else {
          navigate({ to: '/workspaces' })
        }
      },
    })
  }

  const serverError =
    login.error instanceof ApiError
      ? (login.error.data as { message?: string })?.message ?? 'Invalid credentials.'
      : null

  return (
    <div className="h-screen w-full grid lg:grid-cols-2 bg-[var(--color-base-100)] overflow-hidden">

      <div className="hidden md:block h-screen">
        <AuthIllustration />
      </div>

      <div className="h-screen flex flex-col">
        <div className="flex items-center justify-between px-8 sm:px-12 h-20 shrink-0">
          <Logo className="text-[var(--color-base-content)]" />
          <ThemeToggle />
        </div>

        <div className="flex-1 flex items-center justify-center px-8 sm:px-12">
          <div className="w-full max-w-[380px]">
            <h1 className="text-[28px] leading-tight font-bold text-[var(--color-base-content)] mb-1.5">
              Welcome back!
            </h1>
            <p className="text-sm text-[var(--color-base-content)] opacity-60 mb-8">
              Sign in to your dNextask account to continue.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <Input
                id="email"
                type="email"
                label="Email address"
                placeholder="you@example.com"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email')}
              />

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="text-sm font-semibold text-[var(--color-base-content)]">
                    Password
                  </label>
                  <a href="/forgot-password" className="text-xs font-medium text-[var(--color-primary)] hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  error={errors.password?.message}
                  {...register('password')}
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-[var(--color-base-content)] opacity-70 -mt-1 cursor-pointer select-none">
                <input type="checkbox" className="h-3.5 w-3.5 rounded accent-[var(--color-primary)]" />
                Remember me
              </label>

              {serverError && (
                <p className="text-sm text-[var(--color-error)]">{serverError}</p>
              )}

              <Button type="submit" size="lg" isLoading={login.isPending}>
                Sign in →
              </Button>
            </form>

            <div className="flex items-center gap-3 my-7">
              <div className="flex-1 h-px bg-[var(--color-border)]" />
              <span className="text-xs text-[var(--color-base-content)] opacity-50 whitespace-nowrap">or continue with</span>
              <div className="flex-1 h-px bg-[var(--color-border)]" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="h-11 flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-base-200)] text-sm font-medium text-[var(--color-base-content)] hover:bg-[var(--color-base-300)] transition-colors"
              >
                <GoogleIcon /> Google
              </button>
              <button
                type="button"
                className="h-11 flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-base-200)] text-sm font-medium text-[var(--color-base-content)] hover:bg-[var(--color-base-300)] transition-colors"
              >
                <MicrosoftIcon /> Microsoft
              </button>
            </div>

            <p className="text-sm text-[var(--color-base-content)] opacity-60 text-center mt-8">
              Don't have an account?{' '}
              <Link to="/register" className="text-[var(--color-primary)] font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <div className="h-10 shrink-0" />
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

function MicrosoftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 23 23">
      <path fill="#f35325" d="M1 1h10v10H1z"/>
      <path fill="#81bc06" d="M12 1h10v10H12z"/>
      <path fill="#05a6f0" d="M1 12h10v10H1z"/>
      <path fill="#ffba08" d="M12 12h10v10H12z"/>
    </svg>
  )
}
