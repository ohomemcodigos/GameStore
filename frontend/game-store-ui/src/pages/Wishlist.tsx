import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { wishlistService } from '../api/wishlist';
import { type Game } from '../api/game';
import { WishlistButton } from '../components/WishlistButton';

export function Wishlist() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadWishlist();
  }, []);

  async function loadWishlist() {
    try {
      const data = await wishlistService.getMyWishlist();
      setGames(data);
    } catch (error) {
      console.error("Erro ao carregar wishlist", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div style={{ color: 'white', padding: '2rem', textAlign: 'center' }}>Carregando...</div>;

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', backgroundColor: '#1a1a1a', color: 'white' }}>
      
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
            <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '1.2rem' }}>←</button>
            <h1>Lista de Desejos</h1>
        </div>

        {games.length === 0 ? (
            <p style={{ color: '#aaa' }}>Sua lista está vazia. Explore a loja para adicionar jogos!</p>
        ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '2rem' }}>
                {games.map(game => (
                    <div key={game.id} style={{ background: '#252525', borderRadius: '8px', padding: '1rem', position: 'relative' }}>
                        
                        {/* Botão da Wishlist */}
                        <div style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 10 }}>
                            <WishlistButton gameId={Number(game.id)} />
                        </div>

                        <img 
                            src={game.coverUrl || "https://placehold.co/400x600"} 
                            alt={game.title}
                            onClick={() => navigate(`/game/${game.id}`)}
                            style={{ width: '100%', borderRadius: '4px', marginBottom: '10px', cursor: 'pointer', height: '120px', objectFit: 'cover' }}
                        />
                        <h3 style={{ fontSize: '1rem', margin: '0 0 5px 0' }}>{game.title}</h3>
                        <button 
                            onClick={() => navigate(`/game/${game.id}`)}
                            style={{ width: '100%', padding: '8px', marginTop: '10px', background: '#646cff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            Ver Jogo
                        </button>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}