import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gameService, type Game } from "../api/game";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { WishlistButton } from "../components/WishlistButton";
import { GameCarousel } from "../components/GameCarousel"; // <--- Mantém o import

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
      navigate("/");
    } finally {
      setLoading(false);
    }
  }

  const formatPrice = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);

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
    return "#000";
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert("Inicie sua sessão para comprar!");
      navigate("/login");
      return;
    }
    if (game) {
      addToCart(game);
    }
  };

  if (loading)
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
        Carregando detalhes...
      </div>
    );
  if (!game) return null;

  return (
    <div
      style={{
        padding: "2rem",
        minHeight: "100vh",
        backgroundColor: "#1a1a1a",
        color: "white",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ maxWidth: "1100px", width: "100%" }}>
        {/* Botão Voltar */}
        <button
          onClick={() => navigate("/")}
          style={{
            background: "transparent",
            border: "none",
            color: "#aaa",
            cursor: "pointer",
            marginBottom: "20px",
            fontSize: "1rem",
          }}
        >
          ← Voltar para a Loja
        </button>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "3rem" }}>
          
          {/* --- COLUNA ESQUERDA: CAPA E INFO TÉCNICA --- */}
          <div style={{ flex: 1, minWidth: "300px", maxWidth: "400px", position: "relative" }}>
            
            {/* Botão de Favorito */}
            <div style={{ position: "absolute", top: "15px", right: "15px", zIndex: 10 }}>
              <WishlistButton gameId={Number(game.id)} />
            </div>

            {/* IMAGEM ESTATICA DA CAPA (Restaurada) */}
            <img
              src={game.coverUrl || "https://placehold.co/600x800?text=Capa"}
              alt={game.title}
              style={{
                width: "100%",
                borderRadius: "8px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
              }}
            />

            {/* Info Técnica */}
            <div style={{ marginTop: "20px", background: "#252525", padding: "15px", borderRadius: "8px", fontSize: "0.9rem" }}>
              <p><strong style={{ color: "#aaa" }}>Desenvolvedor:</strong> {game.developer?.join(", ") || "N/A"}</p>
              <p><strong style={{ color: "#aaa" }}>Publicadora:</strong> {game.publisher?.join(", ") || "N/A"}</p>
              <p><strong style={{ color: "#aaa" }}>Lançamento:</strong> {game.releaseDate ? formatDate(game.releaseDate) : "N/A"}</p>
            </div>
          </div>

          {/* --- COLUNA DIREITA: DETALHES, COMPRA E CARROSSEL --- */}
          <div style={{ flex: 1.5, minWidth: "300px" }}>
            
            {/* Título e Classificação */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <h1 style={{ fontSize: "2.5rem", marginBottom: "10px", marginTop: 0, lineHeight: 1 }}>{game.title}</h1>
              <div style={{ background: getAgeRatingColor(game.ageRating || "L"), width: "40px", height: "40px", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "1.2rem", boxShadow: "0 2px 5px rgba(0,0,0,0.3)" }}>
                {game.ageRating || "L"}
              </div>
            </div>

            {/* Tags */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
              {game.genre?.map((g) => (
                <span key={g} style={{ background: "#34495e", padding: "4px 8px", borderRadius: "4px", fontSize: "0.8rem" }}>{g}</span>
              ))}
              {game.platforms?.map((p) => (
                <span key={p} style={{ background: "#2c3e50", border: "1px solid #555", padding: "4px 8px", borderRadius: "4px", fontSize: "0.8rem" }}>{p}</span>
              ))}
            </div>

            {/* Descrição */}
            <p style={{ lineHeight: "1.6", color: "#ccc", marginBottom: "30px", fontSize: "1.1rem", whiteSpace: "pre-line" }}>
              {game.description || "Sem descrição disponível para este jogo."}
            </p>

            {/* CARD DE COMPRA */}
            <div style={{ background: "#252525", padding: "25px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px solid #333" }}>
              <div>
                {game.discountPrice ? (
                  <>
                    <span style={{ display: "block", fontSize: "0.9rem", color: "#aaa", textDecoration: "line-through" }}>
                      {formatPrice(Number(game.price))}
                    </span>
                    <span style={{ fontSize: "2rem", fontWeight: "bold", color: "#4ade80" }}>
                      {formatPrice(Number(game.discountPrice))}
                    </span>
                  </>
                ) : (
                  <>
                    <span style={{ display: "block", fontSize: "0.9rem", color: "#aaa" }}>Preço</span>
                    <span style={{ fontSize: "2rem", fontWeight: "bold", color: "#4ade80" }}>
                      {formatPrice(Number(game.price))}
                    </span>
                  </>
                )}
              </div>

              <button
                onClick={handleAddToCart}
                style={{
                  padding: "15px 30px",
                  background: "#5241b2",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: "0 4px 10px rgba(82, 65, 178, 0.3)",
                }}
              >
                Adicionar ao Carrinho
              </button>
            </div>

            {/* --- CARROSSEL DE IMAGENS (Inserido aqui embaixo) --- */}
            <div style={{ marginTop: "40px" }}>
                <GameCarousel game={game} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}