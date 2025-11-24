import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn({ email, password });
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Erro ao logar. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', height: '100vh', alignItems: 'center', backgroundColor: '#1a1a1a', color: 'white' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '2rem', backgroundColor: '#333', borderRadius: '8px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Login GameStore</h2>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
              type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} 
              style={{ padding: '10px', borderRadius: '4px', border: 'none' }}
          />
          <input 
              type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} 
              style={{ padding: '10px', borderRadius: '4px', border: 'none' }}
          />
          {error && <p style={{ color: '#ff6b6b', fontSize: '0.8rem' }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#646cff', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
              {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
          <p>Não tem uma conta? <Link to="/register" style={{ color: '#4ade80', textDecoration: 'none', fontWeight: 'bold' }}>Cadastre-se!</Link></p>
        </div>
      </div>
    </div>
  );
}