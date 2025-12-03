import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../api/auth';
// Importando a mesma imagem para manter o padrão
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

  // --- Estilos (Mesmo padrão do Login) ---
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #000000, #5241b2)',
    color: '#e0e0e0',
    fontFamily: "'Inter', sans-serif",
    padding: '2rem 1rem' // Um pouco de padding para telas menores
  };

  const cardStyle = {
    width: '100%',
    maxWidth: '450px', // Um pouco mais largo que o login pois tem mais campos
    padding: '2.5rem',
    backgroundColor: '#1e1e1e', 
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)', 
    border: '0px solid #333', 
  };

  const titleStyle = {
    fontSize: '1.8rem',
    fontWeight: '700',
    marginBottom: '1.5rem',
    marginTop: 0,
    color: '#fff',
    textAlign: 'center' as const,
    letterSpacing: '1px',
  };

  const labelStyle = {
    display: 'block', 
    marginBottom: '0.4rem', 
    fontSize: '0.9rem', 
    color: '#ccc',
    fontWeight: '500'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
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
    marginTop: '1.5rem',
    transition: 'background-color 0.2s',
    opacity: loading ? 0.7 : 1,
  };

  return (
    <div style={containerStyle}>
      
      {/* --- IMAGEM FORA DO CARD --- */}
      <img 
        src={fitaImg} 
        alt="Retro Game Tape" 
        style={{ 
            width: '300px', // Bem maior agora
            marginTop: "-120px",
            height: 'auto', 
            marginBottom: '10px', // Espaço entre a imagem e o cartão
        }} 
      />

      <div style={cardStyle}>
        <h2 style={titleStyle}>Crie sua Conta</h2>
        
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Nome Real */}
          <div>
            <label htmlFor="name" style={labelStyle}>Nome Completo</label>
            <input 
              id="name" type="text" required 
              value={name} onChange={e => setName(e.target.value)} 
              style={inputStyle}
            />
          </div>

          {/* Apelido */}
          <div>
            <label htmlFor="nickname" style={labelStyle}>Apelido (Nickname)</label>
            <input 
              id="nickname" type="text" required 
              value={nickname} onChange={e => setNickname(e.target.value)} 
              placeholder="Como quer ser chamado?"
              style={inputStyle}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" style={labelStyle}>Email</label>
            <input 
              id="email" type="email" required 
              value={email} onChange={e => setEmail(e.target.value)} 
              style={inputStyle}
            />
          </div>

          {/* Senha */}
          <div>
            <label htmlFor="password" style={labelStyle}>Senha</label>
            <input 
              id="password" type="password" required minLength={6}
              value={password} onChange={e => setPassword(e.target.value)} 
              placeholder="Mínimo de 6 caracteres"
              style={inputStyle}
            />
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div style={{ backgroundColor: 'rgba(255, 107, 107, 0.1)', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                <p style={{ color: '#ff6b6b', fontSize: '0.9rem', margin: 0 }}>{error}</p>
            </div>
          )}

          {/* Botão Registrar */}
          <button className='botao2' type="submit" disabled={loading} style={buttonStyle}>
            {loading ? 'Criando conta...' : 'Cadastrar'}
          </button>
        </form>

        {/* Link para voltar ao Login */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.95rem', color: '#aaa' }}>
          <p>
            Já tem uma conta?{' '}
            <Link to="/login" style={{ color: '#646cff', textDecoration: 'none', fontWeight: 'bold' }}>
              Faça Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}