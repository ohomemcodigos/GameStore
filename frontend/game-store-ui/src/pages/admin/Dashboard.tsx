import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gameService, type Game } from "../../api/game";
import { GameFormModal } from "../../components/admin/GameFormModal";

// Ícones simples e diretos
import { Plus, ArrowLeft, Pencil, Trash2, Image as ImageIcon } from "lucide-react";

export function AdminDashboard() {
  const [games, setGames] = useState<Game[]>([]);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  useEffect(() => {
    loadGames();
  }, []);

  async function loadGames() {
    try {
      const data = await gameService.getAll();
      setGames(data);
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
    if (confirm("Tem certeza que deseja excluir este jogo?")) {
      try {
        const numericId = Number(id);
        await gameService.delete(numericId);
        setGames((current) => current.filter((g) => g.id !== id));
      } catch (error) {
        console.error(error);
        alert("Erro ao excluir jogo.");
      }
    }
  }

  // Formata preço
  const formatPrice = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div
      style={{
        padding: "2rem",
        background: "#1a1a1a",
        minHeight: "100vh",
        color: "white",
        fontFamily: "sans-serif"
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        {/* --- CABEÇALHO SIMPLES --- */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
            borderBottom: "1px solid #333",
            paddingBottom: "1rem"
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
                onClick={() => navigate(`/`)}
                style={{
                background: "transparent",
                color: "#ccc",
                border: "1px solid #444",
                padding: "8px",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex"
                }}
                title="Voltar para Loja"
            >
                <ArrowLeft size={20} />
            </button>
            <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Admin Dashboard</h1>
          </div>

          <button
            onClick={handleNewGame}
            style={{
              background: "#5241b2", // Roxo do site
              color: "white",
              border: "none",
              padding: "10px 16px",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <Plus size={18} />
            Novo Jogo
          </button>
        </div>

        {/* --- TABELA LIMPA --- */}
        <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #333' }}>
            <table
            style={{
                width: "100%",
                borderCollapse: "collapse",
                background: "#252525",
                textAlign: "left"
            }}
            >
            <thead>
                <tr style={{ background: "#333", color: "#ccc" }}>
                <th style={{ padding: "1rem" }}>Capa</th>
                <th style={{ padding: "1rem" }}>ID</th>
                <th style={{ padding: "1rem" }}>Título</th>
                <th style={{ padding: "1rem" }}>Preço</th>
                <th style={{ padding: "1rem", textAlign: "right" }}>Ações</th>
                </tr>
            </thead>
            <tbody>
                {games.map((game) => (
                <tr key={game.id} style={{ borderBottom: "1px solid #333" }}>
                    {/* Coluna da Imagem (Pequena) */}
                    <td style={{ padding: "0.8rem" }}>
                        {game.coverUrl ? (
                            <img src={game.coverUrl} alt="" style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }} />
                        ) : (
                            <div style={{ width: "40px", height: "40px", background: "#444", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <ImageIcon size={20} color="#666" />
                            </div>
                        )}
                    </td>
                    
                    <td style={{ padding: "1rem", color: "#888" }}>{game.id}</td>
                    <td style={{ padding: "1rem", fontWeight: "bold" }}>{game.title}</td>
                    <td style={{ padding: "1rem", color: "#4ade80" }}>
                        {formatPrice(Number(game.price))}
                    </td>
                    
                    {/* Botões de Ação com Ícones */}
                    <td style={{ padding: "1rem", display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                    <button
                        onClick={() => handleEditGame(game)}
                        title="Editar"
                        style={{
                        background: "#333",
                        border: "1px solid #555",
                        padding: "8px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        color: "white",
                        display: "flex"
                        }}
                    >
                        <Pencil size={16} />
                    </button>

                    <button
                        onClick={() => handleDelete(game.id)}
                        title="Excluir"
                        style={{
                        background: "rgba(231, 76, 60, 0.2)", // Vermelho clarinho
                        border: "1px solid #c0392b",
                        padding: "8px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        color: "#e74c3c", // Vermelho
                        display: "flex"
                        }}
                    >
                        <Trash2 size={16} />
                    </button>
                    </td>
                </tr>
                ))}
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