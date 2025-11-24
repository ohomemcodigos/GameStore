import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;

  // Se não tem usuário ou se o papel não for ADMIN, manda pra Home
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}