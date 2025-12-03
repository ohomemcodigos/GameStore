import React, { useState, useMemo, useEffect } from 'react';

interface Game {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  price: number;
}

const filterItems = (games: Game[], query: string): Game[] => {
  if (!query) {
    return games;
  }
  const lowerCaseQuery = query.toLowerCase();
  
  return games.filter(game => 
    game.title.toLowerCase().includes(lowerCaseQuery) ||
    game.description.toLowerCase().includes(lowerCaseQuery)
  );
};

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  // Busca os jogos da API
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/games');
        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error('Erro ao buscar jogos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const filteredGames = useMemo(() => {
    return filterItems(games, searchTerm);
  }, [searchTerm, games]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setTimeout(() => setIsFocused(false), 200);
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <input
        type="text"
        placeholder="Pesquisar jogos..."
        value={searchTerm}
        onChange={handleSearchChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={{ 
          padding: '5px', 
          width: '300px', 
          marginBottom: isFocused ? '0px' : '1px',
          borderRadius: '1px',
          border: isFocused ? '2px solid #5241b2' : '1px solid #ccc'
        }}
      />
      
      {isFocused && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '0',
          right: '0',
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          borderRadius: '4px',
          maxHeight: '300px',
          overflowY: 'auto',
          zIndex: 500,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{ padding: '15px' }}>
            <h4 style={{ margin: '0 0 10px 0' }}>Resultados: ({filteredGames.length})</h4>
            {filteredGames.map(game => (
              <div key={game.id} style={{ 
                border: '1px solid #ddd', 
                padding: '10px', 
                margin: '5px',
                borderRadius: '4px',
                backgroundColor: '#f9f9f9',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5626c5ff'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
              >
                <img src={game.coverUrl} alt={game.title} style={{ width: '100px', height: '150px', objectFit: 'cover', borderRadius: '4px' }} />
                <h4 style={{ margin: '5px 0' }}>{game.title}</h4>
                <p style={{ margin: '5px 0', fontSize: '0.9rem' }}>{game.description}</p>
                <p style={{ margin: '5px 0', fontWeight: 'bold', color: '#4ade80' }}>R$ {game.price}</p>
              </div>
            ))}

            {filteredGames.length === 0 && searchTerm && (
              <p style={{ padding: '10px', color: '#999' }}>Nenhum jogo encontrado para "{searchTerm}".</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;