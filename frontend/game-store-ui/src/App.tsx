import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'sonner';

// Componentes de Proteção
import { PrivateRoute } from './components/PrivateRoute';
import { AdminRoute } from './components/AdminRoute';

// Páginas
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { Checkout } from './pages/Checkout';
import { MyGames } from './pages/myGames';
import { GameDetails } from './pages/GameDetails';
import { AdminDashboard } from './pages/admin/Dashboard';
import { Wishlist } from './pages/Wishlist';
import { Profile } from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <CartProvider> 
        <BrowserRouter>
          
          {/* Notificações */}
          <Toaster richColors position="top-center" duration={3000} />

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