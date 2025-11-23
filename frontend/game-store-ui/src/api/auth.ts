import api from './config';

// --- INTERFACES (Essenciais para o TypeScript) ---
export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
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
  email: string;
  password: string;
}

// --- SERVIÇO ---
export const authService = {
  async login(data: LoginPayload): Promise<AuthResponse> {
    // Ajuste a rota conforme seu backend (ex: /api/users/login)
    const response = await api.post<AuthResponse>('/api/users/login', data);
    
    if (response.data.token) {
      localStorage.setItem('@GameStore:token', response.data.token);
      localStorage.setItem('@GameStore:user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async register(data: RegisterPayload): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/users', data);
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('@GameStore:token');
    localStorage.removeItem('@GameStore:user');
    window.location.href = '/login';
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