import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // Importação do ícone
import { wishlistService } from "../api/wishlist";
import { type Game } from "../api/game";
import { WishlistButton } from "../components/WishlistButton";

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

  if (loading)
    return (
      <div style={{ color: "white", padding: "2rem", textAlign: "center" }}>
        Carregando...
      </div>
    );

  return (
    <div
      style={{
        padding: "2rem",
        minHeight: "100vh",
        backgroundColor: "#1a1a1a",
        color: "white",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Cabeçalho com Seta do Lucide e Título */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "2rem",
            borderBottom: "1px solid #333",
            paddingBottom: "10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Botão de Voltar (Seta) */}
            <button
              onClick={() => navigate("/")}
              className="botao"
              style={{
                background: "none",
                border: "none",
   
                cursor: "pointer",
                display: "flex",
                padding: 0,
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Seu Título */}
            <h2 style={{ margin: 0, color: "#fff" }}>Itens Favoritos</h2>
          </div>
        </div>

        {games.length === 0 ? (
          <p style={{ color: "#aaa" }}>
            Sua lista está vazia. Explore a loja para adicionar jogos!
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "2rem",
            }}
          >
            {games.map((game) => (
              <div
                key={game.id}
                style={{
                  background: "#252525",
                  borderRadius: "8px",
                  padding: "1rem",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Botão da Wishlist (Coração) */}
                <div
                  style={{
                    position: "absolute",
                    top: "15px",
                    right: "15px",
                    zIndex: 10,
                  }}
                >
                  <WishlistButton gameId={Number(game.id)} />
                </div>

                <img
                  src={game.coverUrl || "https://placehold.co/400x600"}
                  alt={game.title}
                  onClick={() => navigate(`/game/${game.id}`)}
                  style={{
                    width: "100%",
                    height: "150px", // Aumentei um pouco para ficar mais bonito
                    borderRadius: "4px",
                    marginBottom: "10px",
                    cursor: "pointer",
                    objectFit: "cover",
                  }}
                />

                <h3 style={{ fontSize: "1rem", margin: "0 0 10px 0", flex: 1 }}>
                  {game.title}
                </h3>

                <button
                  onClick={() => navigate(`/game/${game.id}`)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    background: "#646cff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
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
