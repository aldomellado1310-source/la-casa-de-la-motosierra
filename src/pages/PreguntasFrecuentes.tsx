// Preguntas frecuentes: envíos, pagos, devoluciones y garantía
import { useState } from 'react';

interface Pregunta {
  seccion: string;
  q: string;
  a: string;
}

const PREGUNTAS: Pregunta[] = [
  {
    seccion: 'Envíos',
    q: '¿Hacen despacho a todo Chile?',
    a: 'Sí. Despachamos por Starken, Chilexpress o Blue Express a todo el país. El costo exacto se calcula y se muestra en el checkout ANTES de pagar — nunca "envío por pagar".',
  },
  {
    seccion: 'Envíos',
    q: '¿Puedo retirar en tienda?',
    a: 'Claro: el retiro en nuestra tienda de Teniente Merino 500, Puerto Aysén, es gratis. Si el producto está en stock puedes retirarlo el mismo día en horario de atención.',
  },
  {
    seccion: 'Envíos',
    q: '¿Cuánto demora un envío dentro de la Región de Aysén?',
    a: 'Entre 1 y 3 días hábiles según la localidad. Para zonas más aisladas coordinamos por WhatsApp la mejor alternativa (bus, barcaza o transportista local).',
  },
  {
    seccion: 'Pagos',
    q: '¿Qué medios de pago aceptan?',
    a: 'Webpay Plus (débito, crédito y prepago), Mercado Pago (con cuotas) y transferencia bancaria. En transferencia, el pedido queda pendiente hasta que validamos el comprobante que subes.',
  },
  {
    seccion: 'Pagos',
    q: '¿Emiten factura?',
    a: 'Sí. Si compras con cuenta empresa (RUT y razón social registrados), emitimos factura. También generamos cotizaciones formales en PDF con folio para respaldar órdenes de compra.',
  },
  {
    seccion: 'Devoluciones',
    q: '¿Puedo devolver un repuesto si no era el correcto?',
    a: 'Sí, dentro de 10 días desde la recepción, sin uso y en su empaque original. Para evitarlo, usa el buscador por marca y modelo o consúltanos por WhatsApp antes de comprar: verificamos la compatibilidad por ti.',
  },
  {
    seccion: 'Devoluciones',
    q: '¿Quién paga el flete de la devolución?',
    a: 'Si el error fue nuestro (producto equivocado o defectuoso), asumimos el flete completo. Si fue un error de compra, el flete de retorno es de cargo del cliente.',
  },
  {
    seccion: 'Garantía',
    q: '¿Qué garantía tienen los productos?',
    a: 'Las máquinas nuevas tienen garantía del fabricante (6 a 12 meses según marca). Los repuestos tienen garantía de 3 meses por defectos de fabricación. La garantía no cubre desgaste normal ni daños por mezcla de combustible incorrecta.',
  },
  {
    seccion: 'Garantía',
    q: '¿Cómo hago efectiva una garantía desde otra región?',
    a: 'Escríbenos por WhatsApp con fotos y el número de pedido. Evaluamos el caso y, si corresponde, coordinamos el retiro del producto y el reemplazo o la devolución del dinero.',
  },
  {
    seccion: 'Compatibilidad',
    q: 'No encuentro mi modelo en el buscador, ¿qué hago?',
    a: 'Escríbenos por WhatsApp con la marca, el modelo (está en la etiqueta de la máquina) y una foto de la pieza. Te confirmamos compatibilidad y, si no tenemos la pieza, la conseguimos bajo pedido.',
  },
];

export default function PreguntasFrecuentes() {
  const [abierta, setAbierta] = useState<number | null>(0);
  const secciones = [...new Set(PREGUNTAS.map((p) => p.seccion))];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-8 text-center titulo-seccion sm:text-4xl">Preguntas frecuentes</h1>
      {secciones.map((seccion) => (
        <section key={seccion} className="mb-6">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-naranja">{seccion}</h2>
          <div className="space-y-2">
            {PREGUNTAS.map((p, i) =>
              p.seccion === seccion ? (
                <div key={p.q} className="overflow-hidden rounded-xl border border-borde bg-white">
                  <button
                    onClick={() => setAbierta(abierta === i ? null : i)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold hover:bg-gris-fondo"
                  >
                    {p.q}
                    <span className="shrink-0 text-verde">{abierta === i ? '−' : '+'}</span>
                  </button>
                  {abierta === i && (
                    <p className="animar-entrada border-t border-borde px-4 py-3 text-sm leading-relaxed text-grafito/85">
                      {p.a}
                    </p>
                  )}
                </div>
              ) : null,
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
