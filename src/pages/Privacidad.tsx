// Política de privacidad — Ley 19.628 sobre protección de la
// vida privada. REVISAR CON EL CLIENTE antes de publicar.
import { useSeo } from '../utils/seo';

const SECCIONES: { titulo: string; parrafos: string[] }[] = [
  {
    titulo: '1. Responsable del tratamiento',
    parrafos: [
      'La Casa de la Motosierra SpA, RUT 77.123.456-7, Teniente Merino 500, Puerto Aysén, es responsable del tratamiento de los datos personales recolectados en este sitio, conforme a la Ley N° 19.628 sobre Protección de la Vida Privada.',
    ],
  },
  {
    titulo: '2. Qué datos recolectamos',
    parrafos: [
      'Datos de cuenta: nombre, correo electrónico y teléfono. Para cuentas de empresa, además RUT y razón social.',
      'Datos de compra: direcciones de despacho, historial de pedidos y cotizaciones, y máquinas registradas para el filtro de compatibilidad.',
      'Datos de pago: los pagos se procesan directamente en las plataformas de Transbank, Mercado Pago y Flow; este sitio no almacena números de tarjeta.',
      'Correo electrónico voluntario para el aviso de reposición de stock ("Avísame cuando llegue").',
    ],
  },
  {
    titulo: '3. Para qué los usamos',
    parrafos: [
      'Exclusivamente para procesar y despachar pedidos, emitir cotizaciones y documentos tributarios, gestionar la cuenta del cliente, responder consultas y avisar reposiciones de stock solicitadas.',
      'No vendemos ni cedemos datos personales a terceros. Solo se comparten los datos estrictamente necesarios con los couriers (nombre, dirección y teléfono para la entrega) y con las pasarelas de pago para procesar la transacción.',
    ],
  },
  {
    titulo: '4. Dónde se almacenan',
    parrafos: [
      'Los datos se almacenan en la plataforma Firebase de Google Cloud, con acceso restringido mediante reglas de seguridad: cada cliente solo puede acceder a su propia información, y el personal autorizado de la Tienda a la necesaria para operar.',
    ],
  },
  {
    titulo: '5. Tus derechos',
    parrafos: [
      'Conforme a la Ley 19.628, el cliente puede solicitar en cualquier momento el acceso, la rectificación o la eliminación de sus datos personales, escribiendo a ventas@lacasadelamotosierra.cl. Las solicitudes se responden dentro de 10 días hábiles.',
      'La eliminación de la cuenta borra los datos personales, sin perjuicio de la información que la Tienda deba conservar por obligaciones tributarias.',
    ],
  },
  {
    titulo: '6. Cookies y almacenamiento local',
    parrafos: [
      'El sitio usa almacenamiento local del navegador para funciones esenciales: mantener la sesión iniciada, recordar el carrito y los favoritos. No se usan cookies de publicidad ni rastreadores de terceros.',
    ],
  },
];

export default function Privacidad() {
  useSeo({
    titulo: 'Política de privacidad',
    descripcion: 'Cómo La Casa de la Motosierra recolecta, usa y protege tus datos personales, conforme a la Ley 19.628.',
  });
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="titulo-seccion mb-2">Política de privacidad</h1>
      <p className="mb-8 text-sm text-gris-600">Última actualización: julio de 2026</p>
      {SECCIONES.map((s) => (
        <section key={s.titulo} className="mb-6">
          <h2 className="mb-2 font-display text-xl font-bold uppercase tracking-wide">{s.titulo}</h2>
          {s.parrafos.map((p, i) => (
            <p key={i} className="mb-2 text-sm leading-relaxed text-grafito/90">{p}</p>
          ))}
        </section>
      ))}
    </div>
  );
}
