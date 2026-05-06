import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  getTasks, getChecklists, toggleChecklist,
  addChecklist, deleteTask, updateTaskStatus,
} from '../../services';
import { Task, ChecklistItem, TaskStatus } from '../../types';

const STATUS_NEXT: Record<TaskStatus, TaskStatus> = {
  todo: 'in_progress', in_progress: 'done', done: 'todo',
};

const STATUS_LABEL: Record<TaskStatus, string> = {
  todo: 'To Do', in_progress: 'In Progress', done: 'Done',
};

const STATUS_COLORS: Record<TaskStatus, { bg: string; text: string }> = {
  todo: { bg: '#F3F4F6', text: '#6B7280' },
  in_progress: { bg: '#FFFBEB', text: '#B45309' },
  done: { bg: '#F0FDF4', text: '#16A34A' },
};

const PRIORITY_COLOR: Record<string, string> = {
  low: '#22C55E', medium: '#F59E0B', high: '#EF4444',
};

function ConfirmDialog({ title, message, onConfirm, onCancel }: {
  title: string; message: string; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">{title}</div>
        <div className="modal-text">{message}</div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onCancel}>Batal</button>
          <button className="btn btn-danger" onClick={onConfirm}>Hapus</button>
        </div>
      </div>
    </div>
  );
}

