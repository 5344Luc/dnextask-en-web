import { useEffect, useState } from 'react'
import { FloatingBubbles } from './FloatingBubbles'

const activities = [
  'John completed Login UI',
  'Maria approved Dashboard',
  'Task moved to Done',
  'New sprint started',
]

export function AuthIllustration() {
  const [time, setTime] = useState(new Date())
  const [activity, setActivity] = useState(0)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const clock = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(clock)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setActivity((prev) => (prev + 1) % activities.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-[#0A0F0D] via-[#0B1220] to-[#111827] p-12 flex flex-col justify-between">

      {/* Real floating bubbles */}
      <FloatingBubbles />

      {/* Ambient background glow (parallax with mouse) */}
      <div
        className="absolute top-0 left-0 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"
        style={{ transform: `translate(${mouse.x}px, ${mouse.y}px)` }}
      />
      <div
        className="absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full bg-blue-500/10 blur-3xl pointer-events-none"
        style={{ transform: `translate(${-mouse.x}px, ${-mouse.y}px)` }}
      />

      {/* Collaboration Cursor */}
      <div className="absolute top-1/3 right-24 animate-bounce z-10">
        ...
      </div>

      {/* Header */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex -space-x-2">
            {[
              { initials: 'JD', from: 'from-emerald-400', to: 'to-emerald-600' },
              { initials: 'MR', from: 'from-blue-400', to: 'to-blue-600' },
              { initials: 'AK', from: 'from-violet-400', to: 'to-violet-600' },
              { initials: 'SL', from: 'from-pink-400', to: 'to-pink-600' },
              { initials: 'TB', from: 'from-amber-400', to: 'to-amber-600' },
            ].map((user, i) => (
              <div
                key={i}
                className={`relative w-8 h-8 rounded-full bg-gradient-to-br ${user.from} ${user.to} border-2 border-[#0A0F0D] flex items-center justify-center`}
              >
                <span className="text-[9px] font-semibold text-white">{user.initials}</span>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#0A0F0D]" />
              </div>
            ))}
          </div>
          <span className="text-sm text-slate-400">128 teams online</span>
        </div>

        <h2 className="text-white text-5xl font-bold leading-tight">
          Organize Tasks.
          <br />
          <span className="text-emerald-400">Manage Teams.</span>
          <br />
          Deliver Results.
        </h2>

        <p className="mt-6 text-slate-400 max-w-md">
          dNextask helps teams collaborate, automate workflows,
          and manage projects in one unified workspace.
        </p>
      </div>

      {/* Bottom widgets */}
      <div className="relative z-10 space-y-4 max-w-md">
        {/* Activity Feed */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-4">
          <p className="text-emerald-400 text-xs mb-2">Recent Activity</p>
          <p className="text-white text-sm animate-pulse">{activities[activity]}</p>
        </div>

        {/* Workflow */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-4">
          <div className="flex justify-between text-xs text-slate-400 mb-3">
            <span>Planning</span>
            <span>Development</span>
            <span>Testing</span>
            <span>Deploy</span>
          </div>
          <div className="relative h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="absolute h-2 w-16 bg-emerald-400 rounded-full animate-[pulse_2s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
    </div>
  )
}
