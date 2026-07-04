import { create } from 'zustand'

interface NotificationState {
  unreadCount: number
  setUnreadCount: (count: number) => void
  incrementUnread: () => void
  clearUnread: () => void
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  unreadCount:     0,
  setUnreadCount:  (count) => set({ unreadCount: count }),
  incrementUnread: () => set((s) => ({ unreadCount: s.unreadCount + 1 })),
  clearUnread:     () => set({ unreadCount: 0 }),
}))
