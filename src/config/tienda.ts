// ============================================================
// Datos de contacto de la tienda física en un solo lugar:
// teléfono, WhatsApp, dirección y horario. Los usan el header,
// la barra inferior móvil, el footer y los llamados a ayuda.
// ============================================================
import { WHATSAPP_NUMERO } from './firebase';

export const DIRECCION_TIENDA = 'Teniente Merino 500, Puerto Aysén';
export const HORARIO_CORTO = 'Lun a Vie 9:00–18:30 · Sáb 9:30–13:30';
export const CORREO_VENTAS = 'lacasadelamotosierraaysenspa@gmail.com';

/** Número legible: 56987568465 → +56 9 8756 8465 */
export const TELEFONO_VISIBLE = WHATSAPP_NUMERO.replace(
  /^(\d{2})(\d)(\d{4})(\d{4})$/,
  '+$1 $2 $3 $4',
);

/** Enlace tel: para llamar con un toque desde el teléfono */
export const ENLACE_LLAMAR = `tel:+${WHATSAPP_NUMERO}`;

/** Enlace a WhatsApp con un mensaje ya escrito */
export function enlaceWhatsApp(mensaje = 'Hola, necesito ayuda con un repuesto'): string {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;
}
