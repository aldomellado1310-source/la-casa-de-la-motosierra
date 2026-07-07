// Galería de fotos de producto con zoom al pasar el mouse
// y miniaturas cuando hay varias imágenes.
import { useRef, useState } from 'react';

export default function GaleriaFotos({ fotos, alt }: { fotos: string[]; alt: string }) {
  const [actual, setActual] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origen, setOrigen] = useState('50% 50%');
  const contenedor = useRef<HTMLDivElement>(null);

  // Calcula el punto de origen del zoom según la posición del cursor
  const moverMouse = (e: React.MouseEvent) => {
    const rect = contenedor.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigen(`${x}% ${y}%`);
  };

  const foto = fotos[actual] ?? fotos[0];

  return (
    <div>
      <div
        ref={contenedor}
        className="relative aspect-square cursor-zoom-in overflow-hidden rounded-xl border border-borde bg-white"
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={moverMouse}
      >
        <img
          src={foto}
          alt={alt}
          className="h-full w-full object-cover transition-transform duration-150"
          style={{
            transform: zoom ? 'scale(2)' : 'scale(1)',
            transformOrigin: origen,
          }}
        />
        {zoom && (
          <span className="pointer-events-none absolute bottom-2 left-2 rounded bg-grafito/70 px-2 py-0.5 text-[11px] text-white">
            Zoom activo
          </span>
        )}
      </div>

      {/* Miniaturas cuando hay más de una foto */}
      {fotos.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {fotos.map((f, i) => (
            <button
              key={f}
              onClick={() => setActual(i)}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                i === actual ? 'border-naranja' : 'border-borde hover:border-verde'
              }`}
              aria-label={`Foto ${i + 1}`}
            >
              <img src={f} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
