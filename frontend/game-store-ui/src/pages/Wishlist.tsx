import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Ghost, ShoppingBag, Search, X } from "lucide-react"; 
import { wishlistService } from "../api/wishlist";
import { type Game } from "../api/game";
import { WishlistButton } from "../components/WishlistButton";

export function Wishlist() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // Novo estado para busca
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

  const normalizeText = (text: string) => {
    return text
      .normalize("NFD") // Separa "é" em "e" + "´"
      .replace(/[\u0300-\u036f]/g, "") // Remove os acentos
      .toLowerCase(); // Coloca tudo minúsculo
  };

  // Lógica de Filtro Melhorada (Ignora acentos)
  const filteredGames = games.filter(game => 
    normalizeText(game.title).includes(normalizeText(searchTerm))
  );

  const formatPrice = (val: number | string) => {
    const num = Number(val);
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
  };

  if (loading)
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: "#121212", color: '#888' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ width: '20px', height: '20px', border: '2px solid #6c5ce7', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <span>Carregando seus favoritos...</span>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );

  return (
    <div
      style={{
        padding: "2rem",
        minHeight: "100vh",
        backgroundColor: "#121212",
        color: "white",
        fontFamily: 'system-ui, sans-serif'
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        
        {/* --- CABEÇALHO --- */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "2rem",
            paddingBottom: "15px",
            borderBottom: "1px solid #333",
            flexWrap: 'wrap',
            gap: '15px'
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <button
              onClick={() => navigate("/")}
              style={{
                background: "transparent",
                border: "1px solid #444",
                borderRadius: "8px",
                color: "#ccc",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'white'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.color = '#ccc'; }}
            >
              <ArrowLeft size={20} />
            </button>

            <h2 style={{ margin: 0, color: "#fff", display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.8rem' }}>
                Lista de Desejos
            </h2>
          </div>
          
          <div style={{ color: "#888", fontSize: "0.9rem" }}>
            {games.length} {games.length === 1 ? 'jogo salvo' : 'jogos salvos'}
          </div>
        </div>

        {/* --- BARRA DE PESQUISA (Só aparece se tiver jogos na lista) --- */}
        {games.length > 0 && (
            <div style={{ marginBottom: "2rem", position: 'relative' }}>
                <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                
                <input 
                    type="text" 
                    placeholder="Buscar nos seus favoritos..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '12px 12px 12px 45px', // Espaço para o ícone
                        borderRadius: '8px',
                        border: '1px solid #333',
                        backgroundColor: '#1e1e1e',
                        color: 'white',
                        fontSize: '1rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                    }}
                />
                
                {/* Botão de Limpar Busca */}
                {searchTerm && (
                    <button 
                        onClick={() => setSearchTerm('')}
                        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
                    >
                        <X size={18} />
                    </button>
                )}
            </div>
        )}

        {/* --- CONTEÚDO --- */}
        {games.length === 0 ? (
          
          /* CENÁRIO 1: WISHLIST VAZIA (Sem jogos salvos) */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 0', color: '#555' }}>
            <Ghost size={80} strokeWidth={1} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#ccc' }}>Sua lista está vazia</h3>
            <p style={{ maxWidth: '400px', textAlign: 'center', marginBottom: '2rem' }}>
              Parece que você ainda não favoritou nenhum jogo. Explore nossa loja e salve o que você quer jogar no futuro!
            </p>
            <button 
                onClick={() => navigate('/')}
                style={{ 
                    background: '#6c5ce7', color: 'white', border: 'none', padding: '12px 24px', 
                    borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(108, 92, 231, 0.4)'
                }}
            >
                <ShoppingBag size={20} /> Ir para a Loja
            </button>
          </div>

        ) : filteredGames.length === 0 ? (

            /* CENÁRIO 2: BUSCA SEM RESULTADOS (Tem jogos, mas o filtro não achou) */
            <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
                <Search size={50} style={{ marginBottom: '15px', opacity: 0.3 }} />
                <p>Nenhum jogo encontrado com o termo <strong>"{searchTerm}"</strong>.</p>
                <button 
                    onClick={() => setSearchTerm('')} 
                    style={{ marginTop: '10px', background: 'transparent', border: '1px solid #555', color: '#ccc', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Limpar Filtros
                </button>
            </div>

        ) : (
          
          /* CENÁRIO 3: GRID DE JOGOS (Filtrados) */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "2rem",
            }}
          >
            {filteredGames.map((game) => (
              <div
                key={game.id}
                style={{
                  background: "#1e1e1e",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "1px solid #333",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  position: "relative"
                }}
                onMouseEnter={(e) => { 
                    e.currentTarget.style.transform = 'translateY(-5px)'; 
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.5)';
                    e.currentTarget.style.borderColor = '#555';
                }}
                onMouseLeave={(e) => { 
                    e.currentTarget.style.transform = 'translateY(0)'; 
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = '#333';
                }}
              >
                {/* Imagem + Botão Favorito Flutuante */}
                <div style={{ position: "relative", height: "160px" }}>
                    <img
                        src={game.coverUrl || "https://placehold.co/400x600"}
                        alt={game.title}
                        onClick={() => navigate(`/game/${game.id}`)}
                        style={{ width: "100%", height: "100%", objectFit: "cover", cursor: "pointer" }}
                    />
                    <div style={{ position: "absolute", top: "10px", right: "10px", background: 'rgba(0,0,0,0.7)', borderRadius: '50%', padding: '5px', display: 'flex' }}>
                        <WishlistButton gameId={Number(game.id)} />
                    </div>
                </div>

                {/* Informações do Card */}
                <div style={{ padding: "1.2rem", display: "flex", flexDirection: "column", flex: 1 }}>
                    
                    <h3 
                        onClick={() => navigate(`/game/${game.id}`)}
                        style={{ 
                            fontSize: "1.1rem", margin: "0 0 5px 0", cursor: 'pointer', 
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' 
                        }}
                        title={game.title}
                    >
                        {game.title}
                    </h3>
                    
                    {/* Preço */}
                    <div style={{ marginBottom: "15px", fontSize: "0.95rem", color: "#ccc" }}>
                        {Number(game.price) === 0 ? (
                            <span style={{ color: "#27ae60", fontWeight: "bold" }}>Grátis</span>
                        ) : (
                            <span style={{ color: "#27ae60", fontWeight: "bold" }}>{formatPrice(game.price)}</span>
                        )}
                    </div>

                    <div style={{ marginTop: 'auto' }}>
                        <button
                            onClick={() => navigate(`/game/${game.id}`)}
                            style={{
                                width: "100%",
                                padding: "10px",
                                background: "transparent",
                                color: "#6c5ce7",
                                border: "1px solid #6c5ce7",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontWeight: "bold",
                                transition: "all 0.2s"
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#6c5ce7'; e.currentTarget.style.color = 'white'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6c5ce7'; }}
                        >
                            Ver Detalhes
                        </button>
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}