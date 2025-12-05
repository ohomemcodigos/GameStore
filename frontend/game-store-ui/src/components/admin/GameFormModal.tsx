import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { gameService, type Game } from '../../api/game';
import { Trash2, Plus, Star, Check, DollarSign, Percent } from 'lucide-react';

interface GameFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  gameToEdit?: Game | null;
}

interface LocalMediaItem {
  type: 'IMAGE' | 'VIDEO';
  url: string;
}

export function GameFormModal({ isOpen, onClose, onSuccess, gameToEdit }: GameFormModalProps) {
  const [loading, setLoading] = useState(false);

  // Estados
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [genre, setGenre] = useState('');
  const [platforms, setPlatforms] = useState('');
  const [developer, setDeveloper] = useState('');
  const [publisher, setPublisher] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [ageRating, setAgeRating] = useState('L');
  const [isFeatured, setIsFeatured] = useState(false);

  const [galleryItems, setGalleryItems] = useState<LocalMediaItem[]>([]);
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaType, setNewMediaType] = useState<'IMAGE' | 'VIDEO'>('IMAGE');

  useEffect(() => {
    if (gameToEdit) {
      setTitle(gameToEdit.title);
      setPrice(String(gameToEdit.price));
      setDiscountPrice(gameToEdit.discountPrice ? String(gameToEdit.discountPrice) : '');
      
      setGenre(Array.isArray(gameToEdit.genre) ? gameToEdit.genre.join(', ') : String(gameToEdit.genre || ''));
      setPlatforms(Array.isArray(gameToEdit.platforms) ? gameToEdit.platforms.join(', ') : String(gameToEdit.platforms || ''));
      setDeveloper(Array.isArray(gameToEdit.developer) ? gameToEdit.developer.join(', ') : String(gameToEdit.developer || ''));
      setPublisher(Array.isArray(gameToEdit.publisher) ? gameToEdit.publisher.join(', ') : String(gameToEdit.publisher || ''));
      
      const dateVal = gameToEdit.releaseDate ? new Date(gameToEdit.releaseDate) : new Date();
      setReleaseDate(dateVal.toISOString().split('T')[0]);
      
      setDescription(gameToEdit.description || '');
      setCoverUrl(gameToEdit.coverUrl || '');
      setAgeRating(gameToEdit.ageRating || 'L');
      setIsFeatured(gameToEdit.isFeatured || false);

      if (gameToEdit.gallery) {
        const formattedGallery = gameToEdit.gallery.map(item => ({
            type: item.type as 'IMAGE' | 'VIDEO',
            url: item.url
        }));
        setGalleryItems(formattedGallery);
      } else {
        setGalleryItems([]);
      }

    } else {
      // Reset para Novo Jogo
      setTitle('');
      setPrice('');
      setDiscountPrice(''); // Reset
      setGenre('');
      setPlatforms('');
      setDeveloper('');
      setPublisher('');
      setReleaseDate('');
      setDescription('');
      setCoverUrl('');
      setAgeRating('L');
      setIsFeatured(false);
      setGalleryItems([]);
    }
  }, [gameToEdit, isOpen]);

  // Funções Auxiliares
  const handleAddMedia = () => {
    if (!newMediaUrl) return alert("Cole uma URL primeiro!");
    setGalleryItems([...galleryItems, { type: newMediaType, url: newMediaUrl }]);
    setNewMediaUrl('');
  };

  const handleRemoveMedia = (indexToRemove: number) => {
    setGalleryItems(galleryItems.filter((_, idx) => idx !== indexToRemove));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCoverUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const discountPercentage = () => {
    const p = parseFloat(price);
    const d = parseFloat(discountPrice);
    if (p > 0 && d > 0 && d < p) {
        return Math.round(((p - d) / p) * 100);
    }
    return 0;
  };

  if (!isOpen) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // Validação básica
      const finalPrice = Number(price);
      const finalDiscount = discountPrice ? Number(discountPrice) : null;

      if (finalDiscount && finalDiscount >= finalPrice) {
        alert("O preço promocional deve ser MENOR que o preço original.");
        setLoading(false);
        return;
      }

      const gameData: any = {
        title,
        slug: title.toLowerCase().replace(/\s+/g, '-'),
        price: finalPrice,
        discountPrice: finalDiscount, // Envia null se estiver vazio
        genre: genre.split(',').map(s => s.trim()),
        platforms: platforms.split(',').map(s => s.trim()),
        developer: developer.split(',').map(s => s.trim()),
        publisher: publisher.split(',').map(s => s.trim()),
        releaseDate,
        description,
        coverUrl,
        ageRating,
        isFeatured,
        gallery: galleryItems 
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
      alert('Erro ao salvar.');
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
          
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ flex: 2 }}>
                <label style={labelStyle}>Título</label>
                <input required placeholder="" value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} />
            </div>
          </div>

          {/* PREÇO */}
          <div style={{ display: 'flex', gap: '1.5rem', background: '#252525', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <div style={{ flex: 1 }}>
                <label style={labelStyle}>Preço Original (R$)</label>
                <div style={{ position: 'relative' }}>
                    <DollarSign size={16} style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', color: '#888' }} />
                    <input required type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} style={{ ...inputStyle, paddingLeft: '35px' }} />
                </div>
            </div>
            
            <div style={{ flex: 1 }}>
                <label style={{ ...labelStyle, color: '#4ade80' }}>Preço Promocional (Opcional)</label>
                <div style={{ position: 'relative' }}>
                    <Percent size={16} style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', color: '#4ade80' }} />
                    <input 
                        type="number" min="0" step="0.01" 
                        value={discountPrice} 
                        onChange={e => setDiscountPrice(e.target.value)} 
                        placeholder="Deixe vazio se não houver"
                        style={{ ...inputStyle, paddingLeft: '35px', borderColor: discountPrice ? '#4ade80' : '#444' }} 
                    />
                </div>
                {/* Mostra a % de desconto se houver */}
                {discountPercentage() > 0 && (
                    <span style={{ fontSize: '0.8rem', color: '#4ade80', marginTop: '5px', display: 'block' }}>
                        Isso aplica <strong>{discountPercentage()}% de desconto</strong>
                    </span>
                )}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Descrição</label>
            <textarea placeholder="Sinopse do jogo..." value={description} onChange={e => setDescription(e.target.value)} 
                style={{ ...inputStyle, minHeight: '80px', resize: 'vertical', fontFamily: 'sans-serif' }} 
            />
          </div>

          {/* Dados Técnicos */}
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ flex: 1 }}>
                <label style={labelStyle}>Gêneros (separar por vírgula)</label>
                <input required value={genre} onChange={e => setGenre(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
                <label style={labelStyle}>Plataformas</label>
                <input required value={platforms} onChange={e => setPlatforms(e.target.value)} style={inputStyle} />
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ flex: 1 }}>
                <label style={labelStyle}>Desenvolvedor</label>
                <input required value={developer} onChange={e => setDeveloper(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
                <label style={labelStyle}>Publicadora</label>
                <input required value={publisher} onChange={e => setPublisher(e.target.value)} style={inputStyle} />
            </div>
          </div>

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

          {/* Destaque */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: '#252525', padding: '10px', borderRadius: '8px', border: '1px solid #333' }}>
            <div onClick={() => setIsFeatured(!isFeatured)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '4px', border: isFeatured ? 'none' : '2px solid #555', background: isFeatured ? '#f1c40f' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isFeatured && <Star size={16} color="#000" fill="#000" />}
                </div>
                <div>
                    <span style={{ display: 'block', fontWeight: 'bold', color: isFeatured ? '#f1c40f' : '#ccc' }}>Jogo em Destaque</span>
                    <span style={{ fontSize: '0.8rem', color: '#666' }}>Se marcado, aparecerá no carrossel da Home.</span>
                </div>
            </div>
          </div>

          {/* Capa */}
          <div style={{ borderTop: '1px solid #333', paddingTop: '15px' }}>
            <label style={labelStyle}>Capa Principal (Cover URL)</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                    <input placeholder="Cole a URL..." value={coverUrl} onChange={e => setCoverUrl(e.target.value)} style={inputStyle} />
                    <label style={{ marginTop: '5px', fontSize: '0.8rem', color: '#aaa', cursor: 'pointer', display: 'inline-block' }}>
                       ou clique aqui para enviar arquivo local
                       <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                    </label>
                </div>
                {coverUrl && (
                    <img src={coverUrl} alt="Preview" style={{ width: '60px', height: '90px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #555' }} />
                )}
            </div>
          </div>

          {/* Galeria */}
          <div style={{ borderTop: '1px solid #333', paddingTop: '15px' }}>
            <label style={{...labelStyle, color: '#a29bfe'}}>Galeria (Carrossel)</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <select value={newMediaType} onChange={e => setNewMediaType(e.target.value as 'IMAGE' | 'VIDEO')} style={{ ...inputStyle, width: '100px' }}>
                    <option value="IMAGE">Imagem</option>
                    <option value="VIDEO">Vídeo</option>
                </select>
                <input placeholder={newMediaType === 'VIDEO' ? "Link do YouTube..." : "URL da Imagem..."} value={newMediaUrl} onChange={e => setNewMediaUrl(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                <button type="button" onClick={handleAddMedia} style={{ background: '#5241b2', border: 'none', borderRadius: '6px', width: '45px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Plus size={20} />
                </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '150px', overflowY: 'auto', background: '#111', padding: '10px', borderRadius: '6px' }}>
                {galleryItems.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#2a2a2a', padding: '8px', borderRadius: '4px' }}>
                        <div style={{ width: '40px', height: '40px', overflow: 'hidden', borderRadius: '4px', background: '#000', flexShrink: 0 }}>
                            {item.type === 'IMAGE' ? <img src={item.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'red' }}>▶️</div>}
                        </div>
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: item.type === 'VIDEO' ? '#ff7675' : '#74b9ff' }}>{item.type === 'VIDEO' ? 'VÍDEO' : 'IMAGEM'}</div>
                            <div style={{ fontSize: '0.8rem', color: '#ccc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.url}</div>
                        </div>
                        <button type="button" onClick={() => handleRemoveMedia(idx)} style={{ background: 'transparent', border: 'none', color: '#ff5555', cursor: 'pointer' }}><Trash2 size={18} /></button>
                    </div>
                ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1rem', borderTop: '1px solid #333', paddingTop: '1rem' }}>
            <button type="button" onClick={onClose} style={{ background: 'transparent', border: '1px solid #555', color: '#ccc', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
            <button type="submit" disabled={loading} style={{ background: '#27ae60', border: 'none', color: 'white', padding: '10px 30px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {loading ? 'Salvando...' : <><Check size={18} /> Salvar Jogo</>}
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
  padding: '10px', 
  borderRadius: '6px', 
  border: '1px solid #444', 
  backgroundColor: '#2a2a2a', 
  color: 'white',
  fontSize: '0.9rem',
  boxSizing: 'border-box' as const
};

const labelStyle = {
    display: 'block', 
    marginBottom: '5px', 
    fontSize: '0.85rem', 
    color: '#aaa',
    fontWeight: 'bold'
};