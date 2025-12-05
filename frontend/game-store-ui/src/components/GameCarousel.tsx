import { useState } from "react";
import { ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";
import { type Game } from "../api/game";

// Helper:
// Extrai o ID do YouTube de qualquer link
const getYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Formato interno dos itens do carrossel
type CarouselItem = {
  type: 'video' | 'image'; // Formatos suportados
  url: string;
  thumb?: string;
};

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80",
  "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80"
];

export function GameCarousel({ game }: { game: Game }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // --- MONTAGEM DA LISTA DE MÍDIA ---
  const items: CarouselItem[] = [];
  
  // Garante que gallery é um array
  const gallery = game.gallery || [];

  // Filtra itens onde o type é 'VIDEO'
  const videos = gallery.filter(m => m.type === 'VIDEO');
  
  videos.forEach(v => {
    const videoId = getYouTubeId(v.url);
    if (videoId) {
      items.push({
        type: 'video',
        url: `https://www.youtube.com/embed/${videoId}`,
        thumb: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      });
    }
  });

  // Coloca a capa do jogo como a primeira imagem
  if (game.coverUrl) {
    items.push({ type: 'image', url: game.coverUrl });
  }

  // Procura imagens na galeria
  const images = gallery.filter(m => m.type === 'IMAGE');
  
  if (images.length > 0) {
    // Se tiver imagens no banco, usa elas
    images.forEach(img => items.push({ type: 'image', url: img.url }));
  } else {
    // Se não, usa os Placeholders para não ficar vazio
    PLACEHOLDER_IMAGES.forEach(url => items.push({ type: 'image', url }));
  }

  // --- NAVEGAÇÃO ---
  const handlePrev = () => setSelectedIndex(prev => prev === 0 ? items.length - 1 : prev - 1);
  const handleNext = () => setSelectedIndex(prev => prev === items.length - 1 ? 0 : prev + 1);

  const currentItem = items[selectedIndex];
  
  // Segurança caso não haja nada para mostrar
  if (!currentItem) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      
      {/* --- PLAYER PRINCIPAL --- */}
      <div style={{ position: 'relative', width: '100%', height: '300px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #333', background: '#000' }}>
        
        {currentItem.type === 'video' ? (
          <iframe 
            width="100%" height="100%" 
            src={currentItem.url} 
            title="Video" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        ) : (
          <img src={currentItem.url} alt="Game media" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}

        {/* Setas de navegação */}
        {items.length > 1 && (
          <>
             <button onClick={handlePrev} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}><ChevronLeft size={20}/></button>
             <button onClick={handleNext} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}><ChevronRight size={20}/></button>
          </>
        )}
      </div>

      {/* --- THUMBNAILS --- */}
      {items.length > 1 && (
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 5 }}>
          {items.map((item, idx) => (
            <div key={idx} onClick={() => setSelectedIndex(idx)} 
              style={{ 
                minWidth: 80, width: 80, height: 50, borderRadius: 4, overflow: 'hidden', cursor: 'pointer', position: 'relative', 
                border: selectedIndex === idx ? '2px solid #5241b2' : '2px solid transparent', 
                opacity: selectedIndex === idx ? 1 : 0.6 
              }}
            >
              <img src={item.type === 'video' ? item.thumb : item.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {/* Ícone de Play sobre a thumb de vídeo */}
              {item.type === 'video' && (
                <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)'}}>
                  <PlayCircle size={20} color="white"/>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}