import { type ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen:  boolean
  onClose: () => void
  title?:  string
  children: ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-md border border-[var(--color-border)] rounded-2xl shadow-2xl"
        style={{ backgroundColor: 'var(--color-base-100)' }}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
            <h2 className="text-base font-semibold text-[var(--color-base-content)]">{title}</h2>
            <button
              onClick={onClose}
              className="h-8 w-8 flex items-center justify-center rounded-lg text-[var(--color-base-content)] opacity-60 hover:opacity-100 hover:bg-[var(--color-base-200)] transition-colors"
            >
              <i className="fi fi-rr-cross-small" style={{ fontSize: '18px' }} />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
