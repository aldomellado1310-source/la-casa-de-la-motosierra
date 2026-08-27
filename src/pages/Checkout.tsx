// ============================================================
// Checkout: resumen, dirección, método de entrega con costo
// visible ANTES de pagar, y medios de pago (Webpay / Mercado
// Pago / Flow / transferencia con comprobante).
// ============================================================
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../stores/useAuth';
import { useCarrito } from '../stores/useCarrito';
import { crearPedido, subirComprobante } from '../services/pedidos';
import { invalidarCacheProductos, obtenerProducto } from '../services/productos';
import {
  DATOS_TRANSFERENCIA, iniciarPagoFlow, iniciarPagoMercadoPago, iniciarPagoWebpay,
  redirigirAFlow, redirigirAWebpay,
} from '../services/pagos';
import { REGIONES_CHILE, calcularOpcionesEnvio } from '../services/envios';
import { formatoCLP } from '../utils/precio';
import { useSeo } from '../utils/seo';
import type { Direccion, MetodoEnvio, MetodoPago, Pedido } from '../types';

export default function Checkout() {
  useSeo({
    titulo: 'Finalizar compra',
    descripcion: 'Método de entrega con costo visible antes de pagar y pago con Webpay, Mercado Pago, Flow o transferencia.',
  });
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { items, total, vaciar } = useCarrito();

  // --- Estado del formulario ---
  const [region, setRegion] = useState('Aysén');
  const [direccionId, setDireccionId] = useState('');
  const [dirNueva, setDirNueva] = useState({ calle: '', numero: '', comuna: '' });
  const [metodoEnvio, setMetodoEnvio] = useState<MetodoEnvio>('retiro_tienda');
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('webpay');
  const [comprobante, setComprobante] = useState<File | null>(null);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState('');
  // Se congela el total al crear el pedido: tras vaciar el carrito, totalFinal vuelve a 0
  const [pedidoTransferencia, setPedidoTransferencia] = useState<{ id: string; total: number } | null>(null);
  const [emailInvitado, setEmailInvitado] = useState('');
  const [nombreInvitado, setNombreInvitado] = useState('');

  // Peso estimado del paquete: 1 kg por unidad (aproximación simple)
  const pesoEstimado = items.reduce((acc, i) => acc + i.cantidad, 0);
  const opcionesEnvio = useMemo(() => calcularOpcionesEnvio(region, pesoEstimado), [region, pesoEstimado]);
  const envioElegido = opcionesEnvio.find((o) => o.metodo === metodoEnvio) ?? opcionesEnvio[0];
  const costoEnvio = envioElegido.costo;
  const totalFinal = total() + costoEnvio;

  if (items.length === 0 && !pedidoTransferencia) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="font-semibold">No tienes productos en el carrito.</p>
        <Link to="/tienda" className="btn-primario mt-4">Ir a la tienda</Link>
      </div>
    );
  }

  /** Arma la dirección seleccionada o la ingresada a mano */
  const obtenerDireccion = (): Direccion | undefined => {
    if (metodoEnvio === 'retiro_tienda') return undefined;
    const guardada = usuario?.direcciones.find((d) => d.id === direccionId);
    if (guardada) return guardada;
    return {
      id: 'checkout',
      alias: 'Entrega',
      calle: dirNueva.calle,
      numero: dirNueva.numero,
      comuna: dirNueva.comuna,
      region,
    };
  };

  const validar = (): string => {
    if (!usuario && (!emailInvitado || !nombreInvitado)) return 'Ingresa tu nombre y correo para continuar.';
    if (metodoEnvio !== 'retiro_tienda') {
      const dir = obtenerDireccion();
      if (!dir?.calle || !dir.comuna) return 'Completa la dirección de despacho.';
    }
    return '';
  };

  const pagar = async () => {
    const msg = validar();
    if (msg) {
      setError(msg);
      return;
    }
    setError('');
    setProcesando(true);
    try {
      // Revalidar stock real antes de crear el pedido: el carrito guarda un
      // snapshot que puede haber quedado desactualizado
      invalidarCacheProductos();
      for (const it of items) {
        const prod = await obtenerProducto(it.productoId);
        if (prod && !prod.bajoPedido && prod.stock < it.cantidad) {
          setError(`Stock insuficiente de "${it.nombre}": quedan ${prod.stock} unidades disponibles.`);
          setProcesando(false);
          return;
        }
      }
      const base: Omit<Pedido, 'id'> = {
        uid: usuario?.uid ?? 'invitado',
        nombreCliente: usuario?.nombre ?? nombreInvitado,
        emailCliente: usuario?.email ?? emailInvitado,
        items,
        subtotal: total(),
        costoEnvio,
        total: totalFinal,
        metodoPago,
        metodoEnvio,
        direccion: obtenerDireccion(),
        estado: 'pendiente_pago',
        fecha: new Date().toISOString(),
      };
      const pedidoId = await crearPedido(base);

      if (metodoPago === 'webpay') {
        const resp = await iniciarPagoWebpay(pedidoId);
        vaciar();
        redirigirAWebpay(resp);
        return;
      }
      if (metodoPago === 'mercadopago') {
        const url = await iniciarPagoMercadoPago(pedidoId, `Pedido ${pedidoId} — La Casa de la Motosierra`);
        vaciar();
        window.location.href = url;
        return;
      }
      if (metodoPago === 'flow') {
        const resp = await iniciarPagoFlow(pedidoId, usuario?.email ?? emailInvitado);
        vaciar();
        redirigirAFlow(resp);
        return;
      }
      // Transferencia: mostramos datos bancarios y permitimos subir comprobante
      setPedidoTransferencia({ id: pedidoId, total: totalFinal });
      vaciar();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ocurrió un error al procesar el pago.');
    } finally {
      setProcesando(false);
    }
  };

  const enviarComprobante = async () => {
    if (!pedidoTransferencia || !comprobante) return;
    setProcesando(true);
    try {
      await subirComprobante(pedidoTransferencia.id, comprobante);
      navigate(`/pago/retorno?transferencia=ok&pedido=${pedidoTransferencia.id}`);
    } catch {
      setError('No se pudo subir el comprobante. Inténtalo de nuevo o envíalo por WhatsApp.');
    } finally {
      setProcesando(false);
    }
  };

  // --- Pantalla de transferencia (post-creación del pedido) ---
  if (pedidoTransferencia) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="tarjeta">
          <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-grafito">Pedido {pedidoTransferencia.id} creado</h1>
          <p className="mt-2 text-sm">
            Transfiere <strong className="text-naranja-oscuro">{formatoCLP(pedidoTransferencia.total)}</strong> a la siguiente cuenta y sube el
            comprobante. Tu pedido quedará <strong>pendiente de validación</strong> hasta que confirmemos el pago.
          </p>
          <dl className="mt-4 space-y-1 rounded-lg bg-gris-fondo p-4 text-sm">
            <div className="flex justify-between"><dt>Banco</dt><dd className="font-semibold">{DATOS_TRANSFERENCIA.banco}</dd></div>
            <div className="flex justify-between"><dt>Tipo de cuenta</dt><dd className="font-semibold">{DATOS_TRANSFERENCIA.tipoCuenta}</dd></div>
            <div className="flex justify-between"><dt>N° de cuenta</dt><dd className="font-semibold">{DATOS_TRANSFERENCIA.numeroCuenta}</dd></div>
            <div className="flex justify-between"><dt>Titular</dt><dd className="font-semibold">{DATOS_TRANSFERENCIA.titular}</dd></div>
            <div className="flex justify-between"><dt>RUT</dt><dd className="font-semibold">{DATOS_TRANSFERENCIA.rut}</dd></div>
            <div className="flex justify-between"><dt>Correo</dt><dd className="font-semibold">{DATOS_TRANSFERENCIA.email}</dd></div>
          </dl>
          <div className="mt-4">
            <label className="etiqueta" htmlFor="chk-comprobante">Comprobante de transferencia (imagen o PDF)</label>
            <input
              id="chk-comprobante"
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setComprobante(e.target.files?.[0] ?? null)}
              className="campo"
            />
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <button onClick={enviarComprobante} disabled={!comprobante || procesando} className="btn-primario mt-4 w-full py-3">
            {procesando ? 'Subiendo…' : 'Enviar comprobante'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-6 titulo-seccion">Finalizar compra</h1>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 space-y-6">
          {/* Datos del comprador (invitado) */}
          {!usuario && (
            <section className="tarjeta">
              <h2 className="mb-3 font-bold">1. Tus datos</h2>
              <p className="mb-3 text-xs text-gris-600">
                ¿Ya tienes cuenta? <Link to="/ingresar" className="font-semibold text-verde hover:underline">Ingresa aquí</Link> para usar tus direcciones guardadas.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="etiqueta" htmlFor="chk-nombre">Nombre completo</label>
                  <input id="chk-nombre" autoComplete="name" value={nombreInvitado} onChange={(e) => setNombreInvitado(e.target.value)} className="campo" placeholder="Juan Soto" />
                </div>
                <div>
                  <label className="etiqueta" htmlFor="chk-correo">Correo</label>
                  <input id="chk-correo" type="email" autoComplete="email" value={emailInvitado} onChange={(e) => setEmailInvitado(e.target.value)} className="campo" placeholder="tu@correo.cl" />
                </div>
              </div>
            </section>
          )}

          {/* Método de entrega */}
          <section className="tarjeta">
            <h2 className="mb-1 font-bold">{usuario ? '1' : '2'}. Método de entrega</h2>
            <p className="mb-3 text-xs text-gris-600">El costo se muestra aquí, antes de pagar — sin sorpresas de “envío por pagar”.</p>

            <div className="mb-4">
              <label className="etiqueta" htmlFor="chk-region">Región de destino</label>
              <select id="chk-region" value={region} onChange={(e) => setRegion(e.target.value)} className="campo sm:max-w-xs">
                {REGIONES_CHILE.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              {opcionesEnvio.map((op) => (
                <label
                  key={op.metodo}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                    metodoEnvio === op.metodo ? 'border-naranja bg-naranja/5' : 'border-borde hover:border-verde'
                  }`}
                >
                  <input
                    type="radio"
                    name="envio"
                    checked={metodoEnvio === op.metodo}
                    onChange={() => setMetodoEnvio(op.metodo)}
                    className="mt-1 accent-naranja"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold">{op.nombre}</span>
                      <span className={`text-sm font-extrabold ${op.costo === 0 ? 'text-verde' : 'text-naranja-oscuro'}`}>
                        {op.costo === 0 ? 'Gratis' : formatoCLP(op.costo)}
                      </span>
                    </div>
                    <p className="text-xs text-gris-600">{op.descripcion}</p>
                    <p className="text-xs font-medium text-verde">{op.plazoEstimado}</p>
                  </div>
                </label>
              ))}
            </div>

            {/* Dirección de despacho */}
            {metodoEnvio !== 'retiro_tienda' && (
              <div className="mt-4 border-t border-borde pt-4">
                <h3 className="mb-2 text-sm font-bold">Dirección de despacho</h3>
                {usuario && usuario.direcciones.length > 0 && (
                  <div className="mb-3">
                    <label className="etiqueta" htmlFor="chk-dir-guardada">Usar dirección guardada</label>
                    <select id="chk-dir-guardada" value={direccionId} onChange={(e) => setDireccionId(e.target.value)} className="campo">
                      <option value="">Ingresar nueva dirección…</option>
                      {usuario.direcciones.map((d) => (
                        <option key={d.id} value={d.id}>{d.alias}: {d.calle} {d.numero}, {d.comuna}</option>
                      ))}
                    </select>
                  </div>
                )}
                {!direccionId && (
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <label className="etiqueta" htmlFor="chk-calle">Calle</label>
                      <input id="chk-calle" value={dirNueva.calle} onChange={(e) => setDirNueva({ ...dirNueva, calle: e.target.value })} className="campo" />
                    </div>
                    <div>
                      <label className="etiqueta" htmlFor="chk-numero">Número</label>
                      <input id="chk-numero" value={dirNueva.numero} onChange={(e) => setDirNueva({ ...dirNueva, numero: e.target.value })} className="campo" />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="etiqueta" htmlFor="chk-comuna">Comuna</label>
                      <input id="chk-comuna" value={dirNueva.comuna} onChange={(e) => setDirNueva({ ...dirNueva, comuna: e.target.value })} className="campo" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Medio de pago */}
          <section className="tarjeta">
            <h2 className="mb-3 font-bold">{usuario ? '2' : '3'}. Medio de pago</h2>
            <div className="space-y-2">
              {[
                { id: 'webpay' as const, nombre: 'Webpay Plus', detalle: 'Débito, crédito y prepago — Transbank' },
                { id: 'mercadopago' as const, nombre: 'Mercado Pago', detalle: 'Tarjetas con cuotas y saldo Mercado Pago' },
                { id: 'flow' as const, nombre: 'Flow', detalle: 'Tarjetas, transferencia en línea y más medios' },
                { id: 'transferencia' as const, nombre: 'Transferencia bancaria', detalle: 'Sube el comprobante; validamos y despachamos' },
              ].map((mp) => (
                <label
                  key={mp.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                    metodoPago === mp.id ? 'border-naranja bg-naranja/5' : 'border-borde hover:border-verde'
                  }`}
                >
                  <input type="radio" name="pago" checked={metodoPago === mp.id} onChange={() => setMetodoPago(mp.id)} className="accent-naranja" />
                  <div>
                    <span className="text-sm font-bold">{mp.nombre}</span>
                    <p className="text-xs text-gris-600">{mp.detalle}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Resumen lateral */}
        <aside className="lg:w-80 lg:shrink-0">
          <div className="tarjeta sticky top-28">
            <h2 className="mb-3 font-bold">Resumen del pedido</h2>
            <ul className="max-h-48 space-y-2 overflow-y-auto text-sm">
              {items.map((it) => (
                <li key={it.productoId} className="flex justify-between gap-2">
                  <span className="line-clamp-1">{it.cantidad}× {it.nombre}</span>
                  <span className="shrink-0 font-semibold">{formatoCLP(it.precioUnitario * it.cantidad)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 space-y-1 border-t border-borde pt-3 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatoCLP(total())}</span></div>
              <div className="flex justify-between">
                <span>Envío ({envioElegido.nombre})</span>
                <span className={costoEnvio === 0 ? 'font-semibold text-verde' : ''}>
                  {costoEnvio === 0 ? 'Gratis' : formatoCLP(costoEnvio)}
                </span>
              </div>
              <div className="flex justify-between border-t border-borde pt-2 text-base font-extrabold">
                <span>Total</span><span className="text-naranja-oscuro">{formatoCLP(totalFinal)}</span>
              </div>
            </div>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            <button onClick={pagar} disabled={procesando} className="btn-primario mt-4 w-full py-3">
              {procesando ? 'Procesando…' : metodoPago === 'transferencia' ? 'Crear pedido' : `Pagar ${formatoCLP(totalFinal)}`}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
