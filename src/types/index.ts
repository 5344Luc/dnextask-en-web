export interface ApiResponse<T> {
  success: boolean
  message: string
  data:    T
}

export interface User {
  id:         string
  public_id:  string
  email:      string
  first_name: string
  last_name:  string
  full_name:  string
  status:     string
  avatar:     string | null
  timezone:   string
  locale:     string
  created_at: string
}

export interface Workspace {
  id:          string
  public_id:   string
  name:        string
  slug:        string
  owner_id:    string
  description: string | null
  logo:        string | null
  color:       string
  is_active:   boolean
  created_at:  string
}

export interface Space {
  id:           string
  workspace_id: string
  name:         string
  description:  string | null
  color:        string
  icon:         string | null
  is_private:   boolean
  is_active:    boolean
  order:        number
  created_at:   string
}

export interface Folder {
  id:          string
  space_id:    string
  name:        string
  description: string | null
  color:       string
  is_active:   boolean
  order:       number
  created_at:  string
}

export interface TaskList {
  id:          string
  space_id:    string
  folder_id:   string | null
  name:        string
  description: string | null
  color:       string
  is_active:   boolean
  order:       number
  created_at:  string
}

export type Theme = 'light' | 'dark' | 'corporate' | 'dim'
