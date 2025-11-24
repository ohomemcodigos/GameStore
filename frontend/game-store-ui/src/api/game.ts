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
  gallery?: { id: number; type: string; url: string }[];

  isFeatured:  boolean;
}

export type CreateGameDTO = Omit<Game, 'id' | 'gallery'>;

export const gameService = {
  // Busca a lista completa de jogos
  async getAll(): Promise<Game[]> {
    const response = await api.get<Game[]>('/api/games');
    return response.data;
  },

  // Busca jogo por ID
  async getById(id: string | number): Promise<Game> {
    const response = await api.get<Game>(`/api/games/${id}`);
    return response.data;
  },

  // Criar (Admin)
  async create(data: CreateGameDTO): Promise<Game> {
    const response = await api.post<Game>('/api/games', data);
    return response.data;
  },

  // Atualizar (Admin)
  async update(id: number, data: Partial<CreateGameDTO>): Promise<Game> {
    const response = await api.put<Game>(`/api/games/${id}`, data);
    return response.data;
  },

  // Deletar (Admin)
  async delete(id: number): Promise<void> {
    await api.delete(`/api/games/${id}`);
  }
};