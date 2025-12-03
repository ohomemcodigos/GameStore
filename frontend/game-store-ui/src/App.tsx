import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Componentes de Proteção
import { PrivateRoute } from './components/PrivateRoute';
import { AdminRoute } from './components/AdminRoute';

// Página
import { Login } from './pages/Login'; // de Login
import { Home } from './pages/Home'; // da Home
import { Register } from './pages/Register'; // de Registro
import { Checkout } from './pages/Checkout'; // de Compras
import { MyGames } from './pages/myGames'; // da Biblioteca
import { GameDetails } from './pages/GameDetails'; // de Detalhes do Jogo
import { AdminDashboard } from './pages/admin/Dashboard'; // do Painel Admin
import { Wishlist } from './pages/Wishlist'; // da Wishlist
import { Profile } from './pages/Profile'; // do Perfil do Usuário
import barra from './components/barra';





function App() {
  return (
    <AuthProvider>
      <CartProvider> 
        <BrowserRouter>
          <Routes>
            
            {/* --- ROTAS PÚBLICAS --- */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/game/:id" element={<GameDetails />} />
            
            {/* --- ROTAS PROTEGIDAS --- */}
            <Route element={<PrivateRoute />}>
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/my-games" element={<MyGames />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* --- ROTAS DE ADMIN --- */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;