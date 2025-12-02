import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { orderService, type Order } from "../api/order";
import { ArrowLeft } from "lucide-react";

export function MyGames() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyGames();
  }, []);

  async function loadMyGames() {
    try {
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error("Erro ao carregar biblioteca:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: "2rem", color: "white", textAlign: "center" }}>
        Carregando sua biblioteca...
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "2rem",
        minHeight: "100vh",
        backgroundColor: "#1a1a1a",
        color: "white",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Botão de Voltar (Seta) */}
          <button
            onClick={() => navigate("/")}
            className="botao"
            style={{
              background: "none",
              border: "none",

              cursor: "pointer",
              display: "flex",
              padding: 0,
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Seu Título */}
          <h2 style={{ margin: 0, color: "#fff" }}>Minha Biblioteca</h2>
        </div>

        {orders.length === 0 ? (
          <p style={{ color: "#aaa", marginTop: "2rem" }}>
            Você ainda não possui jogos.
          </p>
        ) : (
          <div style={{ marginTop: "2rem" }}>
            {/* Mapeia cada PEDIDO */}
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  marginBottom: "2rem",
                  background: "#252525",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                {/* Cabeçalho do Pedido */}
                <div
                  style={{
                    background: "#333",
                    padding: "10px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.9rem",
                    color: "#ccc",
                  }}
                >
                  <span>Pedido #{order.id}</span>
                  <span>
                    {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                  <span style={{ color: "#27ae60", fontWeight: "bold" }}>
                    {order.status}
                  </span>
                </div>

                {/* Itens do Pedido */}
                <div style={{ padding: "1rem" }}>
                  {order.items.map((item: any) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        gap: "1rem",
                        alignItems: "center",
                        marginBottom: "10px",
                        paddingBottom: "10px",
                        borderBottom: "1px solid #333",
                      }}
                    >
                      {/* Imagem Miniatura */}
                      <div
                        style={{
                          width: "80px",
                          height: "50px",
                          background: "#000",
                          borderRadius: "4px",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={
                            item.game.coverUrl ||
                            "https://placehold.co/100x60?text=Game"
                          }
                          alt={item.game.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>

                      {/* Info do Jogo */}
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: 0, fontSize: "1.1rem" }}>
                          {item.game.title}
                        </h3>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.8rem",
                            color: "#888",
                          }}
                        >
                          Chave: XXXXX-XXXXX-XXXXX
                        </p>
                      </div>

                      <button
                        style={{
                          background: "#646cff",
                          color: "white",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                        }}
                      >
                        Instalar / Baixar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
