export interface TaskStatus {
  id: string
  name: string
  color: string
  category: 'todo' | 'in_progress' | 'done' | 'closed'
  order: number
}

export interface TaskAssignee {
  id: string
  first_name: string
  last_name: string
  full_name: string
  avatar_url: string | null
}

export interface Task {
  id: string
  public_id: string
  title: string
  description: string | null
  status_id: string
  status?: TaskStatus
  priority: 'urgent' | 'high' | 'normal' | 'low' | null
  due_date: string | null
  start_date: string | null
  list_id: string
  parent_task_id: string | null
  assignees: TaskAssignee[]
  subtask_count?: number
  is_completed: boolean
  created_at: string
  updated_at: string
}

export interface TaskListResponse {
  data: Task[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface TaskDetailResponse {
  data: Task
}

export interface CreateTaskPayload {
  title: string
  description?: string
  status_id?: string
  priority?: Task['priority']
  due_date?: string
  start_date?: string
  parent_task_id?: string
  assignee_ids?: string[]
}

export interface UpdateTaskPayload {
  title?: string
  description?: string
  priority?: Task['priority']
  due_date?: string
  start_date?: string
}

export interface UpdateTaskStatusPayload {
  status_id: string
}
