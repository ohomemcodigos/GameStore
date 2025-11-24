import api from './config';
import { type Game } from './game';

export const wishlistService = {
  // Adicionar/Remover na wishlist
  async toggle(gameId: number) {
    const response = await api.post('/api/wishlist', { gameId });
    return response.data; // Retorna { action: 'added' | 'removed' }
  },

  // Listar
  async getMyWishlist(): Promise<Game[]> {
    const response = await api.get<Game[]>('/api/wishlist');
    return response.data;
  },

  // Verificar se já está na wishlist
  async checkStatus(gameId: number): Promise<boolean> {
    const response = await api.get<{ inWishlist: boolean }>(`/api/wishlist/check/${gameId}`);
    return response.data.inWishlist;
  }
};