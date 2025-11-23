import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { gameService, type Game } from '../api/game'; 
import { useAuth } from '../context/AuthContext'; 

export function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadGames();
  }, []);

  async function loadGames() {
    try {
      const data = await gameService.getAll();
      setGames(data);
    } catch (error) {
      console.error("Erro ao buscar jogos:", error);
    } finally {
      setLoading(false);
    }
  }

  function formatPrice(price: string | number) {
    const numberPrice = Number(price); // Converte string para número
    
    // Formata para R$
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numberPrice);
  }

  function handleComprar(gameTitle: string) {
    if (!isAuthenticated) {
      alert("Você precisa estar logado para comprar!");
      navigate('/login');
    } else {
      alert(`Iniciando compra de ${gameTitle} para ${user?.name}...`);
    }
  }

  if (loading) {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Carregando catálogo...</div>;
  }

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', backgroundColor: '#1a1a1a' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', color: 'black' }}>
        <h1>Catálogo de Jogos 🎮</h1>
        <div>
            {isAuthenticated ? (
                <span>Olá, {user?.name}</span>
            ) : (
                <button onClick={() => navigate('/login')} style={{ padding: '8px 16px', cursor: 'pointer' }}>Login</button>
            )}
        </div>
      </div>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center' }}>
        {games.map(game => (
          <div key={game.id} style={{ 
            background: '#333', 
            color: 'white', 
            padding: '1.5rem', 
            borderRadius: '8px',
            width: '250px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
          }}>
            <div>
                {/* Imagem do jogo */}
                <img 
                    src={game.imageUrl || "https://placehold.co/600x400?text=Game"} 
                    alt={game.title} 
                    style={{ width: '100%', borderRadius: '4px', marginBottom: '1rem', objectFit: 'cover', height: '140px' }} 
                />
                
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{game.title}</h3>
                
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#4ade80' }}>
                    {formatPrice(game.price)}
                </p>
            </div>
            
            {/* Botão de comprar */}
            <button 
                onClick={() => handleComprar(game.title)}
                style={{ 
                    marginTop: '15px', 
                    width: '100%', 
                    padding: '10px', 
                    cursor: 'pointer',
                    backgroundColor: isAuthenticated ? '#646cff' : '#555',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold'
                }}
            >
              {isAuthenticated ? 'Comprar Agora' : 'Faça Login para Comprar!'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}