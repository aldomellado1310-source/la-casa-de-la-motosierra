// ============================================================
// Solicitud de cotización formal: toma los ítems del carrito,
// genera folio + PDF descargable y la guarda con estado
// "enviada" para seguimiento del admin.
// ============================================================
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../stores/useAuth';
import { useCarrito } from '../stores/useCarrito';
import { crearCotizacion } from '../services/cotizaciones';
import { descargarPdfCotizacion } from '../services/pdfCotizacion';
import { desglosarIVA, formatoCLP } from '../utils/precio';
import { IconoDocumento } from '../components/Iconos';
import type { Cotizacion } from '../types';

export default function CotizacionNueva() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { items, total, vaciar } = useCarrito();
  const [observaciones, setObservaciones] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [creada, setCreada] = useState<Cotizacion | null>(null);

  // Sin sesión: explicar el flujo e invitar a registrarse
  if (!usuario) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12 text-center">
        <IconoDocumento className="mx-auto h-12 w-12 text-gris-600" />
        <h1 className="mt-4 font-display text-2xl font-bold uppercase tracking-wide text-grafito">Cotizaciones formales con folio y PDF</h1>
        <p className="mt-2 text-sm text-grafito/80">
          Ideal para faenas forestales, municipios, empresas y talleres. Arma tu carrito, solicita la cotización
          y descarga el PDF con folio, RUT, detalle, IVA y total — listo para respaldar tu orden de compra.
        </p>
        <p className="mt-2 text-sm text-grafito/80">Necesitas una cuenta para solicitar cotizaciones.</p>
        <div className="mt-6 flex justify-center gap-2">
          <Link to="/registro" className="btn-primario">Crear cuenta empresa</Link>
          <Link to="/ingresar" className="btn-secundario">Ya tengo cuenta</Link>
        </div>
      </div>
    );
  }

  // Cotización recién creada: confirmación + descarga
  if (creada) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12 text-center">
        <div className="tarjeta py-10">
          <span className="text-5xl">📄</span>
          <h1 className="mt-4 titulo-seccion">Cotización {creada.folio} creada</h1>
          <p className="mt-2 text-sm text-grafito/80">
            Válida hasta el {new Date(creada.validaHasta).toLocaleDateString('es-CL')}. También la encontrarás en
            “Mi cuenta → Cotizaciones”.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
            <button onClick={() => descargarPdfCotizacion(creada)} className="btn-primario">Descargar PDF</button>
            <button onClick={() => navigate('/mi-cuenta')} className="btn-secundario">Ver mis cotizaciones</button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12 text-center">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-grafito">Tu carrito está vacío</h1>
        <p className="mt-2 text-sm text-grafito/80">
          Agrega al carrito los productos que quieres cotizar y vuelve aquí para generar el documento formal.
        </p>
        <Link to="/tienda" className="btn-primario mt-6">Ir a la tienda</Link>
      </div>
    );
  }

  const { neto, iva } = desglosarIVA(total());

  const solicitar = async () => {
    setProcesando(true);
    try {
      const cot = await crearCotizacion(usuario, items, observaciones.trim() || undefined);
      vaciar();
      setCreada(cot);
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-2 titulo-seccion">Solicitar cotización formal</h1>
      <p className="mb-6 text-sm text-gris-600">
        Se genera un PDF con folio, fecha, tus datos {usuario.tipo === 'empresa' ? '(RUT y razón social)' : ''}, detalle de
        ítems, neto, IVA y total. Sin compromiso de compra.
      </p>

      <div className="tarjeta">
        <h2 className="mb-3 font-bold">Datos del solicitante</h2>
        <dl className="grid gap-1 text-sm sm:grid-cols-2">
          <div><dt className="inline text-gris-600">Nombre: </dt><dd className="inline font-semibold">{usuario.nombre}</dd></div>
          <div><dt className="inline text-gris-600">Correo: </dt><dd className="inline font-semibold">{usuario.email}</dd></div>
          {usuario.tipo === 'empresa' && (
            <>
              <div><dt className="inline text-gris-600">Razón social: </dt><dd className="inline font-semibold">{usuario.razonSocial}</dd></div>
              <div><dt className="inline text-gris-600">RUT: </dt><dd className="inline font-semibold">{usuario.rut}</dd></div>
            </>
          )}
        </dl>
        {usuario.tipo === 'particular' && (
          <p className="mt-2 text-xs text-gris-600">
            Consejo: si cotizas para una empresa, cambia tu cuenta a tipo empresa para incluir RUT y razón social en el PDF.
          </p>
        )}
      </div>

      <div className="tarjeta mt-4">
        <h2 className="mb-3 font-bold">Detalle de la cotización</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-borde text-left text-xs uppercase text-gris-600">
              <th className="py-2">Producto</th>
              <th className="py-2 text-center">Cant.</th>
              <th className="py-2 text-right">P. unitario</th>
              <th className="py-2 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.productoId} className="border-b border-borde">
                <td className="py-2">
                  <span className="font-semibold">{it.nombre}</span>
                  <span className="block text-xs text-gris-600">SKU {it.sku}</span>
                </td>
                <td className="py-2 text-center">{it.cantidad}</td>
                <td className="py-2 text-right">{formatoCLP(it.precioUnitario)}</td>
                <td className="py-2 text-right font-semibold">{formatoCLP(it.precioUnitario * it.cantidad)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3 ml-auto max-w-xs space-y-1 text-sm">
          <div className="flex justify-between"><span>Neto</span><span>{formatoCLP(neto)}</span></div>
          <div className="flex justify-between"><span>IVA (19%)</span><span>{formatoCLP(iva)}</span></div>
          <div className="flex justify-between border-t border-borde pt-1 text-base font-extrabold">
            <span>Total</span><span className="text-naranja">{formatoCLP(total())}</span>
          </div>
        </div>
      </div>

      <div className="tarjeta mt-4">
        <label className="etiqueta">Observaciones (opcional)</label>
        <textarea
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          rows={3}
          placeholder="Ej: cotización para orden de compra municipal, entregar en bodega de faena, etc."
          className="campo"
        />
      </div>

      <button onClick={solicitar} disabled={procesando} className="btn-primario mt-6 w-full py-3">
        {procesando ? 'Generando…' : 'Generar cotización con folio y PDF'}
      </button>
    </div>
  );
}
