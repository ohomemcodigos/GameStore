import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { type Game } from "../api/game";

export function FeaturedCarousel({ games }: { games: Game[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // Tenta pegar só os destaques
  let featuredGames = games.filter((game) => game.isFeatured);

  // FALLBACK: Se não tiver nenhum destaque, pega os 5 primeiros
  if (featuredGames.length === 0) {
    featuredGames = games.slice(0, 5);
  }

  // Se a lista de jogos estiver vazia, não mostra nada
  if (featuredGames.length === 0) return null;

  const currentGame = featuredGames[currentIndex];

  // Função para navegar usando Slug
  const handleNavigate = () => {
    navigate(`/game/${currentGame.slug || currentGame.id}`);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === featuredGames.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? featuredGames.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const formatPrice = (val: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

  return (
    <div style={{ width: "100%", maxWidth: "1550px", margin: "2rem auto", position: "relative" }}>
      
      {/* Container Principal */}
      <div
        style={{
          display: "flex",
          height: "500px",
          backgroundColor: "#333333",
          overflow: "hidden",
          position: "relative",
          borderRadius: "12px", // Adicionei um border radius suave
          border: "0px solid #333"
        }}
      >
        {/* --- ESQUERDA: IMAGEM --- */}
        <div
          style={{
            flex: "2",
            backgroundImage: `url(${currentGame.coverUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            boxShadow: "inset -80px 0 80px -20px #0f0f0f",
            cursor: "pointer",
            position: "relative"
          }}
          onClick={handleNavigate} // Usa a nova função
        >
        </div>

        {/* --- DIREITA: INFORMAÇÕES --- */}
        <div
          style={{
            flex: "1",
            padding: "25px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: "#0f0f0f",
            color: "white",
            zIndex: 2
          }}
        >
          <div>
            <h2 
                onClick={handleNavigate} // Usa a nova função
                style={{ fontSize: "2rem", margin: "0 0 15px 0", cursor: "pointer", lineHeight: "1.1" }}
            >
                {currentGame.title}
            </h2>
            
            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "20px" }}>
                {currentGame.genre && currentGame.genre.slice(0, 3).map((g, i) => (
                    <span key={i} style={{ background: "#333", padding: "4px 8px", borderRadius: "2px", fontSize: "0.75rem", color: "#ccc" }}>
                        {g}
                    </span>
                ))}
            </div>

            <p style={{ fontSize: "0.95rem", color: "#acb2b8", lineHeight: "1.5", maxHeight: "120px", overflow: "hidden" }}>
                {currentGame.description}
            </p>
          </div>

          <div>
             <div style={{ marginBottom: '10px', fontSize: '0.9rem', color: '#fff' }}>
                Já disponível
             </div>
             
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <div style={{ textAlign: 'right', background: "#222", padding: "5px 10px", borderRadius: "4px" }}>
                    {currentGame.discountPrice ? (
                        <>
                            <span style={{ textDecoration: 'line-through', color: '#777', fontSize: '0.85rem', marginRight: '8px' }}>
                                {formatPrice(Number(currentGame.price))}
                            </span>
                            <span style={{ color: '#4ade80', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                {formatPrice(Number(currentGame.discountPrice))}
                            </span>
                        </>
                    ) : (
                        <span style={{ color: 'white', fontSize: '1.2rem' }}>
                            {formatPrice(Number(currentGame.price))}
                        </span>
                    )}
                </div>
             </div>
          </div>
        </div>

        {/* --- SETAS --- */}
        <button 
            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
            style={{
                position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)",
                background: "linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4))", 
                border: "none", color: "white", fontSize: "2.5rem", cursor: "pointer", padding: "10px 15px", 
                borderRadius: "4px", zIndex: 10, transition: "0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#b6b7e6"}
            onMouseLeave={(e) => e.currentTarget.style.background = "linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4))"}
        >
            ❮
        </button>
        <button 
            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
            style={{
                position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
                background: "linear-gradient(to left, rgba(0,0,0,0.8), rgba(0,0,0,0.4))", 
                border: "none", color: "white", fontSize: "2.5rem", cursor: "pointer", padding: "10px 15px", 
                borderRadius: "4px", zIndex: 10, transition: "0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#b6b7e6"}
            onMouseLeave={(e) => e.currentTarget.style.background = "linear-gradient(to left, rgba(0,0,0,0.8), rgba(0,0,0,0.4))"}
        >
            ❯
        </button>
      </div>

      {/* --- INDICADORES --- */}
      <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "15px" }}>
        {featuredGames.map((_, idx) => (
            <div 
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                style={{
                    width: "30px", height: "6px",
                    backgroundColor: idx === currentIndex ? "#b6b7e6" : "#444",
                    cursor: "pointer", borderRadius: "3px", transition: "background 0.3s",
                    boxShadow: idx === currentIndex ? "0 0 10px rgba(255,255,255,0.2)" : "none"
                }}
            />
        ))}
      </div>
    </div>
  );
}