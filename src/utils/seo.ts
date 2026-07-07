// ============================================================
// SEO para SPA: título, description y JSON-LD por página.
// Se aplica en el cliente (suficiente para Google, que ejecuta
// JS); para otros crawlers considerar prerender en el futuro.
// ============================================================
import { useEffect } from 'react';

const SUFIJO = ' · La Casa de la Motosierra';
const ID_JSONLD = 'seo-jsonld';

interface OpcionesSeo {
  /** Título de la pestaña (se agrega el sufijo de marca) */
  titulo: string;
  descripcion: string;
  /** Datos estructurados schema.org (ej: Product) */
  jsonLd?: Record<string, unknown>;
}

/** Aplica metadatos de la página; restaura el JSON-LD al desmontar */
export function useSeo({ titulo, descripcion, jsonLd }: OpcionesSeo): void {
  // Se serializa para que la dependencia sea estable entre renders
  const json = jsonLd ? JSON.stringify(jsonLd) : '';

  useEffect(() => {
    document.title = `${titulo}${SUFIJO}`;

    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = descripcion;

    // JSON-LD: un solo script gestionado por la página activa
    const previo = document.getElementById(ID_JSONLD);
    if (previo) previo.remove();
    if (json) {
      const script = document.createElement('script');
      script.id = ID_JSONLD;
      script.type = 'application/ld+json';
      script.textContent = json;
      document.head.appendChild(script);
    }
    return () => {
      document.getElementById(ID_JSONLD)?.remove();
    };
  }, [titulo, descripcion, json]);
}

/** Construye el JSON-LD schema.org/Product de una ficha */
export function jsonLdProducto(p: {
  nombre: string; descripcion: string; sku: string; fotos: string[];
  precio: number; precioOferta?: number; stock: number;
}): Record<string, unknown> {
  const precio = p.precioOferta && p.precioOferta < p.precio ? p.precioOferta : p.precio;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.nombre,
    description: p.descripcion,
    sku: p.sku,
    image: p.fotos,
    brand: { '@type': 'Brand', name: 'La Casa de la Motosierra' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'CLP',
      price: precio,
      availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };
}
