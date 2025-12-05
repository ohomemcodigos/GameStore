import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowLeft, LogIn } from 'lucide-react';
import fitaImg from '../assets/fita.png';

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
      setError('E-mail ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  }

  // Styles Helpers
  const inputContainerStyle = {
    position: 'relative' as const,
  };

  const iconStyle = {
    position: 'absolute' as const,
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#888',
    pointerEvents: 'none' as const
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 12px 12px 40px', // Espaço para o ícone
    borderRadius: '8px',
    border: '1px solid #333',
    backgroundColor: '#2a2a2a', 
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box' as const,
    transition: 'border-color 0.2s'
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'radial-gradient(circle at top, #1a1a2e, #000)', // Fundo mais moderno
      color: '#e0e0e0',
      fontFamily: "system-ui, sans-serif",
      padding: '20px'
    }}>
      
      {/* Botão flutuante para voltar */}
      <button 
        onClick={() => navigate('/')}
        style={{ position: 'absolute', top: 20, left: 20, background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <ArrowLeft size={20} /> Voltar para a Loja
      </button>

      {/* Container Centralizado */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '400px' }}>
        
        {/* Imagem Decorativa */}
        <img 
          src={fitaImg} 
          alt="Retro Game Tape" 
          style={{ 
            width: '280px', 
            height: 'auto', 
            marginBottom: '-40px', // Faz a fita "entrar" um pouco no card
            zIndex: 1,
            filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.5))'
          }} 
        />

        {/* Card de Login */}
        <div style={{
          width: '100%',
          padding: '3rem 2rem 2rem 2rem', // Padding top maior por causa da fita
          backgroundColor: '#1e1e1e', 
          borderRadius: '16px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)', 
          border: '1px solid #333', 
          zIndex: 2,
          position: 'relative'
        }}>
          
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff', margin: 0 }}>Bem-vindo de volta!</h2>
            <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '5px' }}>Insira suas credenciais para acessar.</p>
          </div>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            
            <div style={inputContainerStyle}>
              <Mail size={18} style={iconStyle} />
              <input 
                type="email" 
                placeholder="Seu e-mail" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                style={inputStyle}
                required
                onFocus={(e) => e.target.style.borderColor = '#6c5ce7'}
                onBlur={(e) => e.target.style.borderColor = '#333'}
              />
            </div>

            <div style={inputContainerStyle}>
              <Lock size={18} style={iconStyle} />
              <input 
                type="password" 
                placeholder="Sua senha" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                style={inputStyle}
                required
                onFocus={(e) => e.target.style.borderColor = '#6c5ce7'}
                onBlur={(e) => e.target.style.borderColor = '#333'}
              />
            </div>

            {error && (
              <div style={{ backgroundColor: 'rgba(231, 76, 60, 0.1)', padding: '10px', borderRadius: '6px', textAlign: 'center', border: '1px solid rgba(231, 76, 60, 0.2)' }}>
                <p style={{ color: '#e74c3c', fontSize: '0.85rem', margin: 0 }}>{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px', cursor: loading ? 'not-allowed' : 'pointer',
              background: loading ? '#444' : '#6c5ce7', color: 'white', border: 'none', borderRadius: '8px',
              fontWeight: 'bold', fontSize: '1rem', marginTop: '0.5rem', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
            }}>
                {loading ? 'Carregando...' : <><LogIn size={20} /> Entrar</>}
            </button>
          </form>

          <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#aaa', textAlign: 'center', borderTop: '1px solid #333', paddingTop: '1.5rem' }}>
            <p>
              Não tem uma conta?{' '}
              <Link to="/register" style={{ color: '#6c5ce7', textDecoration: 'none', fontWeight: 'bold' }}>
                Cadastre-se grátis
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}