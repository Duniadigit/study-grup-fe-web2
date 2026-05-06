import { CURRENT_USER, DUMMY_CHECKLISTS, DUMMY_GROUPS, DUMMY_MEMBERS, DUMMY_OVERVIEWS, DUMMY_TASKS } from '../data/dummyData';
import {
  AuthResponse, Group, Member, Overview,
  Task, ChecklistItem, Dashboard, CreateTaskPayload, TaskStatus,
} from '../types';

const delay = (ms = 500): Promise<void> => new Promise((res) => setTimeout(res, ms));
const generateId = (): string => Math.random().toString(36).substr(2, 9);

// In-memory state
let groups = structuredClone(DUMMY_GROUPS) as Group[];
let members = structuredClone(DUMMY_MEMBERS) as Record<string, Member[]>;
let overviews = structuredClone(DUMMY_OVERVIEWS) as Record<string, Overview>;
let tasks = structuredClone(DUMMY_TASKS) as Record<string, Task[]>;
let checklists = structuredClone(DUMMY_CHECKLISTS) as Record<string, ChecklistItem[]>;

// AUTH
export const mockLogin = async (_email: string, _password: string): Promise<AuthResponse> => {
  await delay(800);
  return { token: 'dummy-token-123', user: CURRENT_USER };
};

export const mockRegister = async (name: string, email: string, _password: string): Promise<AuthResponse> => {
  await delay(800);
  return { token: 'dummy-token-new', user: { id: generateId(), name, email } };
};

// GROUPS
export const mockGetMyGroups = async (): Promise<Group[]> => {
  await delay(500);
  return groups;
};

export const mockGetGroupDetail = async (groupId: string): Promise<Group> => {
  await delay(300);
  const group = groups.find((g) => g.id === groupId);
  if (!group) throw new Error('Grup tidak ditemukan');
  return group;
};

export const mockCreateGroup = async (data: {
  name: string;
  description: string;
  deadline?: string | null;
}): Promise<Group> => {
  await delay(700);
  const newGroup: Group = {
    id: generateId(),
    name: data.name,
    description: data.description,
    creator_id: CURRENT_USER.id,
    deadline: data.deadline ?? null,
    status: 'active',
    member_count: 1,
  };
  groups.push(newGroup);
  members[newGroup.id] = [{ ...CURRENT_USER, role: 'creator' }];
  tasks[newGroup.id] = [];
  return newGroup;
};

export const mockDeleteGroup = async (groupId: string): Promise<void> => {
  await delay(500);
  groups = groups.filter((g) => g.id !== groupId);
};

// MEMBERS
export const mockGetMembers = async (groupId: string): Promise<Member[]> => {
  await delay(300);
  return members[groupId] ?? [];
};

// OVERVIEW
export const mockGetOverview = async (groupId: string): Promise<Overview | null> => {
  await delay(300);
  return overviews[groupId] ?? null;
};

export const mockUpdateOverview = async (groupId: string, content: string): Promise<Overview> => {
  await delay(500);
  overviews[groupId] = {
    ...(overviews[groupId] ?? { id: generateId(), group_id: groupId, attachment_url: null }),
    content,
    updated_at: new Date().toISOString(),
  };
  return overviews[groupId];
};

// TASKS
export const mockGetTasks = async (groupId: string): Promise<Task[]> => {
  await delay(500);
  return tasks[groupId] ?? [];
};

export const mockCreateTask = async (groupId: string, data: CreateTaskPayload): Promise<Task> => {
  await delay(600);
  const assignee = members[groupId]?.find((m) => m.id === data.assigned_to);
  const newTask: Task = {
    id: generateId(),
    group_id: groupId,
    title: data.title,
    description: data.description ?? '',
    assigned_to: data.assigned_to ?? null,
    assigned_to_name: assignee?.name ?? null,
    priority: data.priority ?? 'medium',
    status: 'todo',
    due_date: data.due_date ?? null,
  };
  if (!tasks[groupId]) tasks[groupId] = [];
  tasks[groupId].unshift(newTask);
  checklists[newTask.id] = [];
  return newTask;
};

export const mockUpdateTask = async (taskId: string, data: Partial<Task>): Promise<Task> => {
  await delay(400);
  for (const gid of Object.keys(tasks)) {
    const idx = tasks[gid].findIndex((t) => t.id === taskId);
    if (idx !== -1) {
      tasks[gid][idx] = { ...tasks[gid][idx], ...data };
      return tasks[gid][idx];
    }
  }
  throw new Error('Task tidak ditemukan');
};

export const mockUpdateTaskStatus = async (taskId: string, status: TaskStatus): Promise<Task> => {
  await delay(300);
  for (const gid of Object.keys(tasks)) {
    const idx = tasks[gid].findIndex((t) => t.id === taskId);
    if (idx !== -1) {
      tasks[gid][idx].status = status;
      return tasks[gid][idx];
    }
  }
  throw new Error('Task tidak ditemukan');
};

export const mockDeleteTask = async (taskId: string): Promise<void> => {
  await delay(400);
  for (const gid of Object.keys(tasks)) {
    tasks[gid] = tasks[gid].filter((t) => t.id !== taskId);
  }
};

// CHECKLISTS
export const mockGetChecklists = async (taskId: string): Promise<ChecklistItem[]> => {
  await delay(200);
  return checklists[taskId] ?? [];
};

export const mockAddChecklist = async (taskId: string, item: string): Promise<ChecklistItem> => {
  await delay(300);
  const newItem: ChecklistItem = { id: generateId(), task_id: taskId, item, completed: false };
  if (!checklists[taskId]) checklists[taskId] = [];
  checklists[taskId].push(newItem);
  return newItem;
};

export const mockToggleChecklist = async (checklistId: string, completed: boolean): Promise<ChecklistItem> => {
  await delay(150);
  for (const tid of Object.keys(checklists)) {
    const idx = checklists[tid].findIndex((c) => c.id === checklistId);
    if (idx !== -1) {
      checklists[tid][idx].completed = completed;
      return checklists[tid][idx];
    }
  }
  throw new Error('Item tidak ditemukan');
};

export const mockDeleteChecklist = async (checklistId: string): Promise<void> => {
  await delay(250);
  for (const tid of Object.keys(checklists)) {
    checklists[tid] = checklists[tid].filter((c) => c.id !== checklistId);
  }
};

// DASHBOARD
export const mockGetDashboard = async (): Promise<Dashboard> => {
  await delay(600);
  const myTasks = Object.values(tasks)
    .flat()
    .filter((t) => t.assigned_to === CURRENT_USER.id);
  return { groups, myTasks };
};
