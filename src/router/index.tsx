import { createRootRoute, createRoute, createRouter, Outlet, redirect } from '@tanstack/react-router'
import { useWorkspaceStore } from '../stores/workspaceStore'
import LoginPage from '../features/auth/components/LoginPage'
import RegisterPage from '../features/auth/components/RegisterPage'
import WorkspacesPage from '../features/workspace/components/WorkspacesPage'
import WorkspaceLoader from '../features/workspace/components/WorkspaceLoader'
import { TaskViewTabs } from '../features/task/components/TaskViewTabs'
import { requireAuth, requireGuest } from './guards'
import { useAuthStore } from '../stores/authStore'
import TaskListPage from '../features/task/components/TaskListPage'
import SpaceSettingsPage from '../features/space/pages/SpaceSettingsPage'

const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  beforeLoad: requireGuest,
  component: LoginPage,
})

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  beforeLoad: requireGuest,
  component: RegisterPage,
})

const workspacesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/workspaces',
  beforeLoad: requireAuth,
  component: WorkspacesPage,
})

const workspaceDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/workspaces/$workspaceId',
  beforeLoad: requireAuth,
  component: () => {
    const { workspaceId } = workspaceDetailRoute.useParams()
    return <WorkspaceLoader workspaceId={workspaceId} />
  },
})

const taskListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/workspaces/$workspaceId/spaces/$spaceId/lists/$listId',
  beforeLoad: requireAuth,
  component: () => {
    const { workspaceId, spaceId, listId } = taskListRoute.useParams()
    return <TaskListPage workspaceId={workspaceId} spaceId={spaceId} listId={listId} />
  },
})


const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    const token = useAuthStore.getState().token
    if (!token) throw redirect({ to: '/login' })
    const lastWorkspace = useWorkspaceStore.getState().activeWorkspace
    if (lastWorkspace) {
      throw redirect({ to: '/workspaces/$workspaceId', params: { workspaceId: lastWorkspace.id } })
    }
    throw redirect({ to: '/workspaces' })
  },
})

const spaceSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/workspaces/$workspaceId/spaces/$spaceId/settings',
  beforeLoad: requireAuth,
  component: () => {
    const { workspaceId, spaceId } = spaceSettingsRoute.useParams()
    return <SpaceSettingsPage workspaceId={workspaceId} spaceId={spaceId} />
  },
})

const routeTree = rootRoute.addChildren([
    indexRoute,
    loginRoute,
    registerRoute,
    workspacesRoute,
    workspaceDetailRoute,
    taskListRoute,
    spaceSettingsRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
