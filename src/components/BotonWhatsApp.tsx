// Botón flotante de WhatsApp — atención directa y cercana
import { WHATSAPP_NUMERO } from '../config/firebase';
import { IconoWhatsApp } from './Iconos';

export default function BotonWhatsApp() {
  const mensaje = encodeURIComponent('Hola, necesito ayuda con un repuesto 🌲');
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMERO}?text=${mensaje}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110"
    >
      <IconoWhatsApp className="h-8 w-8" />
    </a>
  );
}
