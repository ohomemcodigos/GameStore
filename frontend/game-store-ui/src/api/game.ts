import api from './config';

// Interface de retorno do Prisma
export interface Game {
  id:           string | number;
  title:        string;
  slug:         string;
  description?: string;
  
  genre:       string[];
  platforms:   string[];
  ageRating:   string;

  developer:   string[];
  publisher:   string[]; 
  
  releaseDate: string;
  price:       string | number;
  discountPrice?: string | number;
  coverUrl?:   string;
  isFeatured:  boolean;
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