import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { gameService, type Game, type CreateGameDTO } from '../../api/game';

interface GameFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  gameToEdit?: Game | null;
}

export function GameFormModal({ isOpen, onClose, onSuccess, gameToEdit }: GameFormModalProps) {
  const [loading, setLoading] = useState(false);

  // Estados do Formulário
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [genre, setGenre] = useState('');
  const [platforms, setPlatforms] = useState('');
  const [developer, setDeveloper] = useState('');
  const [publisher, setPublisher] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [ageRating, setAgeRating] = useState('L');

  useEffect(() => {
    if (gameToEdit) {
      setTitle(gameToEdit.title);
      setPrice(String(gameToEdit.price));
      setGenre(Array.isArray(gameToEdit.genre) ? gameToEdit.genre.join(', ') : String(gameToEdit.genre || ''));
      setPlatforms(Array.isArray(gameToEdit.platforms) ? gameToEdit.platforms.join(', ') : String(gameToEdit.platforms || ''));
      setDeveloper(Array.isArray(gameToEdit.developer) ? gameToEdit.developer.join(', ') : String(gameToEdit.developer || ''));
      setPublisher(Array.isArray(gameToEdit.publisher) ? gameToEdit.publisher.join(', ') : String(gameToEdit.publisher || ''));
      
      const dateVal = gameToEdit.releaseDate ? new Date(gameToEdit.releaseDate) : new Date();
      setReleaseDate(dateVal.toISOString().split('T')[0]);
      
      setDescription(gameToEdit.description || '');
      setCoverUrl(gameToEdit.coverUrl || '');
      setAgeRating(gameToEdit.ageRating || 'L');
    } else {
      setTitle('');
      setPrice('');
      setGenre('');
      setPlatforms('');
      setDeveloper('');
      setPublisher('');
      setReleaseDate('');
      setDescription('');
      setCoverUrl('');
      setAgeRating('L');
    }
  }, [gameToEdit, isOpen]);

  // --- FUNÇÃO PARA CONVERTER IMAGEM EM TEXTO (BASE64) ---
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // O resultado é uma string gigante que representa a imagem
        setCoverUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- VALIDAÇÃO DE PREÇO ---
  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (val < 0) {
        setPrice("0"); // Impede negativo
    } else {
        setPrice(e.target.value);
    }
  };

  if (!isOpen) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const gameData: CreateGameDTO = {
        title,
        slug: title.toLowerCase().replace(/\s+/g, '-'),
        price: Number(price),
        genre: genre.split(',').map(s => s.trim()),
        platforms: platforms.split(',').map(s => s.trim()),
        developer: developer.split(',').map(s => s.trim()),
        publisher: publisher.split(',').map(s => s.trim()),
        releaseDate,
        description,
        coverUrl,
        ageRating,
        isFeatured: false
      };

      if (gameToEdit) {
        await gameService.update(Number(gameToEdit.id), gameData);
        alert('Jogo atualizado com sucesso!');
      } else {
        await gameService.create(gameData);
        alert('Jogo criado com sucesso!');
      }

      onSuccess();
      onClose();

    } catch (error) {
      console.error(error);
      alert('Erro ao salvar. Se usou uma imagem muito grande, tente uma URL externa.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#1e1e1e', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '700px',
        maxHeight: '90vh', overflowY: 'auto', color: 'white', position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '1.5rem', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
            {gameToEdit ? 'Editar Jogo' : 'Novo Jogo'}
        </h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          
          {/* Título e Preço */}
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ flex: 2 }}>
                <label style={labelStyle}>Título</label>
                <input required placeholder="" value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
                <label style={labelStyle}>Preço (R$)</label>
                <input 
                    required 
                    type="number" 
                    min="0" // Impede setinha para baixo ir para negativo
                    step="0.01" 
                    value={price} 
                    onChange={handlePriceChange} // Usa nossa função de validação
                    style={inputStyle} 
                />
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label style={labelStyle}>Descrição</label>
            <textarea 
                placeholder="Sinopse do jogo..." 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                style={{ ...inputStyle, minHeight: '100px', resize: 'vertical', fontFamily: 'sans-serif' }} 
            />
          </div>

          {/* Gêneros e Plataformas */}
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ flex: 1 }}>
                <label style={labelStyle}>Gêneros (separar por vírgula)</label>
                <input required placeholder="" value={genre} onChange={e => setGenre(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
                <label style={labelStyle}>Plataformas (separar por vírgula)</label>
                <input required placeholder="" value={platforms} onChange={e => setPlatforms(e.target.value)} style={inputStyle} />
            </div>
          </div>
          
          {/* Dev e Publisher */}
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ flex: 1 }}>
                <label style={labelStyle}>Desenvolvedor</label>
                <input required placeholder="" value={developer} onChange={e => setDeveloper(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
                <label style={labelStyle}>Publicadora</label>
                <input required placeholder="" value={publisher} onChange={e => setPublisher(e.target.value)} style={inputStyle} />
            </div>
          </div>

          {/* Data e Classificação */}
          <div style={{ display: 'flex', gap: '2rem' }}>
            <div style={{ flex: 1 }}>
                <label style={labelStyle}>Data de Lançamento</label>
                <input required type="date" value={releaseDate} onChange={e => setReleaseDate(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
                <label style={labelStyle}>Classificação Indicativa</label>
                <select value={ageRating} onChange={e => setAgeRating(e.target.value)} style={inputStyle}>
                    <option value="L">Livre (L)</option>
                    <option value="10">10 Anos</option>
                    <option value="12">12 Anos</option>
                    <option value="14">14 Anos</option>
                    <option value="16">16 Anos</option>
                    <option value="18">18 Anos</option>
                </select>
            </div>
          </div>

          {/* URL ou Upload */}
          <div>
            <label style={labelStyle}>Capa do Jogo</label>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input 
                    placeholder="Cole a URL da imagem aqui..." 
                    value={coverUrl} 
                    onChange={e => setCoverUrl(e.target.value)} 
                    style={{ ...inputStyle, flex: 1 }} 
                />
                {/* Botão de Upload; Converte para Base64 */}
                {/* Solução temporária */}
                <label style={{ 
                    background: '#444', color: 'white', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center'
                }}>
                    📁 Upload
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                </label>
            </div>

            {/* Preview da Imagem */}
            {coverUrl && (
                <div style={{ width: '100px', height: '140px', border: '1px solid #444', borderRadius: '4px', overflow: 'hidden', marginTop: '5px' }}>
                    <img src={coverUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
            )}
          </div>

          {/* Botões de Ação */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem', borderTop: '1px solid #333', paddingTop: '1rem' }}>
            <button type="button" onClick={onClose} style={{ background: 'transparent', border: '1px solid #555', color: '#ccc', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
            <button type="submit" disabled={loading} style={{ background: '#27ae60', border: 'none', color: 'white', padding: '10px 30px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              {loading ? 'Salvando...' : 'Salvar Jogo'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

// Estilos reutilizáveis
const inputStyle = {
  width: '100%', 
  padding: '12px', 
  borderRadius: '6px', 
  border: '1px solid #444', 
  backgroundColor: '#2a2a2a', 
  color: 'white',
  fontSize: '0.95rem',
  boxSizing: 'border-box' as const // Corrige problema de largura quebrando
};

const labelStyle = {
    display: 'block', 
    marginBottom: '5px', 
    fontSize: '0.85rem', 
    color: '#aaa',
    fontWeight: 'bold'
};