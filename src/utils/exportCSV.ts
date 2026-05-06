import { Task } from '../types';

const STATUS_LABEL: Record<string, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

const PRIORITY_LABEL: Record<string, string> = {
  low: 'Rendah',
  medium: 'Sedang',
  high: 'Tinggi',
};

export function exportTasksToCSV(tasks: Task[], filename = 'tasks') {
  const headers = ['Judul', 'Deskripsi', 'Status', 'Prioritas', 'Assignee', 'Due Date'];

  const rows = tasks.map((t) => [
    `"${t.title.replace(/"/g, '""')}"`,
    `"${(t.description ?? '').replace(/"/g, '""')}"`,
    STATUS_LABEL[t.status] ?? t.status,
    PRIORITY_LABEL[t.priority] ?? t.priority,
    t.assigned_to_name ?? '-',
    t.due_date ? new Date(t.due_date).toLocaleDateString('id-ID') : '-',
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const BOM = '\uFEFF'; // UTF-8 BOM for Excel compatibility
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
