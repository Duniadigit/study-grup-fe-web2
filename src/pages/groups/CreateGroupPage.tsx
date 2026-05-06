import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createGroup } from '../../services';

export default function CreateGroupPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!name.trim()) { setError('Nama grup harus diisi'); return; }
    setLoading(true);
    setError('');
    try {
      await createGroup({ name: name.trim(), description: description.trim(), deadline: deadline || null });
      navigate('/groups');
    } catch {
      setError('Gagal membuat grup');
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
            <span className="breadcrumb-current">Buat Grup</span>
          </div>
          <h1 className="page-title">Buat Grup Baru</h1>
        </div>
      </div>

      <div className="page-body">
        <div className="card" style={{ maxWidth: 560 }}>
          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#EF4444', marginBottom: 16 }}>
              {error}
            </div>
          )}

          <div className="form-stack">
            <div className="form-group">
              <label>Nama Grup *</label>
              <input
                className="input"
                placeholder="contoh: Tugas Besar PABP"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={80}
              />
            </div>

            <div className="form-group">
              <label>Deskripsi</label>
              <textarea
                className="input"
                placeholder="Jelaskan tujuan grup ini..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="form-group">
              <label>Deadline (opsional)</label>
              <input
                className="input"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            <button className="btn btn-ghost" onClick={() => navigate('/groups')}>Batal</button>
            <button className="btn btn-primary" onClick={handleCreate} disabled={loading}>
              {loading ? 'Menyimpan...' : 'Buat Grup'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
