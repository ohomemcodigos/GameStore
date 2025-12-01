import { useState, useRef, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { orderService } from "../api/order";

export function CartWidget() {
  const { cart, removeFromCart, clearCart, total } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate(); // Para uso futuro

  // Criamos uma referência para o elemento do carrinho
  const cartRef = useRef<HTMLDivElement>(null);

  // useEffect para detectar cliques fora do widget
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Se o carrinho existe & o clique não for dentro dele
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    // Adiciona um "ouvinte" de cliques quando o componente monta
    document.addEventListener("mousedown", handleClickOutside);

    // Remove quando o componente desmonta (limpeza)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatPrice = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);

  const handleCheckout = () => {
    setIsOpen(false);
    navigate("/checkout"); // Redireciona para a página dedicada
  };
  return (
    // Adiciona a ref no container pai
    <div ref={cartRef} style={{ position: "relative" }}>
      {/* Botão do Ícone */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "transparent",
          border: "none",
          color: "white", // O SVG vai herdar essa cor
          cursor: "pointer",
          position: "relative",
          // fontSize: '1.5rem', // Removi pois o tamanho agora é controlado pelo SVG
          display: "flex",
          alignItems: "center",
          padding: "5px", // Adicionei um pequeno padding para facilitar o clique
        }}
      >
        {/* INÍCIO DO VETOR (SVG) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor" // Isso faz o ícone ficar BRANCO (herda do pai)
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        {/* FIM DO VETOR (SVG) */}

        {cart.length > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-5px", // Ajustei levemente a posição
              right: "-5px", // Ajustei levemente a posição
              background: "#e74c3c",
              color: "white",
              borderRadius: "50%",
              padding: "2px 6px",
              fontSize: "0.7rem",
              fontWeight: "bold",
              minWidth: "18px", // Garante que fique redondinho mesmo com 1 digito
              textAlign: "center",
            }}
          >
            {cart.length}
          </span>
        )}
      </button>
      {/* Modal */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "0",
            width: "300px",
            backgroundColor: "white",
            color: "black",
            borderRadius: "8px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
            padding: "1rem",
            zIndex: 1000,
          }}
        >
          <h4
            style={{
              borderBottom: "1px solid #eee",
              paddingBottom: "0.5rem",
              margin: "0 0 1rem 0",
            }}
          >
            Seu Carrinho
          </h4>

          {cart.length === 0 ? (
            <p
              style={{ color: "#666", textAlign: "center", fontSize: "0.9rem" }}
            >
              Carrinho vazio.
            </p>
          ) : (
            <>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
              >
                {cart.map((item) => (
                  <li
                    key={item.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                      alignItems: "center",
                      borderBottom: "1px solid #f0f0f0",
                      paddingBottom: "5px",
                    }}
                  >
                    <div style={{ fontSize: "0.9rem" }}>
                      <strong style={{ display: "block" }}>{item.title}</strong>
                      <span style={{ color: "#27ae60" }}>
                        {formatPrice(Number(item.price))}
                      </span>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        color: "#e74c3c",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                      }}
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>

              <div
                style={{
                  borderTop: "2px solid #f0f0f0",
                  paddingTop: "10px",
                  marginTop: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: "bold",
                    marginBottom: "1rem",
                  }}
                >
                  <span>Total:</span>
                  <span style={{ color: "#27ae60" }}>{formatPrice(total)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  style={{
                    width: "100%",
                    padding: "10px",
                    background: isProcessing ? "#95a5a6" : "#27ae60", // Cinza se carregando, Verde se normal
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: isProcessing ? "not-allowed" : "pointer",
                    fontWeight: "bold",
                  }}
                >
                  {isProcessing ? "Processando..." : "Finalizar Compra"}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
