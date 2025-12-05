import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gameService, type Game } from "../api/game";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

// Componentes
import { CartWidget } from "../components/CartWidget";
import { FeaturedCarousel } from "../components/FeaturedCarousel";
import { WishlistButton } from "../components/WishlistButton";
import { Heart, Settings, Gamepad2, LogOut, LogIn, ShoppingCart, Search, X } from "lucide-react";

// Assets
import logoImg from "../assets/logo.png";
import defaultAvatar from "../assets/icon.png";

export function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados da Busca
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Game[]>([]);
  const [showResults, setShowResults] = useState(false);

  const { user, isAuthenticated, signOut } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadGames();
    
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
        setSearchResults([]);
        setShowResults(false);
        return;
    }

    const normalizeText = (text: string) => 
        text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const normalizedSearch = normalizeText(searchTerm);
    const results = games.filter(game => 
        normalizeText(game.title).includes(normalizedSearch)
    );

    setSearchResults(results);
    setShowResults(true);
  }, [searchTerm, games]);

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

  // Formata R$
  function formatPrice(price: string | number) {
    const numberPrice = Number(price);
    if (isNaN(numberPrice)) return "R$ 0,00";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numberPrice);
  }

  // Calcula % de desconto para a etiqueta
  function calculateDiscount(original: number | string, discounted: number | string) {
    const p = Number(original);
    const d = Number(discounted);
    if (!p || !d) return 0;
    return Math.round(((p - d) / p) * 100);
  }

  function handleAddToCart(game: Game) {
    if (!isAuthenticated) {
      alert("Inicie a sessão para adicionar ao carrinho!");
      return;
    }
    addToCart(game);
  }

  // Aceita o objeto Game para decidir se usa slug ou id
  function handleNavigateToGame(game: Game) {
      const identifier = game.slug || game.id;
      navigate(`/game/${identifier}`);
      setShowResults(false);
      setSearchTerm("");
  }

  if (loading)
    return (
      <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#121212", color: "#888" }}>
        <div style={{ width: 24, height: 24, border: "2px solid #6c5ce7", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#121212", fontFamily: "system-ui, sans-serif" }}>
      
      {/* --- HEADER --- */}
      <div
        style={{
          display: "flex", justifyContent: "space-between", alignItems: "center", color: "white",
          position: "sticky", top: 0, zIndex: 1000,
          backgroundColor: "rgba(18, 18, 18, 0.95)", backdropFilter: "blur(12px)",
          padding: "1rem 5%", borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <img src={logoImg} alt="Logo" style={{ height: "40px", objectFit: 'contain' }} />
        </div>

        <div ref={searchRef} style={{ flex: 1, maxWidth: "500px", margin: "0 20px", position: "relative" }}>
            <div style={{ position: 'relative', zIndex: 1002 }}>
                <Search size={18} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#888" }} />
                <input 
                    type="text" placeholder="Buscar jogos..." value={searchTerm}
                    onFocus={() => { if(searchTerm) setShowResults(true) }}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: "100%", padding: "10px 10px 10px 40px", borderRadius: "8px",
                        border: "1px solid #333", backgroundColor: "#1e1e1e", color: "white", outline: "none", fontSize: "0.95rem"
                    }}
                />
                {searchTerm && (
                    <button onClick={() => setSearchTerm('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Modal de Resultados */}
            {showResults && (
                <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0,
                    backgroundColor: '#1e1e1e', border: '1px solid #333', borderTop: 'none', borderRadius: '0 0 8px 8px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.8)', zIndex: 1001, maxHeight: '400px', overflowY: 'auto'
                }}>
                    {searchResults.length > 0 ? (
                        searchResults.map(game => (
                            <div key={game.id} onClick={() => handleNavigateToGame(game)}
                                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', cursor: 'pointer', borderBottom: '1px solid #2a2a2a' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <img src={game.coverUrl || "https://placehold.co/50"} alt={game.title} style={{ width: '40px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ color: 'white', fontSize: '0.95rem', fontWeight: '500' }}>{game.title}</div>
                                    <div style={{ color: '#888', fontSize: '0.8rem' }}>
                                        {game.discountPrice ? (
                                            <span style={{ color: '#4ade80' }}>{formatPrice(game.discountPrice)}</span>
                                        ) : (
                                            <span>{Number(game.price) === 0 ? "Grátis" : formatPrice(game.price)}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: '20px', textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>Nenhum jogo encontrado</div>
                    )}
                </div>
            )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          {isAuthenticated ? (
            <>
              <CartWidget />
              <button title="Favoritos" onClick={() => navigate("/wishlist")} style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", padding: "8px" }}><Heart size={22} /></button>
              {user?.role === "ADMIN" && <button title="Admin" onClick={() => navigate("/admin")} style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", padding: "8px" }}><Settings size={22} /></button>}
              <button title="Biblioteca" onClick={() => navigate("/my-games")} style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", padding: "8px" }}><Gamepad2 size={22} /></button>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingLeft: "10px", borderLeft: "1px solid #333", cursor: "pointer" }} onClick={() => navigate("/profile")}>
                <img src={user?.avatarUrl || defaultAvatar} alt="Avatar" style={{ width: "35px", height: "35px", borderRadius: "50%", objectFit: "cover", border: "2px solid #333" }} />
              </div>
              <button title="Sair" onClick={signOut} style={{ background: "none", border: "none", color: "#e74c3c", cursor: "pointer", padding: "8px" }}><LogOut size={20} /></button>
            </>
          ) : (
            <button onClick={() => navigate("/login")} style={{ display: "flex", alignItems: "center", gap: "8px", background: "#6c5ce7", color: "white", border: "none", padding: "8px 20px", borderRadius: "20px", fontWeight: "bold", cursor: "pointer" }}>
              <LogIn size={18} /> Entrar
            </button>
          )}
        </div>
      </div>

      {/* --- CARROSSEL --- */}
      <div style={{ marginBottom: "2rem" }}>
        <FeaturedCarousel games={games} />
      </div>

      {/* --- LISTAGEM DE JOGOS --- */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.5rem" }}>
            <h2 style={{ color: "white", fontSize: "1.5rem", margin: 0 }}>Catálogo Completo</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "2rem" }}>
          {games.map((game) => (
            <div
              key={game.id}
              style={{
                backgroundColor: "#1e1e1e", borderRadius: "12px", overflow: "hidden", border: "1px solid #333",
                transition: "transform 0.2s, box-shadow 0.2s", display: "flex", flexDirection: "column", position: "relative"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              
              {/* Etiqueta de Desconto (Badge) */}
              {game.discountPrice && Number(game.discountPrice) > 0 && (
                  <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 20, background: '#4ade80', color: '#000', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', boxShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>
                      -{calculateDiscount(game.price, game.discountPrice)}%
                  </div>
              )}

              <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 10, background: 'rgba(0,0,0,0.6)', borderRadius: '50%', padding: '4px' }}>
                <WishlistButton gameId={Number(game.id)} />
              </div>

              {/* Usa slug ou id na navegação */}
              <div style={{ height: "160px", overflow: "hidden", cursor: 'pointer' }} onClick={() => handleNavigateToGame(game)}>
                <img src={game.coverUrl || "https://placehold.co/600x400?text=No+Image"} alt={game.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }} />
              </div>

              <div style={{ padding: "1.2rem", display: "flex", flexDirection: "column", flex: 1 }}>
                
                <div style={{ display: "flex", gap: "5px", marginBottom: "8px", flexWrap: "wrap" }}>
                  {game.platforms?.slice(0, 3).map((plat, i) => (
                    <span key={i} style={{ fontSize: "0.65rem", textTransform: "uppercase", background: "#333", color: "#aaa", padding: "2px 6px", borderRadius: "4px", fontWeight: "bold" }}>{plat}</span>
                  ))}
                </div>

                <h3 onClick={() => handleNavigateToGame(game)} style={{ color: "white", fontSize: "1.1rem", margin: "0 0 10px 0", cursor: "pointer", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={game.title}>
                  {game.title}
                </h3>

                {/* --- LÓGICA DE PREÇO --- */}
                <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {/* Se tem desconto E ele é maior que zero */}
                        {game.discountPrice && Number(game.discountPrice) > 0 ? (
                            <>
                                <span style={{ fontSize: "0.8rem", color: "#666", textDecoration: "line-through" }}>{formatPrice(game.price)}</span>
                                <span style={{ fontSize: "1.1rem", color: "#4ade80", fontWeight: "bold" }}>{formatPrice(game.discountPrice)}</span>
                            </>
                        ) : (
                            /* Senão, mostra preço normal */
                            <span style={{ fontSize: "1.1rem", color: "white", fontWeight: "bold" }}>{formatPrice(game.price)}</span>
                        )}
                    </div>

                    <button
                        onClick={() => handleAddToCart(game)}
                        title="Adicionar ao Carrinho"
                        style={{
                            background: isAuthenticated ? "#6c5ce7" : "#444",
                            border: "none", borderRadius: "8px", width: "40px", height: "40px",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: isAuthenticated ? "pointer" : "not-allowed", color: "white", transition: "background 0.2s"
                        }}
                    >
                        <ShoppingCart size={20} />
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}