export default function TaskDetailPage() {
  const { id: groupId, taskId } = useParams<{ id: string; taskId: string }>();
  const navigate = useNavigate();

  const [task, setTask] = useState<Task | null>(null);
  const [checklists, setChecklists] = useState<ChecklistItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(true);
  const [addingItem, setAddingItem] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const load = useCallback(async () => {
    const [allTasks, items] = await Promise.all([
      getTasks(groupId!),
      getChecklists(taskId!),
    ]);
    const found = allTasks.find((t) => t.id === taskId) ?? null;
    setTask(found);
    setChecklists(items);
    setLoading(false);
  }, [groupId, taskId]);

  useEffect(() => { load(); }, [load]);

  const handleToggle = async (item: ChecklistItem) => {
    setChecklists((prev) => prev.map((c) => c.id === item.id ? { ...c, completed: !c.completed } : c));
    await toggleChecklist(item.id, !item.completed);
  };

  const handleAddItem = async () => {
    if (!newItem.trim()) return;
    setAddingItem(true);
    try {
      const created = await addChecklist(taskId!, newItem.trim());
      setChecklists((prev) => [...prev, created]);
      setNewItem('');
    } finally {
      setAddingItem(false);
    }
  };

  const handleStatusChange = async () => {
    if (!task) return;
    const next = STATUS_NEXT[task.status];
    setTask((prev) => prev ? { ...prev, status: next } : prev);
    await updateTaskStatus(taskId!, next);
  };

  const handleDelete = async () => {
    await deleteTask(taskId!);
    navigate(`/groups/${groupId}/tasks`);
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (!task) return (
    <div className="page-body">
      <div className="empty-state"><div className="empty-state-title">Task tidak ditemukan</div></div>
    </div>
  );

  const completed = checklists.filter((c) => c.completed).length;
  const total = checklists.length;
  const progress = total > 0 ? completed / total : 0;

  return (
    <>
      {showConfirm && (
        <ConfirmDialog
          title="Hapus Task"
          message="Yakin ingin menghapus task ini?"
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <div className="page-header">
        <div>
          <div className="breadcrumb">
            <Link to="/groups">Grup</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to={`/groups/${groupId}/tasks`}>Tasks</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-current">{task.title}</span>
          </div>
          <h1 className="page-title" style={{ fontSize: 20 }}>{task.title}</h1>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            className="status-badge"
            style={{ background: STATUS_COLORS[task.status].bg, color: STATUS_COLORS[task.status].text, padding: '8px 16px', fontSize: 13 }}
            onClick={handleStatusChange}
            title="Klik untuk ubah status"
          >
            {STATUS_LABEL[task.status]} ↺
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => setShowConfirm(true)}>
            🗑 Hapus
          </button>
        </div>
      </div>

      <div className="page-body">
        <div className="task-detail-grid">
          {/* Left: Task info + Checklist */}
          <div>
            {/* Task Info Card */}
            <div className="card" style={{ marginBottom: 20 }}>
              {task.description && (
                <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7, marginBottom: 16 }}>{task.description}</p>
              )}

              <div style={{ display: 'flex', gap: 8, marginBottom: task.assigned_to_name || task.due_date ? 16 : 0 }}>
                <span
                  className="badge"
                  style={{
                    background: PRIORITY_COLOR[task.priority] + '20',
                    color: PRIORITY_COLOR[task.priority],
                    fontWeight: 600,
                  }}
                >
                  ● {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                </span>
              </div>

              {(task.assigned_to_name || task.due_date) && (
                <div className="info-grid">
                  {task.assigned_to_name && (
                    <div>
                      <div className="info-item-label">Assignee</div>
                      <div className="info-item-value">👤 {task.assigned_to_name}</div>
                    </div>
                  )}
                  {task.due_date && (
                    <div>
                      <div className="info-item-label">Due Date</div>
                      <div className="info-item-value">
                        📅 {new Date(task.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Checklist */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <h3 className="section-title" style={{ marginBottom: 0 }}>Checklist</h3>
                {total > 0 && (
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#4F46E5' }}>{completed}/{total}</span>
                )}
              </div>

              {total > 0 && (
                <div className="progress-bar" style={{ marginTop: 10, marginBottom: 12 }}>
                  <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
                </div>
              )}

              {checklists.length === 0 && (
                <p style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center', padding: '16px 0' }}>
                  Belum ada checklist item
                </p>
              )}

              {checklists.map((item) => (
                <div
                  key={item.id}
                  className="checklist-item"
                  onClick={() => handleToggle(item)}
                >
                  <div className={`checkbox ${item.completed ? 'done' : ''}`}>
                    {item.completed && '✓'}
                  </div>
                  <span className={`checklist-text ${item.completed ? 'done' : ''}`}>
                    {item.item}
                  </span>
                </div>
              ))}

              <div className="add-item-row">
                <input
                  className="input"
                  placeholder="Tambah item checklist..."
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                />
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleAddItem}
                  disabled={!newItem.trim() || addingItem}
                  style={{ flexShrink: 0 }}
                >
                  {addingItem ? '...' : '+ Tambah'}
                </button>
              </div>
            </div>
          </div>

          {/* Right: Side info */}
          <div>
            <div className="card">
              <h3 className="section-title">Info Task</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <div className="info-item-label">Status</div>
                  <div style={{ marginTop: 4 }}>
                    <span
                      className="badge"
                      style={{ background: STATUS_COLORS[task.status].bg, color: STATUS_COLORS[task.status].text }}
                    >
                      {STATUS_LABEL[task.status]}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="info-item-label">Prioritas</div>
                  <div style={{ marginTop: 4 }}>
                    <span
                      className="badge"
                      style={{ background: PRIORITY_COLOR[task.priority] + '20', color: PRIORITY_COLOR[task.priority] }}
                    >
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </div>
                </div>
                {task.assigned_to_name && (
                  <div>
                    <div className="info-item-label">Assignee</div>
                    <div className="info-item-value" style={{ marginTop: 4 }}>{task.assigned_to_name}</div>
                  </div>
                )}
                {task.due_date && (
                  <div>
                    <div className="info-item-label">Due Date</div>
                    <div className="info-item-value" style={{ marginTop: 4, fontFamily: "'DM Mono', monospace", fontSize: 12 }}>
                      {new Date(task.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                )}
                {total > 0 && (
                  <div>
                    <div className="info-item-label">Progress</div>
                    <div className="info-item-value" style={{ marginTop: 4 }}>
                      {completed}/{total} selesai ({Math.round(progress * 100)}%)
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
