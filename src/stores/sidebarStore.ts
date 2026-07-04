import { create } from 'zustand'

interface SidebarState {
  isSecondaryOpen: boolean
  isMobileOpen:    boolean
  toggleSecondary: () => void
  toggleMobile:    () => void
  closeAll:        () => void
}

export const useSidebarStore = create<SidebarState>()((set) => ({
  isSecondaryOpen: true,
  isMobileOpen:    false,
  toggleSecondary: () => set((s) => ({ isSecondaryOpen: !s.isSecondaryOpen })),
  toggleMobile:    () => set((s) => ({ isMobileOpen: !s.isMobileOpen })),
  closeAll:        () => set({ isSecondaryOpen: false, isMobileOpen: false }),
}))
