import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { PrivateRoute } from './components/PrivateRoute';
import { Login } from './pages/Login'; // Pagina de Login
import { Home } from './pages/Home'; // Pagina Inicial
import { Register } from './pages/Register'; // Pagina de Registro de Usuario
import { Checkout } from './pages/Checkout'; // Pagina de Checkout
import { MyGames } from './pages/myGames'; // Pagina de Biblioteca de Jogos
import { GameDetails } from './pages/GameDetails'; // Pagina de Detalhes do Jogo

function App() {
  return (
    <AuthProvider>
      <CartProvider> 
        <BrowserRouter>
          <Routes>
              {/* Rotas Públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/game/:id" element={<GameDetails />} />
              {/* Rotas Protegidas */}
            <Route element={<PrivateRoute />}>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/my-games" element={<MyGames />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;