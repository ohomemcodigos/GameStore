import { useState, useEffect, type MouseEvent } from 'react';
import { wishlistService } from '../api/wishlist';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface WishlistButtonProps {
  gameId: number;
  className?: string; // Para poder estilizar de fora se precisar
}

export function WishlistButton({ gameId, className }: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Verifica status ao carregar o botão
  useEffect(() => {
    if (isAuthenticated) {
      wishlistService.checkStatus(gameId).then(status => setIsWishlisted(status));
    }
  }, [gameId, isAuthenticated]);

  async function handleToggle(e: MouseEvent) {
    e.stopPropagation(); // Evita clicar no card do jogo sem querer
    e.preventDefault();

    if (!isAuthenticated) {
      alert("Faça login para adicionar à lista de desejos!");
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const result = await wishlistService.toggle(gameId);
      setIsWishlisted(result.action === 'added');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button 
      onClick={handleToggle}
      disabled={loading}
      className={className}
      style={{
        background: 'rgba(0,0,0,0.6)',
        border: 'none',
        borderRadius: '50%',
        width: '35px',
        height: '35px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        fontSize: '1.2rem',
        color: isWishlisted ? '#ff4757' : 'white' // Vermelho se curtido, Branco se não
      }}
      title={isWishlisted ? "Remover da Lista de Desejos" : "Adicionar à Lista de Desejos"}
    >
      {isWishlisted ? '❤️' : '🤍'} 
    </button>
  );
}