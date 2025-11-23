import api from './config';

// Interface de retorno do Prisma
export interface Game {
  id: string | number; // O Prisma pode usar Int ou UUID, aceita ambos por segurança
  title: string;
  description?: string;
  price: string | number; // O backend pode retornar string (Decimal) ou number
  imageUrl?: string;
  genre?: string;
}

export const gameService = {
  // Busca a lista completa de jogos
  async getAll(): Promise<Game[]> {
    const response = await api.get<Game[]>('/api/games');
    return response.data;
  },

  // Busca um jogo específico
  async getById(id: string | number): Promise<Game> {
    const response = await api.get<Game>(`/api/games/${id}`);
    return response.data;
  }
};