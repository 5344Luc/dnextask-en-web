import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Workspace } from '../types'

interface WorkspaceState {
  activeWorkspace: Workspace | null
  setActiveWorkspace: (workspace: Workspace) => void
  clearWorkspace: () => void
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      activeWorkspace: null,
      setActiveWorkspace: (workspace) => set({ activeWorkspace: workspace }),
      clearWorkspace: () => set({ activeWorkspace: null }),
    }),
    { name: 'workspace-storage' },
  ),
)
