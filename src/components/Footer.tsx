// Footer carbón: contacto accionable (llamar / WhatsApp), enlaces,
// servicio técnico, medios de pago y lema del logo.
import { Link } from 'react-router-dom';
import LogoLCM from './LogoLCM';
import {
  CORREO_VENTAS, DIRECCION_TIENDA, ENLACE_LLAMAR, HORARIO_CORTO, TELEFONO_VISIBLE, enlaceWhatsApp,
} from '../config/tienda';
import { IconoPin, IconoReloj, IconoTelefono, IconoWhatsApp } from './Iconos';

const ENLACES_INFO: [string, string][] = [
  ['/seguimiento', '¿Dónde está mi pedido?'],
  ['/nosotros', 'Nosotros y servicio técnico'],
  ['/preguntas-frecuentes', 'Envíos, cambios y garantía'],
  ['/cotizaciones/nueva', 'Cotizaciones para empresas'],
  ['/marcas', 'Repuestos por marca'],
  ['/terminos', 'Términos y condiciones'],
  ['/privacidad', 'Política de privacidad'],
];

export default function Footer() {
  return (
    <footer className="mt-16 bg-carbon text-white">
      {/* Franja de lema */}
      <div className="border-b border-white/10">
        <div className="contenedor py-6 text-center">
          <p className="font-display text-2xl font-semibold uppercase tracking-wide text-naranja sm:text-3xl">
            “Economía para la Gente de Aysén”
          </p>
        </div>
      </div>

      <div className="contenedor grid gap-10 py-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
        {/* Identidad */}
        <div>
          <LogoLCM tono="claro" tamano="md" conBajada />
          <p className="mt-4 max-w-xs text-base leading-relaxed text-white/75">
            Repuestos, maquinaria forestal y agrícola, y servicio técnico en Puerto Aysén.
            Despacho a todo Chile.
          </p>
        </div>

        {/* Contacto */}
        <div>
          <h2 className="mb-4 font-display text-xl font-semibold uppercase tracking-wide">Contacto</h2>
          <ul className="space-y-3 text-base text-white/85">
            <li className="flex items-start gap-2.5">
              <IconoPin className="mt-0.5 h-5 w-5 shrink-0 text-naranja" />
              {DIRECCION_TIENDA}
            </li>
            <li className="flex items-start gap-2.5">
              <IconoReloj className="mt-0.5 h-5 w-5 shrink-0 text-naranja" />
              {HORARIO_CORTO}
            </li>
            <li className="pl-[1.875rem] text-white/75">
              {/* Corte permitido tras la @ para que el correo no se parta al medio */}
              {CORREO_VENTAS.split('@')[0]}@<wbr />{CORREO_VENTAS.split('@')[1]}
            </li>
          </ul>
          <div className="mt-5 flex flex-col gap-2.5">
            <a href={ENLACE_LLAMAR} className="btn border-2 border-white/30 text-white hover:border-white">
              <IconoTelefono className="h-5 w-5 text-naranja" /> {TELEFONO_VISIBLE}
            </a>
            <a href={enlaceWhatsApp()} target="_blank" rel="noreferrer" className="btn-whatsapp">
              <IconoWhatsApp className="h-5 w-5" /> Escríbenos por WhatsApp
            </a>
          </div>
        </div>

        {/* Información */}
        <nav aria-label="Información">
          <h2 className="mb-4 font-display text-xl font-semibold uppercase tracking-wide">Información</h2>
          <ul className="text-base">
            {ENLACES_INFO.map(([a, texto]) => (
              <li key={texto}>
                <Link to={a} className="flex min-h-[44px] items-center text-white/85 hover:text-naranja hover:underline">
                  {texto}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Pagos + redes */}
        <div>
          <h2 className="mb-4 font-display text-xl font-semibold uppercase tracking-wide">Paga como quieras</h2>
          <ul className="flex flex-wrap gap-2 text-sm font-bold">
            <li className="rounded-md bg-white px-3 py-1.5 text-[#6E2C8B]">Webpay</li>
            <li className="rounded-md bg-white px-3 py-1.5 text-[#00699E]">Mercado Pago</li>
            <li className="rounded-md bg-white px-3 py-1.5 text-grafito">Transferencia</li>
          </ul>
          <p className="mt-3 text-base text-white/75">Débito, crédito y prepago.</p>
          <h2 className="mb-3 mt-7 font-display text-xl font-semibold uppercase tracking-wide">Síguenos</h2>
          <div className="flex gap-3 text-base">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="btn min-h-[44px] bg-white/10 px-4 text-white hover:bg-white/20">Instagram</a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="btn min-h-[44px] bg-white/10 px-4 text-white hover:bg-white/20">Facebook</a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="contenedor py-5 text-center text-sm text-white/60">
          © {new Date().getFullYear()} La Casa de la Motosierra Aysén SpA · Puerto Aysén, Región de Aysén, Chile
          <span className="mx-2">·</span>
          Fotografías: Robertoaysen, kallerna, Jiří Sedláček, Fletcher6, StrangeApparition2011 y otros,
          vía Wikimedia Commons (CC BY-SA / dominio público)
        </p>
      </div>
    </footer>
  );
}
