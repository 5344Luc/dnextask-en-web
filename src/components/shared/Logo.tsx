interface LogoProps {
  variant?: 'full' | 'icon'
  className?: string
}

export function Logo({ variant = 'full', className }: LogoProps) {
  if (variant === 'icon') {
    return (
      <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <linearGradient id="nGradIcon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ADE80" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>
        </defs>
        <rect width="36" height="36" rx="10" fill="url(#nGradIcon)" />
        <path d="M11 24.5V11.5L25 24.5V11.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    )
  }

  return (
    <svg width="168" height="32" viewBox="0 0 168 32" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="nGradFull" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#nGradFull)" />
      <path d="M9.5 22.5V9.5L22.5 22.5V9.5" stroke="white" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <text x="40" y="22" fontFamily="Inter, system-ui, sans-serif" fontSize="18" fontWeight="700">
        <tspan fill="#16A34A">d</tspan>
        <tspan fill="currentColor">Nextask</tspan>
      </text>
    </svg>
  )
}
