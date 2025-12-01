import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gameService, type Game } from "../../api/game";
import { GameFormModal } from "../../components/admin/GameFormModal";

export function AdminDashboard() {
  const [games, setGames] = useState<Game[]>([]);
  const navigate = useNavigate();

  // Estados para controle do Modal
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

  // Abre modal para criar novo jogo
  function handleNewGame() {
    setSelectedGame(null); // Garante que está limpo
    setIsModalOpen(true);
  }

  // Abre modal para EDITAR
  function handleEditGame(game: Game) {
    setSelectedGame(game); // Passa os dados do jogo
    setIsModalOpen(true);
  }

  // Função de Excluir
  async function handleDelete(id: number | string) {
    if (confirm("Tem certeza que deseja excluir este jogo?")) {
      try {
        // Garante que o ID é um número antes de enviar para a API
        const numericId = Number(id);
        await gameService.delete(numericId);

        // Remove da lista visualmente
        setGames((current) => current.filter((g) => g.id !== id));
      } catch (error) {
        console.error(error);
        alert("Erro ao excluir jogo.");
      }
    }
  }

  return (
    <div
      style={{
        padding: "2rem",
        background: "#1a1a1a",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Cabeçalho */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <h1>Dashboard</h1>
          <button
            onClick={handleNewGame}
            style={{
              background: "#27ae60",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            + Novo Jogo
          </button>
          <button
            onClick={() => navigate(`/`)}
            style={{
              background: "#27ae60",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Voltar
          </button>
        </div>

        {/* Tabela */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#333",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr style={{ background: "#444", textAlign: "left" }}>
              <th style={{ padding: "1rem" }}>ID</th>
              <th style={{ padding: "1rem" }}>Título</th>
              <th style={{ padding: "1rem" }}>Preço</th>
              <th style={{ padding: "1rem" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => (
              <tr key={game.id} style={{ borderBottom: "1px solid #555" }}>
                <td style={{ padding: "1rem" }}>{game.id}</td>
                <td style={{ padding: "1rem" }}>{game.title}</td>
                <td style={{ padding: "1rem" }}>
                  R$ {Number(game.price).toFixed(2)}
                </td>
                <td style={{ padding: "1rem", display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => handleEditGame(game)}
                    style={{
                      background: "#f39c12",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      color: "white",
                    }}
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => handleDelete(game.id)}
                    style={{
                      background: "#c0392b",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      color: "white",
                    }}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal */}
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
