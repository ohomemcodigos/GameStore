import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../api/auth';

export function Register() {
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Envia os dados para a API
      await authService.register({ name, email, password });
      
      alert('Conta criada com sucesso! Faça login para continuar.');
      navigate('/login'); // Redireciona para o login
      
    } catch (err: any) {
      console.error(err);
      // Tenta pegar a mensagem de erro do backend
      const backendError = err.response?.data?.error;
      setError(backendError || 'Erro ao criar conta. Tente outro email.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#1a1a1a', color: 'white' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '2rem', backgroundColor: '#333', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Crie sua Conta</h2>
        
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Nome */}
          <div>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Nome Completo</label>
            <input 
              id="name" type="text" required 
              value={name} onChange={e => setName(e.target.value)} 
              placeholder=""
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#222', color: 'white' }}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email</label>
            <input 
              id="email" type="email" required 
              value={email} onChange={e => setEmail(e.target.value)} 
              placeholder=""
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#222', color: 'white' }}
            />
          </div>

          {/* Senha */}
          <div>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Senha</label>
            <input 
                id="password" 
                type="password" 
                required 
                minLength={6}
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="Mínimo de 6 caracteres"
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#222', color: 'white' }}
            />
          </div>

          {/* Mensagem de Erro */}
          {error && <div style={{ color: '#ff6b6b', fontSize: '0.9rem', textAlign: 'center', background: 'rgba(255,0,0,0.1)', padding: '5px', borderRadius: '4px' }}>{error}</div>}

          {/* Botão Registrar */}
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: '12px', 
              backgroundColor: loading ? '#555' : '#27ae60', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem',
              marginTop: '10px'
            }}
          >
            {loading ? 'Criando conta...' : 'Cadastrar'}
          </button>
        </form>

        {/* Link para voltar ao Login */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
          <p>Já tem uma conta? <Link to="/login" style={{ color: '#646cff', textDecoration: 'none' }}>Inicie sua sessão!</Link></p>
        </div>
      </div>
    </div>
  );
}