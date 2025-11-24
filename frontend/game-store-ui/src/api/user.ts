import api from './config';
import { type User } from './auth';

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  nickname?: string;
  avatarUrl?: string;
  password?: string;
}

export const userService = {
  
  // Função para atualizar o perfil
  async updateProfile(userId: number, data: UpdateUserDTO): Promise<User> {
    // Envia os dados para a rota de update do backend
    const response = await api.put<User>(`/api/users/${userId}`, data);
    
    // Atualiza o usuário armazenado no localStorage
    localStorage.setItem('@GameStore:user', JSON.stringify(response.data));
    
    return response.data;
  }
};