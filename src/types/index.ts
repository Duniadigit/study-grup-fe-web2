export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Group {
  id: string;
  name: string;
  join_code: string;
  description: string;
  creator_id: string;
  deadline: string | null;
  status: 'active' | 'completed' | 'archived';
  member_count: number;
}

export interface Member extends User {
  role: 'creator' | 'admin' | 'member';
}

export interface Overview {
  id: string;
  group_id: string;
  content: string;
  attachment_url: string | null;
  updated_at: string;
}

export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
  id: string;
  group_id: string;
  title: string;
  description: string;
  assigned_to: string | null;
  assigned_to_name: string | null;
  priority: Priority;
  status: TaskStatus;
  due_date: string | null;
  image_url?: string | null;
}

export interface ChecklistItem {
  id: string;
  task_id: string;
  item: string;
  completed: boolean;
}

export interface Dashboard {
  groups: Group[];
  myTasks: Task[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  assigned_to?: string | null;
  priority?: Priority;
  due_date?: string | null;
}
