import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) { setError('Semua field harus diisi'); return; }
    if (password !== confirmPassword) { setError('Password tidak cocok'); return; }
    if (password.length < 6) { setError('Password minimal 6 karakter'); return; }
    setLoading(true);
    setError('');
    try {
      await register(name, email, password);
      navigate('/groups');
    } catch {
      setError('Registrasi gagal, coba lagi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>StudyGroup</h1>
          <p>Buat akun baru</p>
        </div>

        <div className="auth-form">
          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#EF4444' }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label>Nama Lengkap</label>
            <input className="input" placeholder="contoh: Andi Pratama" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input className="input" type="email" placeholder="nama@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="input" type="password" placeholder="Min. 6 karakter" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Konfirmasi Password</label>
            <input className="input" type="password" placeholder="Ulangi password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>

          <button
            className="btn btn-primary btn-full"
            style={{ marginTop: 8, padding: '12px' }}
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? 'Mendaftar...' : 'Daftar'}
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#6B7280' }}>
          Sudah punya akun?{' '}
          <Link to="/auth/login" style={{ color: '#4F46E5', fontWeight: 600 }}>Masuk</Link>
        </p>
      </div>
    </div>
  );
}
