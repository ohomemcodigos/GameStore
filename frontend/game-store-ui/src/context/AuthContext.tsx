import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService, type User, type LoginPayload } from '../api/auth';

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (data: LoginPayload) => Promise<void>;
  signOut: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStorageData = () => {
      const storedUser = authService.getCurrentUser();
      const token = localStorage.getItem('@GameStore:token');

      if (storedUser && token) {
        setUser(storedUser);
      }
      setLoading(false);
    };

    loadStorageData();
  }, []);

  async function signIn(data: LoginPayload) {
    const response = await authService.login(data);
    setUser(response.user);
  }

  function signOut() {
    authService.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
}