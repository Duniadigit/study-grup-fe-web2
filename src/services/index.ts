import * as mock from './mockService';
import * as real from './api';

const USE_MOCK = true; // ← ganti false saat backend siap

export const login = USE_MOCK ? mock.mockLogin : real.login;
export const register = USE_MOCK ? mock.mockRegister : real.register;
export const getMyGroups = USE_MOCK ? mock.mockGetMyGroups : real.getMyGroups;
export const getGroupDetail = USE_MOCK ? mock.mockGetGroupDetail : real.getGroupDetail;
export const createGroup = USE_MOCK ? mock.mockCreateGroup : real.createGroup;
export const deleteGroup = USE_MOCK ? mock.mockDeleteGroup : real.deleteGroup;
export const getMembers = USE_MOCK ? mock.mockGetMembers : real.getMembers;
export const getOverview = USE_MOCK ? mock.mockGetOverview : real.getOverview;
export const updateOverview = USE_MOCK ? mock.mockUpdateOverview : real.updateOverview;
export const getTasks = USE_MOCK ? mock.mockGetTasks : real.getTasks;
export const createTask = USE_MOCK ? mock.mockCreateTask : real.createTask;
export const updateTask = USE_MOCK ? mock.mockUpdateTask : real.updateTask;
export const updateTaskStatus = USE_MOCK ? mock.mockUpdateTaskStatus : real.updateTaskStatus;
export const deleteTask = USE_MOCK ? mock.mockDeleteTask : real.deleteTask;
export const getChecklists = USE_MOCK ? mock.mockGetChecklists : real.getChecklists;
export const addChecklist = USE_MOCK ? mock.mockAddChecklist : real.addChecklist;
export const toggleChecklist = USE_MOCK ? mock.mockToggleChecklist : real.toggleChecklist;
export const deleteChecklist = USE_MOCK ? mock.mockDeleteChecklist : real.deleteChecklist;
export const getDashboard = USE_MOCK ? mock.mockGetDashboard : real.getDashboard;
