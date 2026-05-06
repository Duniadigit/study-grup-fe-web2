import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createTask, getMembers } from '../../services';
import { Member, Priority } from '../../types';

const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: '#22C55E' },
  { value: 'medium', label: 'Medium', color: '#F59E0B' },
  { value: 'high', label: 'High', color: '#EF4444' },
];

export default function CreateTaskPage() {
  const { id: groupId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState<string | null>(null);
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getMembers(groupId!).then(setMembers);
  }, [groupId]);

  const handleCreate = async () => {
    if (!title.trim()) { setError('Judul task harus diisi'); return; }
    setLoading(true);
    setError('');
    try {
      await createTask(groupId!, {
        title: title.trim(),
        description: description.trim(),
        assigned_to: assignedTo,
        priority,
        due_date: dueDate || null,
      });
      navigate(`/groups/${groupId}/tasks`);
    } catch {
      setError('Gagal membuat task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <div className="breadcrumb">
            <Link to="/groups">Grup</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to={`/groups/${groupId}/tasks`}>Tasks</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-current">Buat Task</span>
          </div>
          <h1 className="page-title">Buat Task Baru</h1>
        </div>
      </div>

      <div className="page-body">
        <div className="card" style={{ maxWidth: 600 }}>
          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#EF4444', marginBottom: 16 }}>
              {error}
            </div>
          )}

          <div className="form-stack">
            <div className="form-group">
              <label>Judul Task *</label>
              <input
                className="input"
                placeholder="contoh: Setup database schema"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
              />
            </div>

            <div className="form-group">
              <label>Deskripsi</label>
              <textarea
                className="input"
                placeholder="Jelaskan detail task ini..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Prioritas</label>
              <div className="priority-row">
                {PRIORITIES.map((p) => (
                  <button
                    key={p.value}
                    className="priority-btn"
                    style={priority === p.value ? { backgroundColor: p.color, borderColor: p.color, color: '#fff' } : {}}
                    onClick={() => setPriority(p.value)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Assign ke</label>
              <div className="member-list-select">
                <button
                  className={`member-btn ${assignedTo === null ? 'active' : ''}`}
                  onClick={() => setAssignedTo(null)}
                >
                  Tidak ada
                </button>
                {members.map((m) => (
                  <button
                    key={m.id}
                    className={`member-btn ${assignedTo === m.id ? 'active' : ''}`}
                    onClick={() => setAssignedTo(m.id)}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Due Date (opsional)</label>
              <input
                className="input"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            <button className="btn btn-ghost" onClick={() => navigate(`/groups/${groupId}/tasks`)}>Batal</button>
            <button className="btn btn-primary" onClick={handleCreate} disabled={loading}>
              {loading ? 'Menyimpan...' : 'Buat Task'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
