import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { joinGroup } from '../../services';

export default function JoinGroupPage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleJoin = async () => {
    if (!code.trim()) {
      setError('Kode grup harus diisi');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const group = await joinGroup(code.trim().toUpperCase());
      navigate(`/groups/${group.id}`);
    } catch (err: any) {
      setError(err.message || 'Gagal bergabung ke grup. Pastikan Kode Grup benar.');
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
            <span className="breadcrumb-current">Gabung Grup</span>
          </div>
          <h1 className="page-title">Gabung Grup</h1>
        </div>
      </div>

      <div className="page-body">
        <div className="card" style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: 32 }}>
            <p style={{ color: '#6B7280', fontSize: 14 }}>
              Masukkan Kode Grup yang diberikan oleh temanmu untuk bergabung ke dalam grup.
            </p>
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#EF4444', marginBottom: 20 }}>
              {error}
            </div>
          )}

          <div className="form-group" style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Kode Grup</label>
            <input
              className="input"
              placeholder="CONTOH: AB12CD"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              style={{ textAlign: 'center', fontSize: 24, letterSpacing: 4, fontWeight: 700, padding: '16px' }}
              autoFocus
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 32 }}>
            <button 
              className="btn btn-primary" 
              onClick={handleJoin} 
              disabled={loading}
              style={{ padding: '14px', fontSize: 16 }}
            >
              {loading ? 'Bergabung...' : 'Gabung Sekarang'}
            </button>
            <button className="btn btn-ghost" onClick={() => navigate('/groups')}>Batal</button>
          </div>

          <div style={{ marginTop: 40, padding: 16, backgroundColor: '#EEF2FF', borderRadius: 12, borderWidth: 1, borderColor: '#C7D2FE', textAlign: 'left' }}>
            <p style={{ fontSize: 13, color: '#4338CA', lineHeight: 1.5, margin: 0 }}>
              💡 <strong>Tip:</strong> Mintalah pembuat grup untuk memberikan Kode Grup yang tertera di halaman detail grup mereka.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
