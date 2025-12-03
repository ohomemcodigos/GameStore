import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gameService, type Game } from "../api/game";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

// Componentes
import { CartWidget } from "../components/CartWidget";
import { WishlistButton } from "../components/WishlistButton";
import { HeaderSearch } from "../components/HeaderSearch"; // <--- Importado
import { FeaturedCarousel } from "../components/FeaturedCarousel"; // <--- Importado
import { Heart, Settings, Gamepad2, LogOut, LogIn, User } from "lucide-react";

// Assets
import logoImg from "../assets/logo.png";
import logoAltImg from "../assets/logo-alt.png";
import defaultAvatar from "../assets/icon.png";

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
          zIndex: 999,
          backgroundColor: "rgba(26, 26, 26, 0.75)",
          backdropFilter: "blur(10px)",
          padding: "1rem 20rem",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* 1. Logo */}
        <img
          src={logoImg}
          alt="Logo da GameStore"
          style={{ width: "150px", height: "auto", display: "flex" }}
        />

        {/* 2. Barra de Pesquisa */}
        <HeaderSearch games={games} />

        {/* 3. Área do Usuário */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {isAuthenticated && <CartWidget />}

          {isAuthenticated ? (
            <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
              {/* Botão Favoritos */}
              <button
                className="botao"
                onClick={() => navigate("/wishlist")}
                style={{
                  background: "transparent",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Heart size={18} />
                Favoritos
              </button>

              {/* Botão Admin */}
              {user?.role === "ADMIN" && (
                <button
                  className="botao"
                  onClick={() => navigate("/admin")}
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Settings size={18} />
                  Gerenciar
                </button>
              )}

              {/* Botão Biblioteca */}
              <button
                className="botao"
                onClick={() => navigate("/my-games")}
                style={{
                  background: "transparent",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Gamepad2 size={18} />
                Biblioteca
              </button>

              {/* --- PERFIL DO USUÁRIO --- */}
              <div
                onClick={() => navigate("/profile")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginLeft: "10px",
                  paddingLeft: "15px",
                  borderLeft: "1px solid #444",
                  cursor: "pointer",
                }}
              >
                {/* Avatar: Imagem Real ou Fallback */}
                <img
                  src={user?.avatarUrl || defaultAvatar}
                  alt="Avatar"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%", // Deixa redondo
                    objectFit: "cover", // Garante que a imagem não fique esticada/amassada
                    border: "0px solid #5241b2", // Uma borda roxa fina para combinar
                  }}
                />

                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                    color: "#fff",
                  }}
                >
                  {user?.nickname || user?.name}
                </span>
              </div>

              {/* Botão Sair */}
              <button
                onClick={signOut}
                title="Sair da conta"
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "8px",
                  borderRadius: "50%",
                  color: "#e74c3c", // Vermelho
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "rgba(231, 76, 60, 0.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button
              className="botao"
              onClick={() => navigate("/login")}
              style={{
                fontSize: 15,
                background: "transparent",
                border: "none",
                padding: "6px 12px",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "white",
              }}
            >
              <LogIn size={18} />
              Inicie sua sessão
            </button>
          )}
        </div>
      </div>

      {/* --- CARROSSEL DE DESTAQUES (NOVO) --- */}
      <FeaturedCarousel games={games} />

      {/* Grid de Jogos */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1.5rem",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        {games.map((game) => (
          <div
            key={game.id}
            className="card-game"
            style={{
              color: "white",
              padding: "1.5rem",
              borderRadius: "8px",
              width: "250px",
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
                onClick={() => navigate(`/game/${game.id}`)}
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
