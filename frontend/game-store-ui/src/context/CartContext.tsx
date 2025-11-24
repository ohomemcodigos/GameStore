import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Game } from '../api/game';

interface CartContextData {
  cart: Game[];
  addToCart: (game: Game) => void;
  removeFromCart: (gameId: string | number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Game[]>([]);

  // Carrega do LocalStorage ao abrir
  useEffect(() => {
    const storedCart = localStorage.getItem('@GameStore:cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Salva no LocalStorage sempre que o carrinho muda
  useEffect(() => {
    localStorage.setItem('@GameStore:cart', JSON.stringify(cart));
  }, [cart]);

  function addToCart(game: Game) {
    // Evita duplicatas de keys
    const alreadyInCart = cart.find(item => item.id === game.id);
    if (alreadyInCart) {
      alert('Este jogo já está no carrinho!');
      return;
    }
    setCart([...cart, game]);
  }

  function removeFromCart(gameId: string | number) {
    setCart(cart.filter(item => item.id !== gameId));
  }

  function clearCart() {
    setCart([]);
  }

  // Calcula o total
  const total = cart.reduce((acc, item) => acc + Number(item.price), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}