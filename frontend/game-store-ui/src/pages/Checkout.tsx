import { useState, type FormEvent } from 'react';
import { useCart } from '../context/CartContext';
import { orderService } from '../api/order';
import { useNavigate } from 'react-router-dom';

export function Checkout() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Estados do Formulário
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Formata o preço para BRL
  const formatPrice = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  async function handleFinalizePurchase(e: FormEvent) {
    e.preventDefault();
    
    if (cart.length === 0) {
        alert("Seu carrinho está vazio.");
        navigate('/');
        return;
    }

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      const gameIds = cart.map(g => g.id);
      await orderService.createOrder(gameIds);

      alert("Pagamento Aprovado! Compra realizada com sucesso.");
      clearCart();
      navigate('/'); 

    } catch (error: any) {
      console.error(error);
      alert("Erro ao processar pagamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', backgroundColor: '#1a1a1a', color: 'white', display: 'flex', justifyContent: 'center' }}>
      
      <div style={{ width: '100%', maxWidth: '1000px' }}>
        
        {/* BOTÃO DE VOLTAR */}
        <div style={{ marginBottom: '2rem' }}>
            <button 
            onClick={() => navigate('/')}
            style={{
                background: 'transparent',
                border: '1px solid #444',
                borderRadius: '4px',
                color: '#ccc',
                cursor: 'pointer',
                fontSize: '0.9rem',
                padding: '8px 16px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#fff';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.background = '#333';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#444';
                e.currentTarget.style.color = '#ccc';
                e.currentTarget.style.background = 'transparent';
            }}
            >
            ← Voltar para a Loja
            </button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'flex-start' }}>
        
            {/* --- FORMULÁRIO DE PAGAMENTO --- */}
            <div style={{ flex: 2, minWidth: '300px' }}>
            <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginTop: 0 }}>Pagamento</h2>
            
            <form onSubmit={handleFinalizePurchase} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                
                <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#ccc' }}>Nome no Cartão</label>
                <input required type="text" placeholder="" value={cardName} onChange={e => setCardName(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #444', background: '#222', color: 'white' }} />
                </div>

                <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#ccc' }}>Número do Cartão</label>
                <input required type="text" placeholder="" maxLength={19} value={cardNumber} onChange={e => setCardNumber(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #444', background: '#222', color: 'white' }} />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#ccc' }}>Validade</label>
                    <input required type="text" placeholder="MM/AA" maxLength={5} value={expiry} onChange={e => setExpiry(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #444', background: '#222', color: 'white' }} />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#ccc' }}>CVV</label>
                    <input required type="text" placeholder="XXX" maxLength={3} value={cvv} onChange={e => setCvv(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #444', background: '#222', color: 'white' }} />
                </div>
                </div>

                <button type="submit" disabled={loading}
                style={{
                    marginTop: '20px', padding: '15px', fontSize: '1.1rem', fontWeight: 'bold',
                    background: loading ? '#555' : '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s'
                }}
                >
                {loading ? 'Processando Pagamento...' : `Pagar ${formatPrice(total)}`}
                </button>
            </form>
            </div>

            {/* --- RESUMO DA COMPRA --- */}
            <div style={{ flex: 1, minWidth: '280px', background: '#252525', padding: '2rem', borderRadius: '8px', height: 'fit-content', border: '1px solid #333' }}>
            <h3 style={{ marginTop: 0, borderBottom: '1px solid #444', paddingBottom: '10px' }}>Resumo do Pedido</h3>
            
            <ul style={{ listStyle: 'none', padding: 0, marginTop: '1.5rem' }}>
                {cart.map(item => (
                <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '0.95rem', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                    <span style={{ maxWidth: '70%' }}>{item.title}</span>
                    <span style={{ color: '#ccc' }}>{formatPrice(Number(item.price))}</span>
                </li>
                ))}
            </ul>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingTop: '15px', borderTop: '2px solid #444', fontSize: '1.3rem', fontWeight: 'bold' }}>
                <span>Total</span>
                <span style={{ color: '#27ae60' }}>{formatPrice(total)}</span>
            </div>
            </div>

        </div>
      </div>
    </div>
  );
}