import {
  AuthResponse, Group, Member, Overview,
  Task, ChecklistItem, Dashboard, CreateTaskPayload, TaskStatus,
} from '../types';

const BASE_URL = 'http://localhost:3001/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...getHeaders(), ...options?.headers },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const login = (email: string, password: string): Promise<AuthResponse> =>
  request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

export const register = (name: string, email: string, password: string): Promise<AuthResponse> =>
  request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });

export const getMyGroups = (): Promise<Group[]> => request('/groups');
export const getGroupDetail = (id: string): Promise<Group> => request(`/groups/${id}`);
export const createGroup = (data: { name: string; description: string; deadline?: string | null }): Promise<Group> =>
  request('/groups', { method: 'POST', body: JSON.stringify(data) });
export const deleteGroup = (id: string): Promise<void> => request(`/groups/${id}`, { method: 'DELETE' });
export const getMembers = (groupId: string): Promise<Member[]> => request(`/groups/${groupId}/members`);
export const getOverview = (groupId: string): Promise<Overview | null> => request(`/groups/${groupId}/overview`);
export const updateOverview = (groupId: string, content: string): Promise<Overview> =>
  request(`/groups/${groupId}/overview`, { method: 'POST', body: JSON.stringify({ content }) });
export const getTasks = (groupId: string): Promise<Task[]> => request(`/groups/${groupId}/tasks`);
export const createTask = (groupId: string, data: CreateTaskPayload): Promise<Task> =>
  request(`/groups/${groupId}/tasks`, { method: 'POST', body: JSON.stringify(data) });
export const updateTask = (taskId: string, data: Partial<Task>): Promise<Task> =>
  request(`/tasks/${taskId}`, { method: 'PATCH', body: JSON.stringify(data) });
export const updateTaskStatus = (taskId: string, status: TaskStatus): Promise<Task> =>
  request(`/tasks/${taskId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
export const deleteTask = (taskId: string): Promise<void> => request(`/tasks/${taskId}`, { method: 'DELETE' });
export const getChecklists = (taskId: string): Promise<ChecklistItem[]> => request(`/tasks/${taskId}/checklist`);
export const addChecklist = (taskId: string, item: string): Promise<ChecklistItem> =>
  request(`/tasks/${taskId}/checklist`, { method: 'POST', body: JSON.stringify({ item }) });
export const toggleChecklist = (checklistId: string, completed: boolean): Promise<ChecklistItem> =>
  request(`/checklists/${checklistId}`, { method: 'PATCH', body: JSON.stringify({ completed }) });
export const deleteChecklist = (checklistId: string): Promise<void> =>
  request(`/checklists/${checklistId}`, { method: 'DELETE' });
export const getDashboard = (): Promise<Dashboard> => request('/dashboard');
