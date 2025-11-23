import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Home() {
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  const handleComprar = (gameTitle: string) => {
    if (!isAuthenticated) {
      alert('Você precisa estar logado para comprar!');
      navigate('/login');
    } else {
      alert(`Iniciando compra de ${gameTitle} para ${user?.name}...`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        <h1>GameStore 🎮</h1>
        <div>
          {isAuthenticated ? (
            <>
              <span style={{ marginRight: '10px' }}>Olá, {user?.name}</span>
              <button onClick={signOut} style={{ padding: '5px 10px', cursor: 'pointer' }}>Sair</button>
            </>
          ) : (
            <button onClick={() => navigate('/login')} style={{ padding: '5px 10px', cursor: 'pointer' }}>Login</button>
          )}
        </div>
      </header>

      <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', maxWidth: '300px' }}>
        <h3>Cyberpunk 2077</h3>
        <p>R$ 199,90</p>
        <button onClick={() => handleComprar('Cyberpunk 2077')} style={{ backgroundColor: 'green', color: 'white', padding: '8px', border: 'none', cursor: 'pointer', width: '100%' }}>
          {isAuthenticated ? 'Comprar Agora' : 'Login para Comprar'}
        </button>
      </div>
    </div>
  );
}