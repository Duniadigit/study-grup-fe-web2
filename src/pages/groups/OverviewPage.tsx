import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOverview, updateOverview, getGroupDetail } from '../../services';
import { useAuth } from '../../context/AuthContext';
import { Overview, Group } from '../../types';

export default function OverviewPage() {
  const { id: groupId } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [overview, setOverview] = useState<Overview | null>(null);
  const [group, setGroup] = useState<Group | null>(null);
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const [ov, grp] = await Promise.all([getOverview(groupId!), getGroupDetail(groupId!)]);
    setOverview(ov);
    setContent(ov?.content ?? '');
    setGroup(grp);
    setLoading(false);
  }, [groupId]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    if (!content.trim()) { setError('Penjelasan tidak boleh kosong'); return; }
    setSaving(true);
    setError('');
    try {
      const updated = await updateOverview(groupId!, content.trim());
      setOverview(updated);
      setEditing(false);
    } catch {
      setError('Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const isCreator = group?.creator_id === user?.id;

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <>
      <div className="page-header">
        <div>
          <div className="breadcrumb">
            <Link to="/groups">Grup</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to={`/groups/${groupId}`}>{group?.name}</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-current">Penjelasan Tugas</span>
          </div>
          <h1 className="page-title">Penjelasan Tugas</h1>
        </div>
        {!editing && isCreator && (
          <button className="btn btn-outline" onClick={() => setEditing(true)}>
            ✏️ {overview?.content ? 'Edit' : 'Tambah Penjelasan'}
          </button>
        )}
      </div>

      <div className="page-body">
        <div className="card" style={{ maxWidth: 760 }}>
          {editing ? (
            <div>
              {error && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#EF4444', marginBottom: 16 }}>
                  {error}
                </div>
              )}
              <textarea
                className="input"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={14}
                placeholder="Tulis penjelasan tugas di sini..."
                autoFocus
                style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, lineHeight: 1.7 }}
              />
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button
                  className="btn btn-ghost"
                  onClick={() => { setContent(overview?.content ?? ''); setEditing(false); setError(''); }}
                >
                  Batal
                </button>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </div>
          ) : overview?.content ? (
            <div>
              <pre className="overview-content">{overview.content}</pre>
              {overview.updated_at && (
                <p className="overview-meta">
                  Diperbarui: {new Date(overview.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              )}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <div className="empty-state-title">Belum ada penjelasan tugas</div>
              {isCreator && <p className="empty-state-text">Klik tombol "Tambah Penjelasan" di kanan atas untuk mulai mengisi</p>}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
