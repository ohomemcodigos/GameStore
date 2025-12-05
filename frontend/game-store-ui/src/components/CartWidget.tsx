import { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';


export function CartWidget() {
  const { cart, removeFromCart, total } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing] = useState(false);
  const navigate = useNavigate();

  const cartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatPrice = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const handleCheckout = () => {
    setIsOpen(false);
    navigate('/checkout');
  };

  return (
    <div ref={cartRef} style={{ position: 'relative' }}>

      {/* --- BOTÃO DO CARRINHO ESTILIZADO --- */}
      <button
        className="botao" // Para pegar o mesmo CSS de hover se tiver
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "transparent",
          border: "0px solid #555",
          padding: "6px 12px",
          borderRadius: "4px",
          cursor: "pointer",
          display: "flex",       // Alinha ícone e texto
          alignItems: "center",  // Centraliza verticalmente
          gap: "8px",            // Espaço entre ícone e texto
          position: 'relative'   // Necessário para a bolinha vermelha (Badge)
        }}
      >
        {/* Ícone do Carrinho */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"  // Ajustei para 18 igual aos outros
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>

        {/* Texto para ficar padrão com os outros */}
        Carrinho

        {/* Bolinha Vermelha (Badge) */}
        {cart.length > 0 && (
          <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            background: '#e74c3c', // Vermelho
            color: 'white',
            borderRadius: '50%',
            padding: '2px 0.3px',
            fontSize: '0.7rem',
            fontWeight: 'bold',
            minWidth: '18px',
            textAlign: 'center',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)' // Sombra pra destacar
          }}>
            {cart.length}
          </span>
        )}
      </button>

      {/* --- MODAL DO CARRINHO (Não mudei a lógica, só o visual básico) --- */}
      {isOpen && (
        <div style={{
          position: 'absolute', top: '45px', right: '0', width: '320px', // Aumentei um pouco a largura
          backgroundColor: '#2a2a2a', // Mudei para escuro para combinar com o tema
          color: 'white',
          borderRadius: '8px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)', 
          padding: '1rem', 
          zIndex: 1000,
          border: '1px solid #444'
        }}>
          <h4 style={{ borderBottom: '1px solid #444', paddingBottom: '0.5rem', margin: '0 0 1rem 0' }}>Seu Carrinho</h4>

          {cart.length === 0 ? (
            <p style={{ color: '#ccc', textAlign: 'center', fontSize: '0.9rem' }}>Carrinho vazio.</p>
          ) : (
            <>
              <ul style={{ listStyle: 'none', padding: 0, maxHeight: '200px', overflowY: 'auto' }}>
                {cart.map(item => (
                  <li key={item.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                    alignItems: 'center',
                    borderBottom: '1px solid #444',
                    paddingBottom: '5px'
                  }}>
                    <div style={{ fontSize: '0.9rem' }}>
                      <strong style={{ display: 'block' }}>{item.title}</strong>
                      <span style={{ color: '#4ade80' }}>{formatPrice(Number(item.price))}</span>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        color: '#ff4757',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        padding: '0 5px'
                      }}
                      title="Remover item"
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>

              <div style={{
                borderTop: '2px solid #444',
                paddingTop: '10px',
                marginTop: '10px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 'bold',
                  marginBottom: '1rem'
                }}>
                  <span>Total:</span>
                  <span style={{ color: '#4ade80' }}>{formatPrice(total)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: isProcessing ? '#95a5a6' : '#27ae60',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  {isProcessing ? 'Processando...' : 'Finalizar Compra'}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}