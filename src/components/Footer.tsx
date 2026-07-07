// Footer carbón: contacto, enlaces, servicio técnico, medios de
// pago y lema del logo.
import { Link } from 'react-router-dom';
import { WHATSAPP_NUMERO } from '../config/firebase';
import LogoLCM from './LogoLCM';
import { IconoLlave, IconoPin, IconoReloj, IconoWhatsApp } from './Iconos';

export default function Footer() {
  return (
    <footer className="mt-16 bg-carbon text-white">
      {/* Franja de lema */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center">
          <p className="font-display text-xl font-semibold uppercase tracking-wide text-naranja sm:text-2xl">
            “Economía para la Gente de Aysén”
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* Identidad */}
        <div>
          <LogoLCM tono="claro" conBajada />
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            Repuestos, maquinaria forestal/agrícola y servicio técnico en el corazón de la
            Patagonia. Atención local, despacho a todo Chile.
          </p>
        </div>

        {/* Contacto */}
        <div>
          <h3 className="mb-3 font-display text-lg font-semibold uppercase tracking-wide">Contacto</h3>
          <ul className="space-y-2.5 text-sm text-white/80">
            <li className="flex items-start gap-2">
              <IconoPin className="mt-0.5 h-4 w-4 shrink-0 text-naranja" />
              Teniente Merino 500, Puerto Aysén
            </li>
            <li className="flex items-start gap-2">
              <IconoReloj className="mt-0.5 h-4 w-4 shrink-0 text-naranja" />
              Lun a Vie 9:00–18:30 · Sáb 9:30–13:30
            </li>
            <li>
              <a href={`https://wa.me/${WHATSAPP_NUMERO}`} target="_blank" rel="noreferrer" className="flex items-start gap-2 hover:text-naranja">
                <IconoWhatsApp className="mt-0.5 h-4 w-4 shrink-0 text-naranja" />
                +56 9 1234 5678
              </a>
            </li>
            <li className="pl-6">ventas@lacasadelamotosierra.cl</li>
          </ul>
        </div>

        {/* Información */}
        <div>
          <h3 className="mb-3 font-display text-lg font-semibold uppercase tracking-wide">Información</h3>
          <ul className="space-y-2.5 text-sm text-white/80">
            <li><Link to="/seguimiento" className="hover:text-naranja">Seguimiento de pedido</Link></li>
            <li><Link to="/nosotros" className="hover:text-naranja">Nosotros y servicio técnico</Link></li>
            <li><Link to="/preguntas-frecuentes" className="hover:text-naranja">Envíos y devoluciones</Link></li>
            <li><Link to="/preguntas-frecuentes" className="hover:text-naranja">Garantía</Link></li>
            <li><Link to="/cotizaciones/nueva" className="hover:text-naranja">Cotizaciones para empresas</Link></li>
            <li><Link to="/marcas" className="hover:text-naranja">Repuestos por marca</Link></li>
            <li><Link to="/terminos" className="hover:text-naranja">Términos y condiciones</Link></li>
            <li><Link to="/privacidad" className="hover:text-naranja">Política de privacidad</Link></li>
          </ul>
        </div>

        {/* Servicio técnico + pagos + redes */}
        <div>
          <h3 className="mb-3 font-display text-lg font-semibold uppercase tracking-wide">Servicio técnico</h3>
          <p className="flex items-start gap-2 text-sm text-white/80">
            <IconoLlave className="mt-0.5 h-4 w-4 shrink-0 text-naranja" />
            Mantención y reparación de motosierras y desbrozadoras en taller propio.
          </p>
          <h3 className="mb-2 mt-5 font-display text-lg font-semibold uppercase tracking-wide">Paga como quieras</h3>
          <div className="flex flex-wrap gap-2 text-[11px] font-bold">
            <span className="rounded bg-white px-2.5 py-1 text-[#6E2C8B]">Webpay</span>
            <span className="rounded bg-white px-2.5 py-1 text-[#009EE3]">Mercado Pago</span>
            <span className="rounded bg-white px-2.5 py-1 text-grafito">Transferencia</span>
          </div>
          <div className="mt-5 flex gap-3 text-sm">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="rounded bg-white/10 px-3 py-1.5 hover:bg-white/20">Instagram</a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="rounded bg-white/10 px-3 py-1.5 hover:bg-white/20">Facebook</a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} La Casa de la Motosierra SpA · Puerto Aysén, Región de Aysén, Chile
        <span className="mx-2">·</span>
        Fotografías: Robertoaysen, kallerna, Jiří Sedláček, Fletcher6, StrangeApparition2011 y otros,
        vía Wikimedia Commons (CC BY-SA / dominio público)
      </div>
    </footer>
  );
}
