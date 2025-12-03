import { useState, useEffect, type MouseEvent } from 'react';
import { wishlistService } from '../api/wishlist';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface WishlistButtonProps {
  gameId: number;
  className?: string;
}

export function WishlistButton({ gameId, className }: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      wishlistService.checkStatus(gameId).then(status => setIsWishlisted(status));
    }
  }, [gameId, isAuthenticated]);

  async function handleToggle(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();

    if (!isAuthenticated) {
      alert("Faça login para adicionar à lista de desejos!");
      navigate('/login');
      return;
    }


    const previousState = isWishlisted;
    setIsWishlisted(!previousState); 
    setLoading(true);

    try {
      const result = await wishlistService.toggle(gameId);
  
      setIsWishlisted(result.action === 'added');
    } catch (error) {

      setIsWishlisted(previousState);
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
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'transform 0.2s',
      }}
      title={isWishlisted ? "Remover" : "Adicionar"}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        
        stroke={isWishlisted ? "#5241b2" : "white"} 
        
        fill={isWishlisted ? "#5241b2" : "none"}

        style={{
          transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)", 
          
          transform: isWishlisted ? "scale(1.2)" : "scale(1)" 
        }}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    </button>
  );
}