import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type Game } from "../api/game";

export function GameCarousel({ game }: { game: Game }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // COMO SEU BANCO SÓ TEM 1 FOTO, VAMOS SIMULAR UMA GALERIA
  // No futuro, você pode adicionar um campo 'screenshots: string[]' no seu banco
  const images = [
    game.coverUrl, // A capa oficial
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop", // Genérica 1
    "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop", // Genérica 2
    "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=2070&auto=format&fit=crop"  // Genérica 3
  ].filter(url => url); // Remove nulos caso não tenha capa

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      
      {/* --- IMAGEM GRANDE (PRINCIPAL) --- */}
      <div style={{ position: 'relative', width: '100%', height: '300px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #333' }}>
        <img 
          src={images[selectedIndex] as string} 
          alt="Screenshot" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Setas de Navegação */}
        <button 
          onClick={handlePrev}
          style={{
            position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.6)', border: 'none', color: 'white', borderRadius: '50%',
            width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
          }}
        >
          <ChevronLeft size={20} />
        </button>
        <button 
          onClick={handleNext}
          style={{
            position: 'absolute', right: '10px', top: '50%', transform: "translateY(-50%)",
            background: 'rgba(0,0,0,0.6)', border: 'none', color: 'white', borderRadius: '50%',
            width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
          }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* --- MINIATURAS (THUMBNAILS) --- */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '5px' }}>
        {images.map((img, idx) => (
          <div 
            key={idx}
            onClick={() => setSelectedIndex(idx)}
            style={{
              width: '80px',
              height: '50px',
              borderRadius: '4px',
              overflow: 'hidden',
              cursor: 'pointer',
              border: selectedIndex === idx ? '2px solid #5241b2' : '2px solid transparent', // Borda roxa na ativa
              opacity: selectedIndex === idx ? 1 : 0.6,
              transition: 'all 0.2s'
            }}
          >
            <img 
              src={img as string} 
              alt={`Thumb ${idx}`} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>

    </div>
  );
}