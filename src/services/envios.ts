// ============================================================
// Estimación de costos de envío ANTES de pagar.
// Tarifas referenciales por courier y zona — el admin puede
// ajustarlas aquí o migrarlas a Firestore/API del courier.
// ============================================================
import type { MetodoEnvio } from '../types';

export interface OpcionEnvio {
  metodo: MetodoEnvio;
  nombre: string;
  descripcion: string;
  costo: number;          // CLP; 0 = gratis
  plazoEstimado: string;  // texto legible
}

/** Regiones de Chile para el selector de dirección */
export const REGIONES_CHILE = [
  'Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama', 'Coquimbo',
  'Valparaíso', 'Metropolitana', "O'Higgins", 'Maule', 'Ñuble', 'Biobío',
  'La Araucanía', 'Los Ríos', 'Los Lagos', 'Aysén', 'Magallanes',
] as const;

/** Zonas tarifarias: local (Aysén), austral (Los Lagos/Magallanes), resto de Chile */
function zonaTarifaria(region: string): 'local' | 'austral' | 'nacional' {
  if (region === 'Aysén') return 'local';
  if (region === 'Los Lagos' || region === 'Magallanes') return 'austral';
  return 'nacional';
}

// Tarifas base referenciales por courier y zona (CLP)
const TARIFAS: Record<Exclude<MetodoEnvio, 'retiro_tienda'>, Record<'local' | 'austral' | 'nacional', number>> = {
  starken:     { local: 4990, austral: 8990,  nacional: 12990 },
  chilexpress: { local: 5490, austral: 9990,  nacional: 13990 },
  bluexpress:  { local: 4490, austral: 8490,  nacional: 11990 },
};

const PLAZOS: Record<'local' | 'austral' | 'nacional', string> = {
  local: '1 a 3 días hábiles',
  austral: '3 a 6 días hábiles',
  nacional: '5 a 10 días hábiles',
};

/** Recargo por kilo adicional sobre los 3 kg incluidos */
const RECARGO_KG = 1500;
const KG_INCLUIDOS = 3;

/**
 * Estimación rápida para mostrar en la ficha de producto o el carrito,
 * antes de conocer la región de destino: el costo con despacho más
 * barato entre todas las zonas (para no subestimar el "desde" en
 * zonas más caras se usa el mínimo real, que corresponde a Aysén).
 * El costo exacto por región se calcula recién en el checkout.
 */
export function envioDesde(pesoKg = 1): number {
  const extra = Math.max(0, Math.ceil(pesoKg - KG_INCLUIDOS)) * RECARGO_KG;
  const minimo = Math.min(...Object.values(TARIFAS).map((t) => t.local));
  return minimo + extra;
}

/**
 * Calcula las opciones de envío para una región y peso estimado.
 * El costo se muestra ANTES de pagar (mejora vs. "envío por pagar").
 */
export function calcularOpcionesEnvio(region: string, pesoKg = 1): OpcionEnvio[] {
  const zona = zonaTarifaria(region);
  const extra = Math.max(0, Math.ceil(pesoKg - KG_INCLUIDOS)) * RECARGO_KG;

  const opciones: OpcionEnvio[] = [
    {
      metodo: 'retiro_tienda',
      nombre: 'Retiro en tienda — Puerto Aysén',
      descripcion: 'Teniente Merino 500, Puerto Aysén. Lun a Vie 9:00–18:30, Sáb 9:30–13:30.',
      costo: 0,
      plazoEstimado: 'Mismo día (con stock)',
    },
    {
      metodo: 'starken',
      nombre: 'Starken',
      descripcion: 'Despacho a domicilio o sucursal Starken.',
      costo: TARIFAS.starken[zona] + extra,
      plazoEstimado: PLAZOS[zona],
    },
    {
      metodo: 'chilexpress',
      nombre: 'Chilexpress',
      descripcion: 'Despacho a domicilio o punto Chilexpress.',
      costo: TARIFAS.chilexpress[zona] + extra,
      plazoEstimado: PLAZOS[zona],
    },
    {
      metodo: 'bluexpress',
      nombre: 'Blue Express',
      descripcion: 'Despacho a domicilio o punto Blue Express.',
      costo: TARIFAS.bluexpress[zona] + extra,
      plazoEstimado: PLAZOS[zona],
    },
  ];
  return opciones;
}
