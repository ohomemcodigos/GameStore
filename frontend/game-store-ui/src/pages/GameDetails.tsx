import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gameService, type Game } from "../api/game";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { WishlistButton } from "../components/WishlistButton";
import { GameCarousel } from "../components/GameCarousel";
import ReviewSection from '../components/reviewsection';
import { ArrowLeft, ShoppingCart, Tag, Calendar, User, Building } from "lucide-react";
import { toast } from "sonner"; // Importe o Toast

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
      toast.error("Jogo não encontrado!");
      navigate("/");
    } finally {
      setLoading(false);
    }
  }

  const formatPrice = (val: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Data desconhecida";
    return new Date(dateStr).toLocaleDateString("pt-BR");
  };

  const getAgeRatingColor = (rating: string) => {
    if (rating === "L") return "#00a305";
    if (rating === "10") return "#00d5ff";
    if (rating === "12") return "#ffdd00";
    if (rating === "14") return "#ff6b00";
    if (rating === "16") return "#ff0000";
    if (rating === "18") return "#000";
    return "#333";
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Você precisa estar logado para comprar!", {
        action: {
            label: 'Entrar',
            onClick: () => navigate('/login')
        }
      });
      return;
    }
    if (game) {
      addToCart(game);
    }
  };

  if (loading)
    return (
      <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#121212", color: "#888" }}>
        <div style={{ width: 24, height: 24, border: "2px solid #6c5ce7", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
    
  if (!game) return null;

  return (
    <div style={{ padding: "2rem", minHeight: "100vh", backgroundColor: "#121212", color: "white", display: "flex", justifyContent: "center" }}>
      
      <div style={{ maxWidth: "1200px", width: "100%" }}>
        
        {/* Botão Voltar */}
        <button
          onClick={() => navigate("/")}
          style={{
            background: "transparent", border: "1px solid #333", borderRadius: '8px', color: "#ccc", cursor: "pointer", 
            marginBottom: "20px", fontSize: "0.9rem", display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#ccc'; }}
        >
          <ArrowLeft size={18} /> Voltar para a Loja
        </button>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "3rem" }}>
          
          {/* --- COLUNA ESQUERDA: MÍDIA E INFO --- */}
          <div style={{ flex: 1.5, minWidth: "320px" }}>
            
            {/* CARROSSEL NO TOPO (Mais destaque) */}
            <div style={{ marginBottom: "2rem", borderRadius: "12px", overflow: "hidden", border: "1px solid #333", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
                <GameCarousel game={game} />
            </div>

            {/* Descrição */}
            <div style={{ background: "#1e1e1e", padding: "2rem", borderRadius: "12px", border: "1px solid #333" }}>
                <h2 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.5rem', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Sobre o Jogo</h2>
                <p style={{ lineHeight: "1.8", color: "#ccc", fontSize: "1rem", whiteSpace: "pre-line" }}>
                    {game.description || "Sem descrição disponível para este jogo."}
                </p>
            </div>

            {/* Seção de Reviews */}
            <div style={{ marginTop: "2rem" }}>
                <ReviewSection gameId={Number(game.id)} /> 
            </div>
          </div>
 
          {/* --- COLUNA DIREITA: COMPRA E DETALHES --- */}
          <div style={{ flex: 1, minWidth: "300px", maxWidth: "400px" }}>
            
            {/* Card Principal de Compra */}
            <div style={{ background: "#1e1e1e", padding: "25px", borderRadius: "12px", border: "1px solid #333", position: "sticky", top: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
                
                {/* Logo / Título */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "20px" }}>
                    <h1 style={{ fontSize: "2rem", margin: 0, lineHeight: 1.1 }}>{game.title}</h1>
                    <div style={{ position: "relative" }}>
                        <WishlistButton gameId={Number(game.id)} />
                    </div>
                </div>

                {/* Tags */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
                    {game.genre?.map((g) => (
                        <span key={g} style={{ background: "rgba(108, 92, 231, 0.2)", color: "#a29bfe", padding: "4px 10px", borderRadius: "20px", fontSize: "0.8rem", border: "1px solid rgba(108, 92, 231, 0.3)" }}>
                            {g}
                        </span>
                    ))}
                </div>

                {/* Preço */}
                <div style={{ marginBottom: "20px", padding: "15px", background: "#111", borderRadius: "8px", border: "1px solid #333", textAlign: 'center' }}>
                    {game.discountPrice ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: "1rem", color: "#666", textDecoration: "line-through" }}>
                                {formatPrice(Number(game.price))}
                            </span>
                            <span style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#4ade80" }}>
                                {formatPrice(Number(game.discountPrice))}
                            </span>
                            <span style={{ background: '#4ade80', color: '#000', fontSize: '0.8rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px', marginTop: '5px' }}>
                                PROMOÇÃO
                            </span>
                        </div>
                    ) : (
                        <span style={{ fontSize: "2.5rem", fontWeight: "bold", color: "white" }}>
                            {formatPrice(Number(game.price))}
                        </span>
                    )}
                </div>

                {/* Botão Comprar */}
                <button
                    onClick={handleAddToCart}
                    style={{
                        width: "100%", padding: "16px", background: "#6c5ce7", color: "white", border: "none", borderRadius: "8px",
                        fontSize: "1.1rem", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 15px rgba(108, 92, 231, 0.4)",
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'transform 0.1s'
                    }}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <ShoppingCart size={22} />
                    Adicionar ao Carrinho
                </button>

                {/* Detalhes Técnicos */}
                <div style={{ marginTop: "30px", borderTop: "1px solid #333", paddingTop: "20px", display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                        <span style={{ color: '#888', display: 'flex', alignItems: 'center', gap: '8px' }}><User size={16}/> Desenvolvedor</span>
                        <span>{game.developer?.join(", ") || "N/A"}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                        <span style={{ color: '#888', display: 'flex', alignItems: 'center', gap: '8px' }}><Building size={16}/> Publicadora</span>
                        <span>{game.publisher?.join(", ") || "N/A"}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                        <span style={{ color: '#888', display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={16}/> Lançamento</span>
                        <span>{game.releaseDate ? formatDate(game.releaseDate) : "N/A"}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', alignItems: 'center' }}>
                        <span style={{ color: '#888', display: 'flex', alignItems: 'center', gap: '8px' }}><Tag size={16}/> Classificação</span>
                        <span style={{ 
                            background: getAgeRatingColor(game.ageRating || "L"), 
                            color: game.ageRating === "L" || game.ageRating === "10" || game.ageRating === "12" ? 'black' : 'white',
                            width: "24px", height: "24px", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "0.8rem" 
                        }}>
                            {game.ageRating || "L"}
                        </span>
                    </div>

                </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}