import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gameService, type Game } from "../../api/game";
import { GameFormModal } from "../../components/admin/GameFormModal";

// Ícones
import { Plus, ArrowLeft, Pencil, Trash2, Image as ImageIcon, Search, Star, Package } from "lucide-react";

export function AdminDashboard() {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  useEffect(() => {
    loadGames();
  }, []);

  // Lógica de Filtro (Sem acentos)
  useEffect(() => {
    const normalizeText = (text: string) => 
        text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const results = games.filter(game => 
        normalizeText(game.title).includes(normalizeText(searchTerm))
    );
    setFilteredGames(results);
  }, [searchTerm, games]);

  async function loadGames() {
    try {
      const data = await gameService.getAll();
      setGames(data);
      setFilteredGames(data);
    } catch (error) {
      console.error("Erro ao carregar jogos:", error);
    }
  }

  function handleNewGame() {
    setSelectedGame(null);
    setIsModalOpen(true);
  }

  function handleEditGame(game: Game) {
    setSelectedGame(game);
    setIsModalOpen(true);
  }

  async function handleDelete(id: number | string) {
    if (confirm("Tem certeza que deseja excluir este jogo? Essa ação não pode ser desfeita.")) {
      try {
        const numericId = Number(id);
        await gameService.delete(numericId);
        // Atualiza as duas listas para remover visualmente
        setGames((current) => current.filter((g) => g.id !== id));
      } catch (error) {
        console.error(error);
        alert("Erro ao excluir jogo.");
      }
    }
  }

  const formatPrice = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div style={{ padding: "2rem", background: "#121212", minHeight: "100vh", color: "white", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        
        {/* --- CABEÇALHO --- */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "1px solid #333", paddingBottom: "1.5rem" }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button
                onClick={() => navigate(`/`)}
                style={{ background: "transparent", color: "#ccc", border: "1px solid #444", padding: "10px", borderRadius: "8px", cursor: "pointer", display: "flex", transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.color = '#ccc'; }}
                title="Voltar para Loja"
            >
                <ArrowLeft size={20} />
            </button>
            <div>
                <h1 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Package size={28} color="#a29bfe" /> Painel Admin
                </h1>
                <span style={{ color: '#888', fontSize: '0.9rem' }}>Gerencie o catálogo de jogos</span>
            </div>
          </div>

          <button
            onClick={handleNewGame}
            style={{
              background: "#6c5ce7", color: "white", border: "none", padding: "12px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold",
              display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 4px 15px rgba(108, 92, 231, 0.4)", transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Plus size={20} /> Novo Jogo
          </button>
        </div>

        {/* --- BARRA DE FERRAMENTAS --- */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', background: '#1e1e1e', padding: '15px', borderRadius: '12px', border: '1px solid #333' }}>
            
            {/* Campo de Busca */}
            <div style={{ position: 'relative', width: '350px' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                <input 
                    type="text" 
                    placeholder="Buscar por título..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: '8px', border: '1px solid #444', background: '#2d2d2d', color: 'white', outline: 'none' }}
                />
            </div>

            {/* Contador */}
            <div style={{ color: '#ccc', fontSize: '0.9rem' }}>
                Total: <strong>{filteredGames.length}</strong> jogos
            </div>
        </div>

        {/* --- TABELA DE JOGOS --- */}
        <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #333', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "#1e1e1e", textAlign: "left" }}>
            <thead>
                <tr style={{ background: "#252525", color: "#ccc", fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    <th style={{ padding: "1.2rem", width: '80px' }}>Capa</th>
                    <th style={{ padding: "1.2rem" }}>Título</th>
                    <th style={{ padding: "1.2rem" }}>Preço</th>
                    <th style={{ padding: "1.2rem", textAlign: 'center' }}>Destaque</th>
                    <th style={{ padding: "1.2rem", textAlign: "right" }}>Ações</th>
                </tr>
            </thead>
            <tbody>
                {filteredGames.length > 0 ? filteredGames.map((game) => (
                <tr key={game.id} style={{ borderBottom: "1px solid #333", transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#2a2a2a'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    
                    {/* Imagem */}
                    <td style={{ padding: "1rem" }}>
                        {game.coverUrl ? (
                            <img src={game.coverUrl} alt="" style={{ width: "50px", height: "70px", objectFit: "cover", borderRadius: "6px", boxShadow: '0 2px 5px rgba(0,0,0,0.5)' }} />
                        ) : (
                            <div style={{ width: "50px", height: "70px", background: "#333", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <ImageIcon size={20} color="#666" />
                            </div>
                        )}
                    </td>
                    
                    {/* Título e ID */}
                    <td style={{ padding: "1rem" }}>
                        <div style={{ fontWeight: "bold", fontSize: '1rem', color: 'white' }}>{game.title}</div>
                        <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px' }}>ID: {game.id}</div>
                    </td>

                    {/* Preço */}
                    <td style={{ padding: "1rem", color: "#4ade80", fontWeight: 'bold' }}>
                        {formatPrice(Number(game.price))}
                    </td>
                    
                    {/* Destaque (Badge) */}
                    <td style={{ padding: "1rem", textAlign: 'center' }}>
                        {game.isFeatured ? (
                            <span style={{ background: 'rgba(255, 215, 0, 0.1)', color: '#ffd700', padding: '4px 8px', borderRadius: '20px', fontSize: '0.75rem', border: '1px solid rgba(255, 215, 0, 0.3)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <Star size={12} fill="#ffd700" /> Sim
                            </span>
                        ) : (
                            <span style={{ color: '#555', fontSize: '0.8rem' }}>-</span>
                        )}
                    </td>

                    {/* Ações */}
                    <td style={{ padding: "1rem" }}>
                        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                            <button
                                onClick={() => handleEditGame(game)}
                                title="Editar"
                                style={{ background: "#333", border: "1px solid #555", padding: "8px", borderRadius: "6px", cursor: "pointer", color: "white", transition: 'all 0.2s' }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#aaa'; e.currentTarget.style.background = '#444'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.background = '#333'; }}
                            >
                                <Pencil size={18} />
                            </button>

                            <button
                                onClick={() => handleDelete(game.id)}
                                title="Excluir"
                                style={{ background: "rgba(231, 76, 60, 0.1)", border: "1px solid rgba(231, 76, 60, 0.3)", padding: "8px", borderRadius: "6px", cursor: "pointer", color: "#e74c3c", transition: 'all 0.2s' }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#e74c3c'; e.currentTarget.style.background = 'rgba(231, 76, 60, 0.2)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(231, 76, 60, 0.3)'; e.currentTarget.style.background = 'rgba(231, 76, 60, 0.1)'; }}
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </td>
                </tr>
                )) : (
                    <tr>
                        <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>
                            Nenhum jogo encontrado.
                        </td>
                    </tr>
                )}
            </tbody>
            </table>
        </div>

        {/* Modal (Mantido igual) */}
        <GameFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            loadGames();
          }}
          gameToEdit={selectedGame}
        />
      </div>
    </div>
  );
}