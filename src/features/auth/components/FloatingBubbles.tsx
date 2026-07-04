import { memo, useMemo } from 'react'

const PALETTE = [
  { core: '#34d399', glow: 'rgba(52,211,153,0.4)' },  // emerald
  { core: '#60a5fa', glow: 'rgba(96,165,250,0.4)' },  // blue
  { core: '#a78bfa', glow: 'rgba(167,139,250,0.4)' }, // violet
  { core: '#f472b6', glow: 'rgba(244,114,182,0.4)' }, // pink
  { core: '#fbbf24', glow: 'rgba(251,191,36,0.35)' }, // amber
  { core: '#22d3ee', glow: 'rgba(34,211,238,0.4)' },  // cyan
]

export const FloatingBubbles = memo(function FloatingBubbles() {
  const bubbles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => {
        const palette = PALETTE[i % PALETTE.length]
        const size = Math.random() * 130 + 40 // 40px - 170px
        return {
          id: i,
          size,
          left: Math.random() * 100,
          duration: Math.random() * 20 + 30, // 30s - 50s, slow drift
          delay: Math.random() * -50,        // negative delay = staggered start
          sway: (Math.random() * 80 + 20) * (Math.random() > 0.5 ? 1 : -1),
          ...palette,
        }
      }),
    []
  )

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bubbles.map((b) => (
        <span
          key={b.id}
          className="absolute rounded-full"
          style={
            {
              width: b.size,
              height: b.size,
              left: `${b.left}%`,
              bottom: -200,
              background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.5), ${b.glow} 35%, ${b.core}22 65%, transparent 78%)`,
              border: `1px solid ${b.glow}`,
              boxShadow: `inset -6px -6px 16px rgba(0,0,0,0.08), inset 6px 6px 18px rgba(255,255,255,0.15)`,
              backdropFilter: 'blur(1px)',
              animation: `bubbleFloat ${b.duration}s ease-in-out infinite`,
              animationDelay: `${b.delay}s`,
              '--sway': `${b.sway}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
})
