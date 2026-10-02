// Términos y condiciones de compra — requisito para Webpay
// producción y exigencia de la normativa de consumo chilena.
// REVISAR CON EL CLIENTE antes de publicar: montos, plazos y
// razón social deben reflejar su operación real.
import { useSeo } from '../utils/seo';

const SECCIONES: { titulo: string; parrafos: string[] }[] = [
  {
    titulo: '1. Identificación del vendedor',
    parrafos: [
      'Este sitio es operado por La Casa de la Motosierra Aysén SpA, RUT 78.269.561-4, con domicilio en Teniente Merino 500, Puerto Aysén, Región de Aysén, Chile (en adelante, "la Tienda"). Contacto: lacasadelamotosierraaysenspa@gmail.com, +56 9 8756 8465.',
    ],
  },
  {
    titulo: '2. Aceptación de los términos',
    parrafos: [
      'Al comprar en este sitio, el cliente declara haber leído y aceptado estos términos y condiciones, que se rigen por la Ley N° 19.496 sobre Protección de los Derechos de los Consumidores y demás normativa chilena aplicable.',
    ],
  },
  {
    titulo: '3. Precios y stock',
    parrafos: [
      'Todos los precios se expresan en pesos chilenos (CLP) e incluyen IVA. Los precios por volumen y las ofertas se muestran en la ficha de cada producto y se aplican automáticamente en el carrito.',
      'El stock indicado en el sitio corresponde al inventario real de la bodega de Puerto Aysén. Si por error de sistema se vendiera un producto sin stock, la Tienda contactará al cliente para ofrecer la reposición bajo pedido, un producto alternativo o la devolución íntegra de lo pagado.',
    ],
  },
  {
    titulo: '4. Medios de pago',
    parrafos: [
      'Se aceptan pagos con tarjetas de débito, crédito y prepago a través de Webpay Plus (Transbank), pagos a través de Mercado Pago, y transferencia electrónica bancaria.',
      'Los pedidos pagados por transferencia quedan en estado "pendiente de validación" y se preparan una vez confirmada la recepción del pago, dentro de 1 día hábil.',
    ],
  },
  {
    titulo: '5. Despacho y retiro',
    parrafos: [
      'El cliente puede retirar sin costo en la tienda de Puerto Aysén, o solicitar despacho a domicilio o sucursal mediante Starken, Chilexpress o Blue Express. El costo del envío se calcula y muestra antes de pagar.',
      'Los plazos de entrega indicados en el checkout son estimaciones de los couriers y pueden variar por condiciones climáticas o de conectividad propias de la zona austral. El número de seguimiento se informa al despachar y el estado del pedido puede consultarse en cualquier momento en la sección "Seguimiento de pedido".',
    ],
  },
  {
    titulo: '6. Derecho a retracto y devoluciones',
    parrafos: [
      'Conforme al artículo 3 bis de la Ley 19.496, en compras electrónicas el cliente puede ejercer el derecho a retracto dentro de 10 días desde la recepción del producto, siempre que este no haya sido usado y conserve su empaque original. El flete de retorno es de cargo del cliente, salvo que la devolución se origine en un error de la Tienda.',
      'Si el producto recibido es distinto al comprado o llega dañado, la Tienda asume el flete completo y ofrece cambio o devolución íntegra, a elección del cliente.',
    ],
  },
  {
    titulo: '7. Garantía legal',
    parrafos: [
      'Todos los productos tienen la garantía legal de 6 meses establecida por la Ley 19.496 ante fallas de fabricación: el cliente puede optar por la reparación, el cambio o la devolución de lo pagado. Las máquinas nuevas tienen además la garantía del fabricante según su marca.',
      'La garantía no cubre desgaste normal de consumibles (cadenas, filtros, bujías), daños por mezcla de combustible incorrecta ni intervenciones de terceros no autorizados.',
    ],
  },
  {
    titulo: '8. Cotizaciones',
    parrafos: [
      'Las cotizaciones formales emitidas por el sitio tienen una validez de 15 días corridos desde su emisión y no constituyen reserva de stock. Los precios cotizados se respetan dentro del período de validez presentando el folio correspondiente.',
    ],
  },
  {
    titulo: '9. Uso del sitio',
    parrafos: [
      'El cliente se compromete a entregar información veraz al registrarse y comprar. La Tienda puede cancelar pedidos ante indicios razonables de fraude, informando al cliente y devolviendo cualquier monto pagado.',
    ],
  },
];

export default function Terminos() {
  useSeo({
    titulo: 'Términos y condiciones',
    descripcion: 'Condiciones de compra, despacho, retracto y garantía legal de La Casa de la Motosierra, conforme a la Ley 19.496.',
  });
  return (
    <div className="contenedor max-w-3xl py-10">
      <h1 className="titulo-seccion mb-2">Términos y condiciones</h1>
      <p className="mb-8 text-base text-gris-600">Última actualización: julio de 2026</p>
      {SECCIONES.map((s) => (
        <section key={s.titulo} className="mb-6">
          <h2 className="mb-2 font-display text-xl font-bold uppercase tracking-wide">{s.titulo}</h2>
          {s.parrafos.map((p, i) => (
            <p key={i} className="mb-2 text-base leading-relaxed text-grafito/90">{p}</p>
          ))}
        </section>
      ))}
    </div>
  );
}
