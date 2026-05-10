import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getMyGroups } from '../../services';
import { Group } from '../../types';

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    const data = await getMyGroups();
    setGroups(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Grup Saya</h1>
          <p className="page-subtitle">{groups.length} grup aktif</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={() => navigate('/groups/join')}>
            Gabung Grup
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/groups/create')}>
            + Buat Grup
          </button>
        </div>
      </div>

      <div className="page-body">
        {loading ? (
          <div className="loading-center">
            <div className="spinner" />
          </div>
        ) : groups.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <div className="empty-state-title">Belum ada grup</div>
            <p className="empty-state-text">Buat grup baru atau gabung ke grup yang sudah ada</p>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button className="btn btn-ghost" onClick={() => navigate('/groups/join')}>
                Gabung Grup
              </button>
              <button className="btn btn-primary" onClick={() => navigate('/groups/create')}>
                + Buat Grup Pertama
              </button>
            </div>
          </div>
        ) : (
          <div className="groups-grid">
            {groups.map((group) => (
              <Link key={group.id} to={`/groups/${group.id}`} className="group-card">
                <div className="group-card-header">
                  <span className="group-card-name">{group.name}</span>
                  <span className="badge badge-gray">{group.member_count} anggota</span>
                </div>
                <p className="group-card-desc">{group.description || 'Tidak ada deskripsi'}</p>
                <div className="group-card-footer">
                  <span style={{ fontSize: 12, color: '#9CA3AF' }}>Grup aktif</span>
                  {group.deadline && (
                    <span className="group-card-deadline">
                      📅 {new Date(group.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
