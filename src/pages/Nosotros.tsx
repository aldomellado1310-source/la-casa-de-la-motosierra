// Página "Nosotros": trayectoria local, servicio técnico y lema
import { Link } from 'react-router-dom';
import { WHATSAPP_NUMERO } from '../config/firebase';
import LogoLCM from '../components/LogoLCM';
import { IconoEscudo, IconoLlave, IconoPin, IconoReloj, IconoWhatsApp } from '../components/Iconos';
import { useSeo } from '../utils/seo';

export default function Nosotros() {
  useSeo({
    titulo: 'Nosotros — tienda forestal de Puerto Aysén',
    descripcion: 'Tienda local de repuestos y maquinaria forestal en Puerto Aysén: stock real en bodega, servicio técnico y despacho a todo Chile. Economía para la Gente de Aysén.',
  });
  return (
    <div>
      {/* Presentación */}
      <section className="contenedor max-w-3xl py-12">
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          <LogoLCM tamano="lg" conBajada />
          <p className="mt-3 font-display text-lg font-semibold uppercase tracking-wide text-naranja-oscuro">
            “Economía para la Gente de Aysén”
          </p>
        </div>

        <div className="space-y-5 leading-relaxed text-grafito">
          <p>
            Nacimos en Puerto Aysén atendiendo a quienes viven del bosque y del campo: leñadores,
            faenas forestales, talleres, pequeños agricultores y familias que dependen de su
            motosierra para pasar el invierno. Sabemos lo que significa que una máquina se detenga
            en plena temporada, con el repuesto a mil kilómetros de distancia.
          </p>
          <p>
            Por eso armamos una tienda pensada para nuestra zona: <strong>stock real en bodega
            local</strong>, repuestos identificados por <strong>marca y modelo de máquina</strong>{' '}
            para que no compres a ciegas, y despacho con <strong>costo conocido antes de
            pagar</strong> a cualquier punto de Chile, porque en la Patagonia el flete no puede
            ser una sorpresa.
          </p>
          <p>
            Atendemos igual al que necesita una bujía que al municipio que equipa una cuadrilla
            completa. Para empresas, faenas y servicios públicos emitimos{' '}
            <strong>cotizaciones formales con folio en PDF</strong>, listas para respaldar
            órdenes de compra.
          </p>
        </div>
      </section>

      {/* Servicio técnico */}
      <section className="bg-gris-fondo">
        <div className="contenedor max-w-3xl py-12">
          <h2 className="titulo-seccion mb-4 flex items-center gap-3">
            <IconoLlave className="h-7 w-7 text-naranja" /> Servicio técnico propio
          </h2>
          <p className="leading-relaxed text-grafito">
            No solo vendemos repuestos: también los instalamos. En nuestro taller diagnosticamos
            y reparamos motosierras y desbrozadoras de todas las marcas, con repuestos originales
            o alternativos según tu presupuesto. Si no puedes venir, envíanos fotos por WhatsApp
            y te orientamos antes de que gastes en la pieza equivocada.
          </p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              'Mantención preventiva y afilado de cadenas',
              'Reparación de carburación y arranque',
              'Cambio de pistones, embragues y rodamientos',
              'Diagnóstico gratuito al comprar el repuesto aquí',
            ].map((s) => (
              <li key={s} className="flex items-start gap-2 rounded-lg border border-borde bg-white p-3 text-base">
                <IconoEscudo className="mt-0.5 h-4 w-4 shrink-0 text-verde" />
                {s}
              </li>
            ))}
          </ul>
          <a
            href={`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent('Hola, necesito servicio técnico para mi máquina')}`}
            target="_blank"
            rel="noreferrer"
            className="btn-primario mt-6"
          >
            <IconoWhatsApp className="h-5 w-5" /> Agendar por WhatsApp
          </a>
        </div>
      </section>

      {/* Visítanos */}
      <section className="contenedor max-w-3xl py-12">
        <div className="tarjeta flex flex-col items-center gap-4 py-8 text-center">
          <h2 className="font-display text-2xl font-bold uppercase tracking-wide">Visítanos</h2>
          <p className="flex items-center gap-2 text-base text-grafito">
            <IconoPin className="h-4 w-4 text-naranja" /> Teniente Merino 500, Puerto Aysén
          </p>
          <p className="flex items-center gap-2 text-base text-grafito">
            <IconoReloj className="h-4 w-4 text-naranja" /> Lunes a viernes 9:00–18:30 · Sábado 9:30–13:30
          </p>
          <Link to="/tienda" className="btn-verde mt-2">Conocer la tienda online</Link>
        </div>
      </section>
    </div>
  );
}
