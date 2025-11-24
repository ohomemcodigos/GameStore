import api from './config';

// --- INTERFACES ---
export interface User {
  id: number;
  name: string;
  nickname?: string;
  email: string;
  role: 'ADMIN' | 'USER';
  avatarUrl?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  nickname: string;
  email: string;
  password: string;
}

// --- SERVIÇOS ---
export const authService = {
  async login(data: LoginPayload): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/users/login', data);
    
    if (response.data.token) {
      localStorage.setItem('@GameStore:token', response.data.token);
      localStorage.setItem('@GameStore:user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async register(data: RegisterPayload): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/users/register', data);
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('@GameStore:token');
    localStorage.removeItem('@GameStore:user');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('@GameStore:user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  }
};