// src/components/ReviewSection.tsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { reviewService } from '../api/reviewservice';

interface Review {
  id: number;
  rating: number;
  comment: string;
  userNickname: string;
  createdAt: string;
}

const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span 
        key={i} 
        style={{ 
          color: i <= rating ? '#ffc107' : '#555', 
          fontSize: '1.2rem', 
          marginRight: '2px' 
        }}
      >
        ★
      </span>
    );
  }
  return stars;
};

interface ReviewSectionProps {
  gameId: number;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ gameId }) => {
  const { isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadReviews = async () => {
    setLoadingReviews(true);
    try {
      const data = await reviewService.getByGameId(String(gameId));
      setReviews(data);
    } catch (error) {
      console.error("Erro ao carregar avaliações:", error);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [gameId]);

  const averageRating = reviews.length 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert("Faça login para avaliar.");
      return;
    }
    
    if (newComment.trim().length < 10) {
      alert("O comentário deve ter pelo menos 10 caracteres.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await reviewService.create({
        gameId,
        rating: newRating,
        comment: newComment.trim(),
      });

      alert("Avaliação enviada com sucesso!");
      setNewComment('');
      setNewRating(5);
      loadReviews();

    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      alert("Falha ao salvar a avaliação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };
    
  if (loadingReviews) {
    return <div style={{ marginTop: '50px', color: '#aaa' }}>Carregando avaliações...</div>;
  }

  return (
    <div style={{ marginTop: '50px' }}>
      <h2 style={{ fontSize: '2rem', borderBottom: '2px solid #333', paddingBottom: '10px' }}>
        Avaliações de Clientes
      </h2>

      {/* Resumo da Avaliação */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px', background: '#252525', padding: '15px', borderRadius: '8px' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1rem', color: '#aaa' }}>Média Geral</p>
          <span style={{ fontSize: '3rem', fontWeight: 'bold', color: '#4ade80' }}>
            {averageRating}
          </span>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', margin: '5px 0' }}>
            {renderStars(parseFloat(averageRating))}
          </div>
          <p style={{ color: '#aaa' }}>Baseado em {reviews.length} avaliações</p>
        </div>
      </div>

      {/* Formulário de Nova Avaliação */}
      <div style={{ marginBottom: '40px', padding: '20px', border: '1px solid #333', borderRadius: '8px' }}>
        <h3 style={{ marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>
          Deixe sua avaliação
        </h3>
        {!isAuthenticated ? (
          <p style={{ color: '#e74c3c' }}>Faça login para poder avaliar este jogo.</p>
        ) : (
          <form onSubmit={handleSubmitReview}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#aaa' }}>
                Sua Nota:
              </label>
              <select 
                value={newRating} 
                onChange={(e) => setNewRating(Number(e.target.value))}
                disabled={isSubmitting}
                style={{ 
                  padding: '8px', 
                  background: '#1a1a1a', 
                  color: 'white', 
                  border: '1px solid #333', 
                  borderRadius: '4px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.6 : 1
                }}
              >
                {[5, 4, 3, 2, 1].map(r => (
                  <option key={r} value={r}>{r} Estrela(s)</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#aaa' }}>
                Comentário:
              </label>
              <textarea 
                value={newComment} 
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
                required
                disabled={isSubmitting}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  background: '#1a1a1a', 
                  color: 'white', 
                  border: '1px solid #333', 
                  borderRadius: '4px', 
                  resize: 'vertical',
                  cursor: isSubmitting ? 'not-allowed' : 'text',
                  opacity: isSubmitting ? 0.6 : 1
                }}
                placeholder="O que você achou do jogo?"
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              style={{ 
                padding: '10px 20px', 
                background: isSubmitting ? '#1e8449' : '#27ae60', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                fontWeight: 'bold', 
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1
              }}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
            </button>
          </form>
        )}
      </div>

      {/* Lista de Avaliações */}
      {reviews.length > 0 ? (
        reviews.map(review => (
          <div 
            key={review.id} 
            style={{ 
              border: '1px solid #333', 
              padding: '15px', 
              borderRadius: '8px', 
              marginBottom: '15px', 
              background: '#222' 
            }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              borderBottom: '1px solid #333', 
              paddingBottom: '8px', 
              marginBottom: '8px' 
            }}>
              <div style={{ fontWeight: 'bold', color: '#aaa' }}>
                {review.userNickname}
              </div>
              <div>
                {renderStars(review.rating)}
              </div>
            </div>
            <p style={{ color: '#ccc', lineHeight: 1.5, fontSize: '0.95rem' }}>
              {review.comment}
            </p>
            <p style={{ fontSize: '0.8rem', color: '#777', textAlign: 'right', marginTop: '10px' }}>
              {new Date(review.createdAt).toLocaleDateString('pt-BR')}
            </p>
          </div>
        ))
      ) : (
        <p style={{ color: '#aaa' }}>Seja o primeiro a avaliar este jogo!</p>
      )}
    </div>
  );
};

export default ReviewSection;