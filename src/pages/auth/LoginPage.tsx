import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) { setError('Email dan password harus diisi'); return; }
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/groups');
    } catch {
      setError('Email atau password salah');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>StudyGroup</h1>
          <p>Masuk ke akun Anda</p>
        </div>

        <div className="auth-form">
          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#EF4444' }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              className="input"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="current-password"
            />
          </div>

          <button
            className="btn btn-primary btn-full"
            style={{ marginTop: 8, padding: '12px' }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#6B7280' }}>
          Belum punya akun?{' '}
          <Link to="/auth/register" style={{ color: '#4F46E5', fontWeight: 600 }}>Daftar</Link>
        </p>
      </div>
    </div>
  );
}
