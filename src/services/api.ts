import {
  AuthResponse, Group, Member, Overview,
  Task, ChecklistItem, Dashboard, CreateTaskPayload, TaskStatus,
} from '../types';

const BASE_URL = 'http://localhost:8000/api';

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

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const res = await request<{ data: AuthResponse }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return res.data;
};

export const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  const res = await request<{ data: AuthResponse }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  return res.data;
};

export const getMyGroups = async (): Promise<Group[]> => {
  const res = await request<{ data: Group[] }>('/groups');
  return res.data;
};

export const joinGroup = async (code: string): Promise<Group> => {
  const res = await request<{ data: Group }>('/groups/join', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });
  return res.data;
};

export const getGroupDetail = async (id: string): Promise<Group> => {
  const res = await request<{ data: Group }>(`/groups/${id}`);
  return res.data;
};

export const createGroup = async (data: { name: string; description: string; deadline?: string | null }): Promise<Group> => {
  const res = await request<{ data: Group }>('/groups', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.data;
};

export const deleteGroup = (id: string): Promise<void> => request(`/groups/${id}`, { method: 'DELETE' });

export const getMembers = (groupId: string): Promise<Member[]> => request(`/groups/${groupId}/members`);

export const getOverview = (groupId: string): Promise<Overview | null> => request(`/groups/${groupId}/overview`);

export const updateOverview = (groupId: string, content: string): Promise<Overview> =>
  request(`/groups/${groupId}/overview`, { method: 'POST', body: JSON.stringify({ content }) });

export const getTasks = async (groupId: string): Promise<Task[]> => {
  const res = await request<{ data: Task[] }>(`/groups/${groupId}/tasks`);
  return res.data;
};

export const createTask = async (groupId: string, data: CreateTaskPayload): Promise<Task> => {
  const res = await request<{ data: Task }>(`/groups/${groupId}/tasks`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.data;
};

export const updateTask = async (taskId: string, data: Partial<Task>): Promise<Task> => {
  const res = await request<{ data: Task }>(`/tasks/${taskId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return res.data;
};

export const updateTaskStatus = async (taskId: string, status: TaskStatus): Promise<Task> => {
  const res = await request<{ data: Task }>(`/tasks/${taskId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  return res.data;
};

export const deleteTask = (taskId: string): Promise<void> => request(`/tasks/${taskId}`, { method: 'DELETE' });

export const getChecklists = (taskId: string): Promise<ChecklistItem[]> => request(`/tasks/${taskId}/checklist`);

export const addChecklist = async (taskId: string, item: string): Promise<ChecklistItem> => {
  const res = await request<{ data: ChecklistItem }>(`/tasks/${taskId}/checklist`, {
    method: 'POST',
    body: JSON.stringify({ item }),
  });
  return res.data;
};

export const toggleChecklist = async (checklistId: string, completed: boolean): Promise<ChecklistItem> => {
  const res = await request<{ data: ChecklistItem }>(`/checklists/${checklistId}`, {
    method: 'PATCH',
    body: JSON.stringify({ completed }),
  });
  return res.data;
};

export const deleteChecklist = (checklistId: string): Promise<void> =>
  request(`/checklists/${checklistId}`, { method: 'DELETE' });

export const getDashboard = (): Promise<Dashboard> => request('/dashboard');

export const uploadTaskImage = async (_taskId: string, _file: File): Promise<string> => {
  throw new Error('Not implemented in real API yet');
};

export const updateOverviewAttachment = async (_groupId: string, _file: File): Promise<string> => {
  throw new Error('Not implemented in real API yet');
};
