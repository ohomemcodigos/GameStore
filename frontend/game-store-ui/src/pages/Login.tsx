import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// Certifique-se que o caminho está correto
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
      setError('Erro ao logar. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  }

  // --- Estilos Inline ---
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column' as const, // Coloca um item embaixo do outro
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #000000, #5241b2)',
    color: '#e0e0e0',
    fontFamily: "'Inter', sans-serif",
    padding: '20px' // Um pouco de espaço nas bordas para mobile
  };

  const cardStyle = {
    width: '100%',
    maxWidth: '400px',
    padding: '2.5rem',
    backgroundColor: '#1e1e1e', 
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)', 
    border: '0px solid #333', 
    textAlign: 'center' as const,
  };

  const titleStyle = {
    fontSize: '1.8rem',
    fontWeight: '700',
    marginBottom: '2rem',
    marginTop: '0',
    color: '#fff',
    letterSpacing: '1px',
  };

  const inputStyle = {
    width: '100%',
    padding: '14px',
    borderRadius: '8px',
    border: '0px solid #444',
    backgroundColor: '#2a2a2a', 
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box' as const,
  };

  const buttonStyle = {
    width: '100%',
    padding: '14px',
    cursor: loading ? 'not-allowed' : 'pointer',

    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    marginTop: '1rem',
    transition: 'background-color 0.2s',
    opacity: loading ? 0.7 : 1,
  };

  return (
    <div style={containerStyle}>
      
      <img 
        src={fitaImg} 
        alt="Retro Game Tape" 
        style={{ 
            width: '300px', // Bem maior agora
            marginTop: "-200px",
            height: 'auto', 
            marginBottom: '0px', // Espaço entre a imagem e o cartão
        }} 
      />

      <div style={cardStyle}>
        <h2 style={titleStyle}>Bem-vindo de volta!</h2>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', textAlign: 'left' }}>
          <div>
            <input 
                type="email" 
                placeholder="Seu e-mail" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                style={inputStyle}
                required
            />
          </div>
          <div>
            <input 

                type="password" 
                placeholder="Sua senha" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                style={inputStyle}
                required
            />
          </div>

          {error && (
            <div style={{ backgroundColor: 'rgba(255, 107, 107, 0.1)', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                <p style={{ color: '#ff6b6b', fontSize: '0.9rem', margin: 0 }}>{error}</p>
            </div>
          )}

          <button className='botao2' type="submit" disabled={loading} style={buttonStyle}>
              {loading ? 'Carregando...' : 'Entrar'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', fontSize: '0.95rem', color: '#aaa' }}>
          <p>
            Não tem uma conta?{' '}
            <Link to="/register" style={{ color: '#646cff', textDecoration: 'none', fontWeight: 'bold' }}>
              Cadastre-se aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}