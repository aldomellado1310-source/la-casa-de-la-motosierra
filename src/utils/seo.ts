// ============================================================
// SEO para SPA: título, description y JSON-LD por página.
// Se aplica en el cliente (suficiente para Google, que ejecuta
// JS); para otros crawlers considerar prerender en el futuro.
// ============================================================
import { useEffect } from 'react';

const SUFIJO = ' · La Casa de la Motosierra';
const ID_JSONLD = 'seo-jsonld';
/** Dominio canónico (placeholder hasta confirmar el definitivo) */
const DOMINIO = 'https://lacasadelamotosierra.cl';

interface OpcionesSeo {
  /** Título de la pestaña (se agrega el sufijo de marca) */
  titulo: string;
  descripcion: string;
  /** Imagen para compartir (og:image); ruta relativa o absoluta */
  imagen?: string;
  /** Datos estructurados schema.org (ej: Product) */
  jsonLd?: Record<string, unknown>;
}

/** Crea o actualiza un <meta> del head */
function fijarMeta(attr: 'name' | 'property', clave: string, contenido: string): void {
  let meta = document.querySelector<HTMLMetaElement>(`meta[${attr}="${clave}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attr, clave);
    document.head.appendChild(meta);
  }
  meta.content = contenido;
}

/**
 * Aplica metadatos de la página: título, description, Open Graph
 * (título/descripción/URL/imagen reales al compartir en redes),
 * canonical y JSON-LD (restaurado al desmontar).
 */
export function useSeo({ titulo, descripcion, imagen, jsonLd }: OpcionesSeo): void {
  // Se serializa para que la dependencia sea estable entre renders
  const json = jsonLd ? JSON.stringify(jsonLd) : '';

  useEffect(() => {
    const tituloCompleto = `${titulo}${SUFIJO}`;
    const urlCanonica = `${DOMINIO}${window.location.pathname}`;
    document.title = tituloCompleto;

    fijarMeta('name', 'description', descripcion);
    fijarMeta('property', 'og:title', tituloCompleto);
    fijarMeta('property', 'og:description', descripcion);
    fijarMeta('property', 'og:url', urlCanonica);
    if (imagen) {
      const absoluta = imagen.startsWith('http') ? imagen : `${DOMINIO}${imagen}`;
      fijarMeta('property', 'og:image', absoluta);
      fijarMeta('name', 'twitter:image', absoluta);
    }

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = urlCanonica;

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
  }, [titulo, descripcion, imagen, json]);
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
