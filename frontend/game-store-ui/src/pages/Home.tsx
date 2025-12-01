import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gameService, type Game } from "../api/game";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { CartWidget } from "../components/CartWidget";
import { WishlistButton } from "../components/WishlistButton";

import logoImg from "../assets/logo.png";

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

  // Formata para R$ BRL
  function formatPrice(price: string | number) {
    const numberPrice = Number(price);
    if (isNaN(numberPrice)) return "R$ 0,00";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numberPrice);
  }

  function handleAddToCart(game: Game) {
    if (!isAuthenticated) {
      alert("Inicie a sessão para adicionar ao carrinho!");
      return;
    }
    addToCart(game);
  }

  if (loading)
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
        Carregando...
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#1a1a1a",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "white",
          borderBottom: "0px solid #333",
          position: "sticky",
          top: 0,
          zIndex: 999, // Garante que fique por cima de tudo
          backgroundColor: "rgba(26, 26, 26, 0.4)", // Fundo meio transparente
          backdropFilter: "blur(10px)", // Efeito de vidro borrado
          padding: "1rem 20rem", // Padding interno do menu
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.5)"
        }}
      >
        <img
          src={logoImg}
          alt="Logo da GameStore"
          style={{
            width: "150px",
            height: "auto",
            display: "flex",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          {/* Ícone do Carrinho ( Aparece apenas se logado) */}
          {isAuthenticated && <CartWidget />}

          {isAuthenticated ? (
            // Menu Logado
            // Mensagem de boas-vindas, Biblioteca, Wishlist e Botão Sair
            <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
              <button
                onClick={() => navigate("/wishlist")}
                style={{
                  background: "transparent",
                  color: "#ff4757",
                  border: "1px solid #555",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Favoritos
              </button>

              <button
                onClick={() => navigate("/my-games")}
                style={{
                  background: "transparent",
                  color: "#ccc",
                  border: "1px solid #555",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Meus Jogos
              </button>

              <span
                onClick={() => navigate("/profile")}
                style={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  textDecoration: "underline",
                }}
              >
                {user?.nickname || user?.name}
              </span>

              <button
                onClick={signOut}
                style={{
                  background: "#e74c3c",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Sair
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              style={{ padding: "8px 16px", cursor: "pointer" }}
            >
              Inicie sua sessão
            </button>
          )}
        </div>
      </div>

      {/* Grid de Jogos */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1.5rem",
          justifyContent: "center",
        }}
      >
        {games.map((game) => (
          <div
            key={game.id}
            style={{
              background: "#333",
              color: "white",
              padding: "1.5rem",
              borderRadius: "8px",
              width: "250px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
            }}
          >
            {/* Botão da Wishlist */}
            <div
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                zIndex: 10,
              }}
            >
              <WishlistButton gameId={Number(game.id)} />
            </div>

            <div>
              {/* Imagem do Jogo */}
              <img
                src={game.coverUrl || "https://placehold.co/600x400?text=Game"}
                alt={game.title}
                onClick={() => navigate(`/game/${game.id}`)} // Navegação
                style={{
                  width: "100%",
                  borderRadius: "4px",
                  marginBottom: "1rem",
                  objectFit: "cover",
                  height: "140px",
                  cursor: "pointer",
                }}
              />

              {/* Badge das Plataformas */}
              <div
                style={{
                  marginBottom: "8px",
                  display: "flex",
                  gap: "5px",
                  flexWrap: "wrap",
                }}
              >
                {game.platforms &&
                  game.platforms.map((plat, index) => (
                    <span
                      key={index}
                      style={{
                        fontSize: "0.65rem",
                        textTransform: "uppercase",
                        background: "#444",
                        color: "#ccc",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontWeight: "bold",
                      }}
                    >
                      {plat}
                    </span>
                  ))}
              </div>

              {/* Título e Preço */}
              <h3
                onClick={() => navigate(`/game/${game.id}`)}
                style={{
                  fontSize: "1.1rem",
                  marginBottom: "0.5rem",
                  marginTop: 0,
                  cursor: "pointer",
                }}
              >
                {game.title}
              </h3>

              <p
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  color: "#4ade80",
                  margin: "10px 0",
                }}
              >
                {formatPrice(game.price)}
              </p>
            </div>

            {/* Botão de Carrinho */}
            <button
              onClick={() => handleAddToCart(game)}
              style={{
                marginTop: "15px",
                width: "100%",
                padding: "10px",
                cursor: "pointer",
                backgroundColor: isAuthenticated ? "#5241b2" : "#948b9b",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontWeight: "bold",
              }}
            >
              {isAuthenticated
                ? "Adicionar ao Carrinho"
                : "Inicie a sessão para Comprar"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
