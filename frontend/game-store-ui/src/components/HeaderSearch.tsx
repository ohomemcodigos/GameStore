import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Certifique-se de importar o tipo Game corretamente do seu caminho
import { type Game } from "../api/game"; 

export function HeaderSearch({ games }: { games: Game[] }) {
  const [text, setText] = useState("");
  const navigate = useNavigate();

  // Filtra jogos baseado no texto (limite de 5 resultados para não poluir)
  const suggestions = text.length > 0 
    ? games.filter(g => g.title.toLowerCase().includes(text.toLowerCase())).slice(0, 5) 
    : [];

  // Formata preço
  const formatPrice = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div style={{ position: 'relative', width: '400px' }}>
      
      {/* --- INPUT DA BARRA --- */}
      <div style={{
          marginLeft: 40 ,
          display: 'flex',
          alignItems: 'center',
          borderRadius: '20px',
          padding: '8px 15px',
      }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          
          <input 
              type="text" 
              placeholder="Buscar jogos..." 
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'white',
                  marginLeft: '10px',
                  width: '100%',
                  outline: 'none',
                  fontSize: '0.95rem'
              }}
          />
      </div>

      {/* --- SUGESTÕES EM CASCATA (DROPDOWN) --- */}
      {suggestions.length > 0 && (
        <div style={{
          position: 'absolute', // Isso faz flutuar por cima
          top: '115%',          // Logo abaixo da barra
          left: 0,
          width: '100%',
          backgroundColor: "rgba(26, 26, 26, 0.9)", // Fundo meio transparente
          backdropFilter: "blur(10px)", // Efeito de vidro borrado  
          borderRadius: '8px',
          border: '0px solid #444',
          boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
          zIndex: 1000,         // Garante que fique na frente de tudo
          overflow: 'hidden'
        }}>
          {suggestions.map(game => (
            <div 
              key={game.id}
              onClick={() => {
                navigate(`/game/${game.id}`);
                setText(""); // Limpa a busca e fecha a cascata ao clicar
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                cursor: 'pointer',
                borderBottom: '1px solid #333',
                backdropFilter: "blur(2px)", // Efeito de vidro borrado  
              }}
              // Pequeno truque para hover inline
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(99, 99, 99, .7)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <img 
                src={game.coverUrl} 
                alt={game.title} 
                style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '4px', marginRight: '15px' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem' }}>{game.title}</span>
                <span style={{ color: '#4ade80', fontSize: '0.85rem' }}>
                   {formatPrice(Number(game.price))}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}