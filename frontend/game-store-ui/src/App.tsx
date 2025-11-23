import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { PrivateRoute } from './components/PrivateRoute';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Register } from './pages/Register';

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
              {/* Rotas Protegidas */}
            <Route element={<PrivateRoute />}>
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;