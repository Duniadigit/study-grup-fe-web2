import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboard } from '../services';
import { Task, TaskStatus, Priority } from '../types';
import { exportTasksToCSV } from '../utils/exportCSV';

const STATUS_LABEL: Record<TaskStatus, string> = {
  todo: 'To Do', in_progress: 'In Progress', done: 'Done',
};

const STATUS_COLORS: Record<TaskStatus, { bg: string; text: string }> = {
  todo: { bg: 'var(--col-todo-bg)', text: 'var(--col-todo-text)' },
  in_progress: { bg: 'var(--col-wip-bg)', text: 'var(--col-wip-text)' },
  done: { bg: 'var(--col-done-bg)', text: 'var(--col-done-text)' },
};

const PRIORITY_COLOR: Record<string, string> = {
  low: '#22C55E', medium: '#F59E0B', high: '#EF4444',
};

export default function DashboardPage() {
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const navigate = useNavigate();

  const load = useCallback(async () => {
    const data = await getDashboard();
    setMyTasks(data.myTasks);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = myTasks.filter((t) => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return true;
  });

  const pending = myTasks.filter((t) => t.status !== 'done').length;
  const done = myTasks.filter((t) => t.status === 'done').length;
  const hasFilter = search || priorityFilter !== 'all' || statusFilter !== 'all';

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Tugas Saya</h1>
          <p className="page-subtitle">Semua task yang di-assign ke kamu</p>
        </div>
        <button
          className="btn btn-ghost"
          onClick={() => exportTasksToCSV(filtered, 'tugas-saya')}
          title="Export ke CSV"
          disabled={myTasks.length === 0}
        >
          ⬇ Export CSV
        </button>
      </div>

      <div className="page-body">
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : (
          <>
            <div className="stat-row">
              <div className="stat-card">
                <div className="stat-number" style={{ color: '#F59E0B' }}>{pending}</div>
                <div className="stat-label">Belum Selesai</div>
              </div>
              <div className="stat-card">
                <div className="stat-number" style={{ color: '#22C55E' }}>{done}</div>
                <div className="stat-label">Selesai</div>
              </div>
              <div className="stat-card">
                <div className="stat-number" style={{ color: '#4F46E5' }}>{myTasks.length}</div>
                <div className="stat-label">Total Task</div>
              </div>
            </div>

            {myTasks.length > 0 && (
              <div className="filter-bar" style={{ marginBottom: 20 }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: 280 }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }}>🔍</span>
                  <input
                    className="input"
                    style={{ paddingLeft: 34, fontSize: 13 }}
                    placeholder="Cari task..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <select className="input" style={{ width: 'auto', fontSize: 13 }} value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value as Priority | 'all')}>
                  <option value="all">Semua Prioritas</option>
                  <option value="high">🔴 High</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="low">🟢 Low</option>
                </select>
                <select className="input" style={{ width: 'auto', fontSize: 13 }} value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}>
                  <option value="all">Semua Status</option>
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                {hasFilter && (
                  <button className="btn btn-ghost btn-sm"
                    onClick={() => { setSearch(''); setPriorityFilter('all'); setStatusFilter('all'); }}>
                    ✕ Reset
                  </button>
                )}
              </div>
            )}

            {myTasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🎉</div>
                <div className="empty-state-title">Tidak ada task</div>
                <p className="empty-state-text">Kamu belum di-assign ke task apapun</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <div className="empty-state-title">Tidak ada hasil</div>
                <p className="empty-state-text">Coba ubah filter pencarian</p>
              </div>
            ) : (
              <div className="task-list">
                {filtered.map((task) => (
                  <div
                    key={task.id}
                    className="task-card"
                    onClick={() => navigate(`/groups/${task.group_id}/tasks/${task.id}`)}
                  >
                    <div className="task-card-row">
                      <div className="priority-dot" style={{ backgroundColor: PRIORITY_COLOR[task.priority] }} />
                      <span className="task-title">{task.title}</span>
                      <span className="badge" style={{ background: STATUS_COLORS[task.status].bg, color: STATUS_COLORS[task.status].text }}>
                        {STATUS_LABEL[task.status]}
                      </span>
                    </div>
                    {task.due_date && (
                      <p className="task-due" style={{ marginLeft: 19 }}>
                        📅 Deadline: {new Date(task.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
