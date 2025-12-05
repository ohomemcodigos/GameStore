import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type Game } from '../api/game';
import { toast } from 'sonner'; // Já preparando para o passo 2!

interface CartContextData {
  cart: Game[];
  addToCart: (game: Game) => void;
  removeFromCart: (gameId: number | string) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: { children: ReactNode }) {
  
  // 1. INICIALIZAÇÃO INTELIGENTE
  const [cart, setCart] = useState<Game[]>(() => {
    const storedCart = localStorage.getItem('@GameStore:cart');
    if (storedCart) {
      return JSON.parse(storedCart);
    }
    return [];
  });

  // 2. SALVAMENTO AUTOMÁTICO
  useEffect(() => {
    localStorage.setItem('@GameStore:cart', JSON.stringify(cart));
  }, [cart]);

  const total = cart.reduce((acc, game) => {
    const price = game.discountPrice ? Number(game.discountPrice) : Number(game.price);
    return acc + price;
  }, 0);

  function addToCart(game: Game) {
    const gameAlreadyInCart = cart.find(g => g.id === game.id);
    
    if (gameAlreadyInCart) {
      toast.warning("Este jogo já está no seu carrinho!"); // Notificação bonita
      return;
    }

    setCart((state) => [...state, game]);
    toast.success(`${game.title} adicionado ao carrinho!`);
  }

  function removeFromCart(gameId: number | string) {
    setCart((state) => state.filter(game => game.id !== gameId));
    toast.info("Jogo removido do carrinho.");
  }

  function clearCart() {
    setCart([]);
    localStorage.removeItem('@GameStore:cart'); // Limpa a memória também
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);