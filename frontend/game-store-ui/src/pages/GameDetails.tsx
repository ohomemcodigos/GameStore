import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gameService, type Game } from '../api/game';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export function GameDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadGameDetails(id);
    }
  }, [id]);

  async function loadGameDetails(gameId: string) {
    try {
      const data = await gameService.getById(gameId);
      setGame(data);
    } catch (error) {
      console.error("Erro ao carregar jogo:", error);
      alert("Jogo não encontrado!");
      navigate('/');
    } finally {
      setLoading(false);
    }
  }

  const formatPrice = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('pt-BR');

  // Função para definir a cor da classificação indicativa
  const getAgeRatingColor = (rating: string) => {
    if (rating === 'L') return  '#00a305'; // Verde
    if (rating === '10') return '#00d5ff'; // Azul
    if (rating === '12') return '#ffdd00'; // Amarelo
    if (rating === '14') return '#ff6b00'; // Laranja
    if (rating === '16') return '#ff0000'; // Vermelho
    return '#000'; // Preto (18+)
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert("Inicie a sessão para comprar!");
      return;
    }
    if (game) {
      addToCart(game);
    }
  };

  if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Carregando detalhes...</div>;
  if (!game) return null;

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', backgroundColor: '#1a1a1a', color: 'white', display: 'flex', justifyContent: 'center' }}>
      
      <div style={{ maxWidth: '1100px', width: '100%' }}>
        
        {/* Botão Voltar */}
        <button onClick={() => navigate('/')} style={{ background: 'transparent', border: 'none', color: '#aaa', cursor: 'pointer', marginBottom: '20px', fontSize: '1rem' }}>
          ← Voltar para a Loja
        </button>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem' }}>
          
          {/* --- COLUNA DA CAPA --- */}
          <div style={{ flex: 1, minWidth: '300px', maxWidth: '400px' }}>
            <img 
              src={game.coverUrl || "https://placehold.co/600x800?text=Capa"} 
              alt={game.title} 
              style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }} 
            />
            
            {/* Informações Técnicas */}
            <div style={{ marginTop: '20px', background: '#252525', padding: '15px', borderRadius: '8px', fontSize: '0.9rem' }}>
                <p><strong style={{color: '#aaa'}}>Desenvolvedor:</strong> {game.developer?.join(', ') || 'N/A'}</p>
                <p><strong style={{color: '#aaa'}}>Publicadora:</strong> {game.publisher?.join(', ') || 'N/A'}</p>
                <p><strong style={{color: '#aaa'}}>Lançamento:</strong> {game.releaseDate ? formatDate(game.releaseDate) : 'N/A'}</p>
            </div>
          </div>

          {/* --- INFORMAÇÕES --- */}
          <div style={{ flex: 1.5, minWidth: '300px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', marginTop: 0, lineHeight: 1 }}>{game.title}</h1>
                
                {/* Classificação Indicativa */}
                <div style={{ 
                    background: getAgeRatingColor(game.ageRating || 'L'), 
                    width: '40px', height: '40px', borderRadius: '4px', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
                }}>
                    {game.ageRating || 'L'}
                </div>
            </div>
            
            {/* Tags de Gênero e Plataforma */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {game.genre?.map(g => (
                  <span key={g} style={{ background: '#34495e', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{g}</span>
              ))}
              {game.platforms?.map(p => (
                  <span key={p} style={{ background: '#2c3e50', border: '1px solid #555', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{p}</span>
              ))}
            </div>

            <p style={{ lineHeight: '1.6', color: '#ccc', marginBottom: '30px', fontSize: '1.1rem', whiteSpace: 'pre-line' }}>
              {game.description || "Sem descrição disponível para este jogo."}
            </p>

            {/* Card de Compra */}
            <div style={{ background: '#252525', padding: '25px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #333' }}>
              <div>
                {game.discountPrice ? (
                    <>
                        <span style={{ display: 'block', fontSize: '0.9rem', color: '#aaa', textDecoration: 'line-through' }}>{formatPrice(Number(game.price))}</span>
                        <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4ade80' }}>{formatPrice(Number(game.discountPrice))}</span>
                    </>
                ) : (
                    <>
                        <span style={{ display: 'block', fontSize: '0.9rem', color: '#aaa' }}>Preço</span>
                        <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4ade80' }}>{formatPrice(Number(game.price))}</span>
                    </>
                )}
              </div>
              
              <button 
                onClick={handleAddToCart}
                style={{ padding: '15px 30px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(39, 174, 96, 0.3)' }}
              >
                Adicionar ao Carrinho
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}