import api from './config';
import { type Game } from './game';

// Tipagem dos itens dentro do pedido
export interface OrderItem {
  id: number;
  game: Game;
  priceAtPurchase: string | number;
}

// Tipagem do Pedido completo
export interface Order {
  id: number;
  total: string | number;
  status: string; // 'PENDING', 'COMPLETED', etc.
  createdAt: string;
  items: OrderItem[];
}

export const orderService = {
  // Função que finaliza a compra
  // Recebe uma lista de IDs (ex: [1, 5, 8])
  async createOrder(gameIds: (string | number)[]): Promise<Order> {
    const response = await api.post<Order>('/api/orders', { gameIds });
    return response.data;
  },

  // Função para listar histórico (usaremos em breve)
  async getMyOrders(): Promise<Order[]> {
    const response = await api.get<Order[]>('/api/orders/my-orders');
    return response.data;
  }
};