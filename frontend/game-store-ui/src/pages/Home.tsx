import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gameService, type Game } from '../api/game'; 
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { CartWidget } from '../components/CartWidget';

export function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { user, isAuthenticated, signOut } = useAuth();
  const { addToCart } = useCart();
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
    // Converte string para número
    
    // Formata para R$
    return new Intl.NumberFormat('pt-BR', {style:
        'currency',
        currency: 'BRL'
    }).format(Number(price));
  }

  function handleAddToCart(game: Game) {
    if (!isAuthenticated) {
      alert("Faça login para adicionar ao carrinho!");
      navigate('/login');
      return;
    }
    
    addToCart(game);
  }

  if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Carregando...</div>;

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', backgroundColor: '#1a1a1a' }}>
      
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        color: 'white', borderBottom:
        '1px solid #333', paddingBottom:
        '1rem'
        }}>
        <h1>GameStore 🎮</h1>
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
            }}>
            
            {/* Ícone do Carrinho ( Aparece apenas se logado) */}
            {isAuthenticated && <CartWidget />}

            {isAuthenticated ? (
                // Mensagem de boas-vindas + Botão Sair
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <span>Olá, {user?.name}</span>
                    <button 
                        onClick={signOut} 
                        style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Sair
                    </button>
                </div>
            ) : (
                <button onClick={() => navigate('/login')} style={{ padding: '8px 16px', cursor: 'pointer' }}>Login</button>
            )}
        </div>
      </div>
      
      {/* Grid de Jogos */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1.5rem',
        justifyContent: 'center'
        }}>
        {games.map(game => (
          <div key={game.id} style={{
            background: '#333',
            color: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            width: '250px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
            }}>
            {/* Imagem do jogo */}
            <img src={game.imageUrl || "https://placehold.co/600x400?text=Game"} alt={game.title} style={{
                width: '100%',
                borderRadius: '4px',
                marginBottom: '1rem',
                objectFit: 'cover',
                height: '140px'
                }} />
            <h3 style={{
                fontSize: '1.1rem',
                marginBottom: '0.5rem'
            }}
            >{game.title}</h3>
            <p style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: '#4ade80'
            }}
            >{formatPrice(game.price)}</p>
            
            {/* Botão de Adicionar ao Carrinho */}
            <button 
                onClick={() => handleAddToCart(game)}
                style={{ 
                      marginTop: '15px',
                      width: '100%',
                      padding: '10px',
                      cursor: 'pointer',
                      backgroundColor: isAuthenticated ? '#f39c12' : '#555',
                      color: 'white',
                      border: 'none',borderRadius: '4px',
                      fontWeight: 'bold'
                    }}
            >
              {isAuthenticated ? 'Adicionar ao Carrinho' : 'Login para Comprar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}