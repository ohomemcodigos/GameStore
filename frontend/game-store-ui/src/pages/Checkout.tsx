import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useCart } from '../context/CartContext';
import { orderService } from '../api/order';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner'; // <--- IMPORTANTE: Importar o toast

// Ícones
import { 
  CreditCard, 
  User, 
  Calendar, 
  Lock, 
  ArrowLeft, 
  ShieldCheck, 
  ShoppingBag,
  CheckCircle2,
  Loader2
} from 'lucide-react';

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

  // --- MÁSCARAS ---
  const handleExpiryChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 3) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setExpiry(value);
  };

  const handleCardNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(value);
  };

  const handleCvvChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCvv(value);
  };

  // --- FINALIZAR COMPRA ---
  async function handleFinalizePurchase(e: FormEvent) {
    e.preventDefault();
    
    if (cart.length === 0) {
        toast.warning("Seu carrinho está vazio.");
        navigate('/');
        return;
    }

    setLoading(true);

    try {
      // Simula delay de processamento
      await new Promise(resolve => setTimeout(resolve, 2000)); 
      
      const gameIds = cart.map(g => g.id);
      await orderService.createOrder(gameIds); 

      // ✅ Feedback Visual Bonito
      toast.success("Compra realizada com sucesso!", {
        description: "Suas chaves de ativação já estão disponíveis.",
        duration: 5000,
        action: {
            label: 'Ver Biblioteca',
            onClick: () => navigate('/my-games')
        }
      });

      clearCart();
      navigate('/'); 

    } catch (error: any) {
      console.error(error);
      toast.error("Erro ao processar pagamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  // Estilos
  const inputContainerStyle = {
    position: 'relative' as const,
    marginBottom: '1rem'
  };

  const iconStyle = {
    position: 'absolute' as const,
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#888',
    pointerEvents: 'none' as const
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 12px 12px 45px',
    borderRadius: '8px',
    border: '1px solid #444',
    background: '#2a2a2a',
    color: 'white',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box' as const,
    transition: 'border-color 0.2s'
  };

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', backgroundColor: '#121212', color: 'white', display: 'flex', justifyContent: 'center' }}>
      
      <div style={{ width: '100%', maxWidth: '1100px' }}>
        
        {/* CABEÇALHO */}
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button 
                onClick={() => navigate('/')}
                style={{
                    background: 'transparent',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#aaa',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#fff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#aaa'; e.currentTarget.style.borderColor = '#333'; }}
            >
                <ArrowLeft size={18} />
                Voltar para a Loja
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4ade80', fontSize: '0.9rem', background: 'rgba(74, 222, 128, 0.1)', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(74, 222, 128, 0.2)' }}>
                <ShieldCheck size={16} />
                <span style={{ fontWeight: 600 }}>Ambiente Seguro</span>
            </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start' }}>
        
            {/* --- ESQUERDA: FORMULÁRIO --- */}
            <div style={{ flex: 2, minWidth: '320px' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CreditCard size={24} color="#6c5ce7" />
                    Dados do Pagamento
                </h2>
            
                <div style={{ background: '#1e1e1e', padding: '2rem', borderRadius: '12px', border: '1px solid #333', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                    <form onSubmit={handleFinalizePurchase}>
                        
                        <div style={inputContainerStyle}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#ccc' }}>Nome no Cartão</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={iconStyle} />
                                <input 
                                    required type="text" placeholder="Como impresso no cartão" 
                                    value={cardName} onChange={e => setCardName(e.target.value)}
                                    style={inputStyle} 
                                    onFocus={(e) => e.target.style.borderColor = '#6c5ce7'}
                                    onBlur={(e) => e.target.style.borderColor = '#444'}
                                />
                            </div>
                        </div>

                        <div style={inputContainerStyle}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#ccc' }}>Número do Cartão</label>
                            <div style={{ position: 'relative' }}>
                                <CreditCard size={18} style={iconStyle} />
                                <input 
                                    required type="text" placeholder="0000 0000 0000 0000" maxLength={19} 
                                    value={cardNumber} onChange={handleCardNumberChange}
                                    style={inputStyle} 
                                    onFocus={(e) => e.target.style.borderColor = '#6c5ce7'}
                                    onBlur={(e) => e.target.style.borderColor = '#444'}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#ccc' }}>Validade</label>
                                <div style={{ position: 'relative' }}>
                                    <Calendar size={18} style={iconStyle} />
                                    <input 
                                        required type="text" placeholder="MM/AA" maxLength={5} 
                                        value={expiry} onChange={handleExpiryChange}
                                        style={inputStyle} 
                                        onFocus={(e) => e.target.style.borderColor = '#6c5ce7'}
                                        onBlur={(e) => e.target.style.borderColor = '#444'}
                                    />
                                </div>
                            </div>
                            
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#ccc' }}>CVV</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} style={iconStyle} />
                                    <input 
                                        required type="text" placeholder="123" maxLength={3} 
                                        value={cvv} onChange={handleCvvChange}
                                        style={inputStyle} 
                                        onFocus={(e) => e.target.style.borderColor = '#6c5ce7'}
                                        onBlur={(e) => e.target.style.borderColor = '#444'}
                                    />
                                </div>
                            </div>
                        </div>

                        <button type="submit" disabled={loading}
                            style={{
                                width: '100%', marginTop: '1rem', padding: '14px', fontSize: '1.1rem', fontWeight: 'bold',
                                background: loading ? '#444' : '#27ae60', color: 'white', border: 'none', borderRadius: '8px', 
                                cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                boxShadow: loading ? 'none' : '0 4px 15px rgba(39, 174, 96, 0.4)'
                            }}
                        >
                            {loading ? (
                                <><Loader2 className="animate-spin" size={20} /> Processando...</>
                            ) : (
                                <><CheckCircle2 size={20} /> Pagar {formatPrice(total)}</>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* --- DIREITA: RESUMO --- */}
            <div style={{ flex: 1, minWidth: '300px' }}>
                <div style={{ background: '#1e1e1e', padding: '2rem', borderRadius: '12px', border: '1px solid #333', position: 'sticky', top: '20px' }}>
                    <h3 style={{ marginTop: 0, borderBottom: '1px solid #444', paddingBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem' }}>
                        <ShoppingBag size={20} color="#ccc"/>
                        Resumo do Pedido
                    </h3>
                    
                    <ul style={{ listStyle: 'none', padding: 0, marginTop: '1.5rem', maxHeight: '300px', overflowY: 'auto' }}>
                        {cart.map(item => (
                            <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '0.95rem', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '65%' }}>
                                    <span style={{ fontWeight: '500' }}>{item.title}</span>
                                    <span style={{ fontSize: '0.8rem', color: '#888' }}>Digital Key</span>
                                </div>
                                <span style={{ color: '#ddd', fontWeight: 'bold' }}>{formatPrice(Number(item.price))}</span>
                            </li>
                        ))}
                    </ul>

                    <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '2px dashed #444' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '10px', fontSize: '0.9rem' }}>
                            <span>Subtotal</span>
                            <span>{formatPrice(total)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#27ae60', marginBottom: '20px', fontSize: '0.9rem' }}>
                            <span>Desconto</span>
                            <span>- R$ 0,00</span>
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Total</span>
                            <span style={{ color: '#27ae60', fontSize: '1.8rem', fontWeight: 'bold' }}>{formatPrice(total)}</span>
                        </div>
                    </div>

                    <div style={{ marginTop: '20px', fontSize: '0.8rem', color: '#666', textAlign: 'center', lineHeight: '1.4' }}>
                        Ao finalizar a compra, você concorda com nossos Termos de Serviço. As chaves serão enviadas para seu e-mail.
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}