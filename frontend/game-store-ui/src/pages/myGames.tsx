import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { orderService } from "../api/order";
import { ArrowLeft, Download, Key, Search, Star, Gamepad2, PackageOpen, X, Copy, Check } from "lucide-react";

// 1. Atualizei o tipo para incluir a chave
type OwnedGame = {
  gameId: number;
  title: string;
  coverUrl: string;
  purchaseDate: string;
  orderId: number;
  licenseKey: string; // <--- NOVO CAMPO
};

export function MyGames() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [ownedGames, setOwnedGames] = useState<OwnedGame[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // --- ESTADOS PARA O MODAL DE CHAVE ---
  const [keyModalOpen, setKeyModalOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState("");
  const [selectedGameTitle, setSelectedGameTitle] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadMyGames();
  }, []);

  async function loadMyGames() {
    try {
      const orders = await orderService.getMyOrders();
      
      const gamesList: OwnedGame[] = [];
      
      orders.forEach((order: any) => {
        if(order.status !== 'PENDING') { 
            order.items.forEach((item: any) => {
                // Lógica para pegar a chave com segurança
                // O backend retorna um array licenseKeys[] dentro do item
                const keyString = (item.licenseKeys && item.licenseKeys.length > 0) 
                    ? item.licenseKeys[0].keyString 
                    : "Chave não disponível (Contate o suporte)";

                gamesList.push({
                    gameId: item.game.id,
                    title: item.game.title,
                    coverUrl: item.game.coverUrl,
                    purchaseDate: order.createdAt,
                    orderId: order.id,
                    licenseKey: keyString // Guarda a chave aqui
                });
            });
        }
      });

      gamesList.sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());
      setOwnedGames(gamesList);
    } catch (error) {
      console.error("Erro ao carregar biblioteca:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredGames = ownedGames.filter(g => 
    g.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- FUNÇÕES DO MODAL ---
  const handleOpenKey = (gameTitle: string, key: string) => {
    setSelectedGameTitle(gameTitle);
    setSelectedKey(key);
    setKeyModalOpen(true);
    setCopied(false);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(selectedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reseta o ícone depois de 2s
  };

  if (loading) {
    return (
      <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#121212", color: "#888" }}>
        <div style={{ width: 24, height: 24, border: "2px solid #6c5ce7", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
        <span style={{ marginLeft: 10 }}>Carregando sua coleção...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", minHeight: "100vh", backgroundColor: "#121212", color: "white", fontFamily: 'system-ui, sans-serif' }}>
      
      {/* --- MODAL DE CHAVE (OVERLAY) --- */}
      {keyModalOpen && (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
        }} onClick={() => setKeyModalOpen(false)}>
            <div 
                onClick={(e) => e.stopPropagation()} // Impede fechar ao clicar dentro
                style={{ 
                    backgroundColor: '#1e1e1e', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '400px', 
                    border: '1px solid #333', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', position: 'relative'
                }}
            >
                <button onClick={() => setKeyModalOpen(false)} style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
                    <X size={20} />
                </button>

                <h3 style={{ marginTop: 0, color: '#ccc', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Chave de Ativação</h3>
                <h2 style={{ margin: '0 0 20px 0', fontSize: '1.2rem', color: 'white' }}>{selectedGameTitle}</h2>

                <div style={{ 
                    background: '#111', border: '2px dashed #444', padding: '15px', borderRadius: '8px', 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px'
                }}>
                    <code style={{ fontSize: '1.1rem', fontFamily: 'monospace', color: '#4ade80', letterSpacing: '2px' }}>
                        {selectedKey}
                    </code>
                    
                    <button 
                        onClick={handleCopyKey}
                        title="Copiar"
                        style={{ background: 'transparent', border: 'none', color: copied ? '#4ade80' : '#ccc', cursor: 'pointer' }}
                    >
                        {copied ? <Check size={20} /> : <Copy size={20} />}
                    </button>
                </div>

                <p style={{ marginTop: '20px', fontSize: '0.8rem', color: '#666', textAlign: 'center' }}>
                    Copie esta chave e ative-a na plataforma correspondente (Steam, Epic, etc).
                </p>
            </div>
        </div>
      )}

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* CABEÇALHO */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", borderBottom: "1px solid #333", paddingBottom: "15px", flexWrap: 'wrap', gap: '15px' }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <button 
                    onClick={() => navigate("/")}
                    style={{ background: "transparent", border: "1px solid #444", borderRadius: "8px", color: "#ccc", cursor: "pointer", display: "flex", padding: "8px", transition: "all 0.2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'white'; e.currentTarget.style.color = 'white'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.color = '#ccc'; }}
                >
                    <ArrowLeft size={20} />
                </button>
                <h2 style={{ margin: 0, color: "#fff", display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.8rem' }}>
                    <Gamepad2 size={28} color="#a29bfe" />
                    Minha Biblioteca
                </h2>
            </div>

            {/* Busca */}
            {ownedGames.length > 0 && (
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                    <input 
                        type="text" 
                        placeholder="Filtrar coleção..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: '20px', border: '1px solid #333', backgroundColor: '#1e1e1e', color: 'white', outline: 'none' }}
                    />
                </div>
            )}
        </div>

        {/* LISTAGEM */}
        {ownedGames.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 0', color: '#555' }}>
            <PackageOpen size={80} strokeWidth={1} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#ccc' }}>Sua biblioteca está vazia</h3>
            <button 
                onClick={() => navigate('/')}
                style={{ background: '#6c5ce7', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}
            >
                Ir para a Loja
            </button>
          </div>
        ) : (
          <>
            <p style={{ marginBottom: '1.5rem', color: '#888', fontSize: '0.9rem' }}>
                Exibindo {filteredGames.length} {filteredGames.length === 1 ? 'jogo' : 'jogos'} adquiridos
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2rem" }}>
                {filteredGames.map((item) => (
                    <div 
                        key={`${item.orderId}-${item.gameId}`}
                        style={{ 
                            background: '#1e1e1e', borderRadius: '12px', border: '1px solid #333', overflow: 'hidden', 
                            display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', position: 'relative' 
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        {/* Capa */}
                        <div 
                            style={{ height: '160px', overflow: 'hidden', cursor: 'pointer' }}
                            onClick={() => navigate(`/game/${item.gameId}`)}
                        >
                            <img 
                                src={item.coverUrl || "https://placehold.co/400x200?text=Game"} 
                                alt={item.title} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                        </div>

                        {/* Info */}
                        <div style={{ padding: '1.2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: 'white' }}>{item.title}</h3>
                            <span style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1rem' }}>
                                Adquirido em {new Date(item.purchaseDate).toLocaleDateString()}
                            </span>

                            {/* Ações */}
                            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                
                                <button style={{ 
                                    background: '#6c5ce7', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', 
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold' 
                                }}>
                                    <Download size={18} /> Instalar
                                </button>

                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {/* BOTÃO VER CHAVE */}
                                    <button 
                                        onClick={() => handleOpenKey(item.title, item.licenseKey)}
                                        style={{ 
                                            flex: 1, background: '#2d3436', color: '#ccc', border: '1px solid #444', padding: '8px', borderRadius: '6px', 
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.85rem' 
                                        }}
                                    >
                                        <Key size={16} /> Ver Chave
                                    </button>

                                    <button 
                                        onClick={() => navigate(`/game/${item.gameId}`)}
                                        style={{ 
                                        flex: 1, background: '#2d3436', color: '#ccc', border: '1px solid #444', padding: '8px', borderRadius: '6px', 
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.85rem' 
                                    }}>
                                        <Star size={16} /> Avaliar
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}