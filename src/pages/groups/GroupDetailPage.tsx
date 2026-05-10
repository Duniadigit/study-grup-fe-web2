import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getGroupDetail, getMembers, deleteGroup } from '../../services';
import { useAuth } from '../../context/AuthContext';
import { Group, Member } from '../../types';

function ConfirmDialog({ title, message, onConfirm, onCancel }: {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
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

export default function GroupDetailPage() {
  const { id: groupId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  const load = useCallback(async () => {
    const [g, m] = await Promise.all([
      getGroupDetail(groupId!),
      getMembers(groupId!),
    ]);
    setGroup(g);
    setMembers(m);
    setLoading(false);
  }, [groupId]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    await deleteGroup(groupId!);
    navigate('/groups');
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (!group) return null;

  const isCreator = group.creator_id === user?.id;

  return (
    <>
      {showConfirm && (
        <ConfirmDialog
          title="Hapus Grup"
          message="Yakin ingin menghapus grup ini? Semua data akan hilang."
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <div className="page-header">
        <div>
          <div className="breadcrumb">
            <Link to="/groups">Grup</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-current">{group.name}</span>
          </div>
          <h1 className="page-title">{group.name}</h1>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#6B7280', background: '#F3F4F6', padding: '4px 8px', borderRadius: 6 }}>
              Kode: <strong>{group.join_code}</strong>
            </span>
            {group.deadline && (
              <p className="page-subtitle" style={{ margin: 0 }}>
                Deadline: {new Date(group.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="group-detail-layout">
          {/* Left: Menu + Description */}
          <div>
            {group.description && (
              <div className="card" style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7 }}>{group.description}</p>
              </div>
            )}

            <h2 className="section-title">Menu</h2>
            <div className="menu-grid">
              <Link to={`/groups/${groupId}/overview`} className="menu-item">
                <span className="menu-icon">📋</span>
                <span className="menu-label">Penjelasan Tugas</span>
              </Link>
              <Link to={`/groups/${groupId}/tasks`} className="menu-item">
                <span className="menu-icon">✅</span>
                <span className="menu-label">Todo List</span>
              </Link>
            </div>

            {isCreator && (
              <button className="btn btn-danger" style={{ width: '100%', marginTop: 8 }} onClick={() => setShowConfirm(true)}>
                🗑 Hapus Grup
              </button>
            )}
          </div>

          {/* Right: Members */}
          <div>
            <h2 className="section-title">Anggota ({members.length})</h2>
            <div className="card">
              {members.map((m) => (
                <div key={m.id} className="member-row">
                  <div className="avatar">{m.name.charAt(0).toUpperCase()}</div>
                  <div style={{ flex: 1 }}>
                    <div className="member-name">{m.name}</div>
                    <div className="member-email">{m.email}</div>
                  </div>
                  {m.role === 'creator' && (
                    <span className="badge badge-primary">Creator</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
