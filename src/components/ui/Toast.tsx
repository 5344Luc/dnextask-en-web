import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useToastStore, type Toast as ToastItem, type ToastType } from '../../stores/toastStore'

const config: Record<ToastType, { icon: string; color: string; bg: string }> = {
  success: { icon: 'fi fi-rr-check-circle',   color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  error:   { icon: 'fi fi-rr-cross-circle',   color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  warning: { icon: 'fi fi-rr-triangle-warning', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  info:    { icon: 'fi fi-rr-info',           color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
}

export function ToastContainer() {
  const toasts  = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)

  if (toasts.length === 0) return null

  return createPortal(
    <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2.5 w-full max-w-sm">
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
      ))}
    </div>,
    document.body,
  )
}

function ToastCard({ toast, onDismiss }: { toast: ToastItem; onDismiss: () => void }) {
  const [visible, setVisible] = useState(false)
  const { icon, color, bg } = config[toast.type]

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  const handleDismiss = () => {
    setVisible(false)
    setTimeout(onDismiss, 200)
  }

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-2xl border border-[var(--color-border)] shadow-2xl transition-all duration-200 ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
      }`}
      style={{ backgroundColor: 'var(--color-base-100)' }}
    >
      <div
        className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: bg }}
      >
        <i className={icon} style={{ fontSize: '17px', color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[var(--color-base-content)]">{toast.title}</p>
        {toast.message && (
          <p className="text-sm text-[var(--color-base-content)] opacity-60 mt-0.5">{toast.message}</p>
        )}
      </div>
      <button
        onClick={handleDismiss}
        className="h-6 w-6 flex items-center justify-center rounded-md text-[var(--color-base-content)] opacity-60 hover:opacity-100 hover:bg-[var(--color-base-200)] transition-colors shrink-0"
      >
        <i className="fi fi-rr-cross-small" style={{ fontSize: '14px' }} />
      </button>
    </div>
  )
}
