import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gameService, type Game } from "../api/game";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { CartWidget } from "../components/CartWidget";
import { WishlistButton } from "../components/WishlistButton";
import SearchBar from '../components/barra';
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
        {/* Logo */}
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
            <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
              {/* 1. BOTÃO FAVORITOS (Coração) */}

              <button
                className="botao"
                onClick={() => navigate("/wishlist")}
                style={{
                  background: "transparent",
                  border: "0px solid #555",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  display: "flex", // Alinha icone e texto
                  alignItems: "center", // Centraliza verticalmente
                  gap: "8px", // Espaço entre icone e texto
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                Favoritos
              </button>

              {/* 2. BOTÃO ADMIN (Engrenagem) */}
              {user?.role === "ADMIN" && (
                <button
                  className="botao"
                  onClick={() => navigate("/admin")}
                  style={{
                    background: "transparent",
                    border: "0px solid #555",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                  Gerenciar
                </button>
              )}

              {/* 3. BOTÃO MEUS JOGOS (Controle / Gamepad) */}
              <button
                className="botao"
                onClick={() => navigate("/my-games")}
                style={{
                  background: "transparent",
                  border: "0px solid #555",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="6" y1="12" x2="10" y2="12"></line>
                  <line x1="8" y1="10" x2="8" y2="14"></line>
                  <line x1="15" y1="13" x2="15.01" y2="13"></line>
                  <line x1="18" y1="11" x2="18.01" y2="11"></line>
                  <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                </svg>
                Biblioteca
              </button>

              <span
                className="botao"
                onClick={() => navigate("/profile")}
                style={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  textDecoration: "underline",
                  marginLeft: "10px",
                }}
              >
                {user?.nickname || user?.name}
              </span>

              <button
                onClick={signOut}
                style={{
                  background: "#5241b2",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  marginLeft: "10px",
                }}
              >
                Sair
              </button>
            </div>
          ) : (
            <button
              className="botao"
              onClick={() => navigate("/login")}
              style={{
                fontSize: 15,
                background: "transparent",
                border: "0px solid #555",
                padding: "6px 12px",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
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
            className="card-game" // <--- AQUI ESTÁ A MÁGICA
            style={{
              color: "white",
              padding: "1.5rem",
              borderRadius: "8px",
              width: "250px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              // REMOVI: backgroundColor e boxShadow (estão no CSS agora)
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
