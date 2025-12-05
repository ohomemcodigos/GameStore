import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../api/auth';
import { User, Mail, Lock, AtSign, ArrowLeft, UserPlus } from 'lucide-react';
import fitaImg from '../assets/fita.png';

export function Register() {
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.register({ name, nickname, email, password });
      alert('Conta criada com sucesso! Faça login para continuar.');
      navigate('/login');
    } catch (err: any) {
      console.error(err);
      const backendError = err.response?.data?.error;
      setError(backendError || 'Erro ao criar conta.');
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
    padding: '12px 12px 12px 40px',
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
      background: 'radial-gradient(circle at top, #1a1a2e, #000)',
      color: '#e0e0e0',
      fontFamily: "system-ui, sans-serif",
      padding: '20px'
    }}>
      
      <button 
        onClick={() => navigate('/')}
        style={{ position: 'absolute', top: 20, left: 20, background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <ArrowLeft size={20} /> Voltar para a Loja
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '450px' }}>
        
        <img 
          src={fitaImg} 
          alt="Retro Game Tape" 
          style={{ 
            width: '280px', 
            height: 'auto', 
            marginBottom: '-40px',
            zIndex: 1,
            filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.5))'
          }} 
        />

        <div style={{
          width: '100%',
          padding: '3rem 2rem 2rem 2rem',
          backgroundColor: '#1e1e1e', 
          borderRadius: '16px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)', 
          border: '1px solid #333', 
          zIndex: 2,
          position: 'relative'
        }}>
          
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff', margin: 0 }}>Crie sua conta</h2>
            <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '5px' }}>Junte-se a nós e comece sua coleção.</p>
          </div>
          
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Nome */}
            <div style={inputContainerStyle}>
              <User size={18} style={iconStyle} />
              <input 
                type="text" placeholder="Nome Completo" required 
                value={name} onChange={e => setName(e.target.value)} 
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = '#6c5ce7'}
                onBlur={(e) => e.target.style.borderColor = '#333'}
              />
            </div>

            {/* Nickname */}
            <div style={inputContainerStyle}>
              <AtSign size={18} style={iconStyle} />
              <input 
                type="text" placeholder="Apelido (Nickname)" required 
                value={nickname} onChange={e => setNickname(e.target.value)} 
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = '#6c5ce7'}
                onBlur={(e) => e.target.style.borderColor = '#333'}
              />
            </div>

            {/* Email */}
            <div style={inputContainerStyle}>
              <Mail size={18} style={iconStyle} />
              <input 
                type="email" placeholder="Seu melhor e-mail" required 
                value={email} onChange={e => setEmail(e.target.value)} 
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = '#6c5ce7'}
                onBlur={(e) => e.target.style.borderColor = '#333'}
              />
            </div>

            {/* Senha */}
            <div style={inputContainerStyle}>
              <Lock size={18} style={iconStyle} />
              <input 
                type="password" placeholder="Crie uma senha (min 6 chars)" required minLength={6}
                value={password} onChange={e => setPassword(e.target.value)} 
                style={inputStyle}
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
                {loading ? 'Criando conta...' : <><UserPlus size={20} /> Cadastrar</>}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#aaa', textAlign: 'center', borderTop: '1px solid #333', paddingTop: '1.5rem' }}>
            <p>
              Já tem uma conta?{' '}
              <Link to="/login" style={{ color: '#6c5ce7', textDecoration: 'none', fontWeight: 'bold' }}>
                Faça Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}