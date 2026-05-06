import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTasks, updateTaskStatus } from '../../services';
import { Task, TaskStatus, Priority } from '../../types';
import { exportTasksToCSV } from '../../utils/exportCSV';

const PRIORITY_COLOR: Record<string, string> = {
  low: '#22C55E', medium: '#F59E0B', high: '#EF4444',
};

const STATUS_LABEL: Record<TaskStatus, string> = {
  todo: 'To Do', in_progress: 'In Progress', done: 'Done',
};

const STATUS_COLORS: Record<TaskStatus, { bg: string; text: string; border: string }> = {
  todo:        { bg: 'var(--col-todo-bg)',  text: 'var(--col-todo-text)',  border: 'var(--col-todo-border)' },
  in_progress: { bg: 'var(--col-wip-bg)',   text: 'var(--col-wip-text)',   border: 'var(--col-wip-border)'  },
  done:        { bg: 'var(--col-done-bg)',  text: 'var(--col-done-text)',  border: 'var(--col-done-border)' },
};

const COLUMNS: TaskStatus[] = ['todo', 'in_progress', 'done'];

type ViewMode = 'kanban' | 'list';

interface FilterState {
  search: string;
  priority: Priority | 'all';
  assignee: string;
}

// ─── Kanban Card ────────────────────────────────────────────────────────────
function KanbanCard({
  task, onDragStart, onClick,
}: {
  task: Task;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onClick: () => void;
}) {
  return (
    <div
      className="kanban-card"
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onClick={onClick}
      title="Drag untuk pindah kolom • Klik untuk detail"
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
        <div className="priority-dot" style={{ backgroundColor: PRIORITY_COLOR[task.priority], marginTop: 4, flexShrink: 0 }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-900)', lineHeight: 1.4 }}>{task.title}</span>
      </div>
      {task.description && (
        <p style={{ fontSize: 12, color: 'var(--gray-500)', lineHeight: 1.5, marginLeft: 16, marginBottom: 8,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {task.description}
        </p>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginLeft: 16, marginTop: 4 }}>
        {task.assigned_to_name
          ? <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>👤 {task.assigned_to_name}</span>
          : <span />}
        {task.due_date && (
          <span style={{ fontSize: 11, color: 'var(--gray-400)', fontFamily: "'DM Mono', monospace" }}>
            {new Date(task.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Kanban Column ───────────────────────────────────────────────────────────
function KanbanColumn({
  status, tasks, onDragStart, onDrop, onDragOver, onCardClick,
}: {
  status: TaskStatus;
  tasks: Task[];
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onDrop: (e: React.DragEvent, status: TaskStatus) => void;
  onDragOver: (e: React.DragEvent) => void;
  onCardClick: (task: Task) => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const colors = STATUS_COLORS[status];

  return (
    <div
      className={`kanban-column ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); onDragOver(e); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => { setIsDragOver(false); onDrop(e, status); }}
    >
      <div className="kanban-col-header" style={{ borderTopColor: colors.border }}>
        <span style={{ fontWeight: 700, fontSize: 13, color: colors.text }}>{STATUS_LABEL[status]}</span>
        <span className="badge" style={{ background: colors.bg, color: colors.text }}>{tasks.length}</span>
      </div>
      <div className="kanban-col-body">
        {tasks.map((task) => (
          <KanbanCard
            key={task.id}
            task={task}
            onDragStart={onDragStart}
            onClick={() => onCardClick(task)}
          />
        ))}
        {tasks.length === 0 && (
          <div style={{ textAlign: 'center', padding: '24px 12px', color: 'var(--gray-300)', fontSize: 12 }}>
            Drop task di sini
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function TaskListPage() {
  const { id: groupId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [filter, setFilter] = useState<FilterState>({ search: '', priority: 'all', assignee: '' });
  const dragTask = useRef<Task | null>(null);

  const load = useCallback(async () => {
    const data = await getTasks(groupId!);
    setTasks(data);
    setLoading(false);
  }, [groupId]);

  useEffect(() => { load(); }, [load]);

  // ── Drag & Drop ──
  const handleDragStart = (e: React.DragEvent, task: Task) => {
    dragTask.current = task;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = async (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    if (!dragTask.current || dragTask.current.status === status) return;
    const moved = dragTask.current;
    dragTask.current = null;
    setTasks((prev) => prev.map((t) => t.id === moved.id ? { ...t, status } : t));
    await updateTaskStatus(moved.id, status);
  };

  // ── Filter ──
  const allAssignees = Array.from(new Set(tasks.map((t) => t.assigned_to_name).filter(Boolean))) as string[];

  const filtered = tasks.filter((t) => {
    if (filter.search && !t.title.toLowerCase().includes(filter.search.toLowerCase()) &&
        !t.description?.toLowerCase().includes(filter.search.toLowerCase())) return false;
    if (filter.priority !== 'all' && t.priority !== filter.priority) return false;
    if (filter.assignee && t.assigned_to_name !== filter.assignee) return false;
    return true;
  });

  const counts = {
    todo: filtered.filter((t) => t.status === 'todo').length,
    in_progress: filtered.filter((t) => t.status === 'in_progress').length,
    done: filtered.filter((t) => t.status === 'done').length,
  };

  const hasFilter = filter.search || filter.priority !== 'all' || filter.assignee;

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <>
      <div className="page-header">
        <div>
          <div className="breadcrumb">
            <Link to="/groups">Grup</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to={`/groups/${groupId}`}>Detail Grup</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-current">Tasks</span>
          </div>
          <h1 className="page-title">Todo List</h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {/* View toggle */}
          <div className="view-toggle">
            <button
              className={`view-toggle-btn ${viewMode === 'kanban' ? 'active' : ''}`}
              onClick={() => setViewMode('kanban')}
              title="Kanban view"
            >
              ⊞ Kanban
            </button>
            <button
              className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              ☰ List
            </button>
          </div>
          {/* Export */}
          <button
            className="btn btn-ghost"
            onClick={() => exportTasksToCSV(filtered, `tasks-grup-${groupId}`)}
            title="Export ke CSV"
          >
            ⬇ Export CSV
          </button>
          <button className="btn btn-primary" onClick={() => navigate(`/groups/${groupId}/tasks/create`)}>
            + Tambah Task
          </button>
        </div>
      </div>

      <div className="page-body">
        {/* ── Filter Bar ── */}
        <div className="filter-bar">
          <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)', fontSize: 14 }}>🔍</span>
            <input
              className="input"
              style={{ paddingLeft: 34, fontSize: 13 }}
              placeholder="Cari task..."
              value={filter.search}
              onChange={(e) => setFilter((f) => ({ ...f, search: e.target.value }))}
            />
          </div>

          <select
            className="input"
            style={{ width: 'auto', fontSize: 13, cursor: 'pointer' }}
            value={filter.priority}
            onChange={(e) => setFilter((f) => ({ ...f, priority: e.target.value as Priority | 'all' }))}
          >
            <option value="all">Semua Prioritas</option>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>

          <select
            className="input"
            style={{ width: 'auto', fontSize: 13, cursor: 'pointer' }}
            value={filter.assignee}
            onChange={(e) => setFilter((f) => ({ ...f, assignee: e.target.value }))}
          >
            <option value="">Semua Anggota</option>
            {allAssignees.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>

          {hasFilter && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setFilter({ search: '', priority: 'all', assignee: '' })}
            >
              ✕ Reset
            </button>
          )}

          {hasFilter && (
            <span style={{ fontSize: 12, color: 'var(--gray-500)', alignSelf: 'center' }}>
              {filtered.length} dari {tasks.length} task
            </span>
          )}
        </div>

        {/* ── Stats ── */}
        <div className="stat-row">
          {COLUMNS.map((s) => (
            <div key={s} className="stat-card">
              <div className="stat-number" style={{ color: STATUS_COLORS[s].text }}>{counts[s]}</div>
              <div className="stat-label">{STATUS_LABEL[s]}</div>
            </div>
          ))}
        </div>

        {/* ── Empty ── */}
        {tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">✅</div>
            <div className="empty-state-title">Belum ada task</div>
            <p className="empty-state-text">Tambahkan task untuk mulai berkolaborasi</p>
            <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => navigate(`/groups/${groupId}/tasks/create`)}>
              + Tambah Task Pertama
            </button>
          </div>
        ) : viewMode === 'kanban' ? (
          /* ── Kanban View ── */
          <div className="kanban-board">
            {COLUMNS.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                tasks={filtered.filter((t) => t.status === status)}
                onDragStart={handleDragStart}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onCardClick={(task) => navigate(`/groups/${groupId}/tasks/${task.id}`)}
              />
            ))}
          </div>
        ) : (
          /* ── List View ── */
          <div className="task-list">
            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <div className="empty-state-title">Tidak ada hasil</div>
                <p className="empty-state-text">Coba ubah filter pencarian</p>
              </div>
            ) : filtered.map((task) => (
              <div
                key={task.id}
                className="task-card"
                onClick={() => navigate(`/groups/${groupId}/tasks/${task.id}`)}
              >
                <div className="task-card-row">
                  <div className="priority-dot" style={{ backgroundColor: PRIORITY_COLOR[task.priority] }} />
                  <span className="task-title">{task.title}</span>
                </div>
                {task.description && (
                  <p className="task-desc" style={{ marginLeft: 19, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {task.description}
                  </p>
                )}
                <div className="task-footer" style={{ marginLeft: 19 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {task.assigned_to_name && <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>👤 {task.assigned_to_name}</span>}
                    {task.due_date && <span className="task-due">📅 {new Date(task.due_date).toLocaleDateString('id-ID')}</span>}
                  </div>
                  <span
                    className="badge"
                    style={{ background: STATUS_COLORS[task.status].bg, color: STATUS_COLORS[task.status].text }}
                  >
                    {STATUS_LABEL[task.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
