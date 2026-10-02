// ============================================================
// Checkout: resumen, dirección, método de entrega con costo
// visible ANTES de pagar, y medios de pago (Webpay / Mercado
// Pago / transferencia con comprobante).
// ============================================================
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../stores/useAuth';
import { useCarrito } from '../stores/useCarrito';
import { crearPedido, subirComprobante } from '../services/pedidos';
import { invalidarCacheProductos, obtenerProducto } from '../services/productos';
import { DATOS_TRANSFERENCIA, iniciarPagoMercadoPago, iniciarPagoWebpay, redirigirAWebpay } from '../services/pagos';
import { REGIONES_CHILE, calcularOpcionesEnvio } from '../services/envios';
import { formatoCLP } from '../utils/precio';
import { useSeo } from '../utils/seo';
import { IconoCandado } from '../components/Iconos';
import type { Direccion, MetodoEnvio, MetodoPago, Pedido } from '../types';

/** Título de paso con número grande en círculo */
function TituloPaso({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-3 text-xl font-bold">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-carbon text-lg text-white" aria-hidden="true">
        {n}
      </span>
      <span><span className="sr-only">Paso {n}: </span>{children}</span>
    </h2>
  );
}

export default function Checkout() {
  useSeo({
    titulo: 'Finalizar compra',
    descripcion: 'Método de entrega con costo visible antes de pagar y pago con Webpay, Mercado Pago o transferencia.',
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
      <div className="contenedor max-w-xl py-16 text-center">
        <p className="text-xl font-bold">No tienes productos en el carrito.</p>
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
      <div className="contenedor max-w-2xl py-10">
        <div className="tarjeta">
          <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-grafito">Pedido {pedidoTransferencia.id} creado</h1>
          <p className="mt-3 text-base">
            Transfiere <strong className="text-naranja-oscuro">{formatoCLP(pedidoTransferencia.total)}</strong> a la siguiente cuenta y sube el
            comprobante. Tu pedido quedará <strong>pendiente de validación</strong> hasta que confirmemos el pago.
          </p>
          <dl className="mt-5 space-y-2 rounded-xl bg-gris-fondo p-4 text-base">
            <div className="flex flex-wrap justify-between gap-x-3"><dt>Banco</dt><dd className="font-semibold">{DATOS_TRANSFERENCIA.banco}</dd></div>
            <div className="flex flex-wrap justify-between gap-x-3"><dt>Tipo de cuenta</dt><dd className="font-semibold">{DATOS_TRANSFERENCIA.tipoCuenta}</dd></div>
            <div className="flex flex-wrap justify-between gap-x-3"><dt>N° de cuenta</dt><dd className="font-semibold">{DATOS_TRANSFERENCIA.numeroCuenta}</dd></div>
            <div className="flex flex-wrap justify-between gap-x-3"><dt>Titular</dt><dd className="font-semibold">{DATOS_TRANSFERENCIA.titular}</dd></div>
            <div className="flex flex-wrap justify-between gap-x-3"><dt>RUT</dt><dd className="font-semibold">{DATOS_TRANSFERENCIA.rut}</dd></div>
            <div className="flex flex-wrap justify-between gap-x-3"><dt>Correo</dt><dd className="font-semibold">{DATOS_TRANSFERENCIA.email}</dd></div>
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
          {error && <p role="alert" className="mt-3 rounded-lg bg-oferta/10 p-3 text-base font-semibold text-oferta">{error}</p>}
          <button onClick={enviarComprobante} disabled={!comprobante || procesando} className="btn-primario btn-grande mt-5 w-full">
            {procesando ? 'Subiendo…' : 'Enviar comprobante'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="contenedor max-w-6xl py-6 sm:py-8">
      <h1 className="titulo-seccion">Finalizar compra</h1>
      <p className="mt-2 flex items-center gap-2 text-base text-gris-600">
        <IconoCandado className="h-5 w-5 text-verde" /> Compra segura. Revisa cada paso y paga al final.
      </p>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 space-y-6">
          {/* Datos del comprador (invitado) */}
          {!usuario && (
            <section className="tarjeta">
              <TituloPaso n={1}>Tus datos</TituloPaso>
              <p className="mb-4 mt-2 text-base text-gris-600">
                No necesitas crear cuenta. ¿Ya tienes una? <Link to="/ingresar" className="enlace">Ingresa aquí</Link>.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
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
            <TituloPaso n={usuario ? 1 : 2}>¿Cómo quieres recibirlo?</TituloPaso>
            <p className="mb-4 mt-2 text-base text-gris-600">El costo del envío se muestra aquí, antes de pagar. Sin sorpresas.</p>

            <div className="mb-4">
              <label className="etiqueta" htmlFor="chk-region">Región de destino</label>
              <select id="chk-region" value={region} onChange={(e) => setRegion(e.target.value)} className="campo sm:max-w-sm">
                {REGIONES_CHILE.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div className="space-y-3">
              {opcionesEnvio.map((op) => (
                <label
                  key={op.metodo}
                  className={`opcion ${metodoEnvio === op.metodo ? 'opcion-activa' : ''}`}
                >
                  <input
                    type="radio"
                    name="envio"
                    checked={metodoEnvio === op.metodo}
                    onChange={() => setMetodoEnvio(op.metodo)}
                    className="control-grande"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <span className="text-lg font-bold">{op.nombre}</span>
                      <span className={`text-lg font-bold ${op.costo === 0 ? 'text-verde' : 'text-grafito'}`}>
                        {op.costo === 0 ? 'Gratis' : formatoCLP(op.costo)}
                      </span>
                    </div>
                    <p className="text-base text-gris-600">{op.descripcion}</p>
                    <p className="text-base font-semibold text-verde">{op.plazoEstimado}</p>
                  </div>
                </label>
              ))}
            </div>

            {/* Dirección de despacho */}
            {metodoEnvio !== 'retiro_tienda' && (
              <div className="mt-4 border-t border-borde pt-4">
                <h3 className="mb-3 text-lg font-bold">¿A qué dirección lo enviamos?</h3>
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
                  <div className="grid gap-4 sm:grid-cols-3">
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
            <TituloPaso n={usuario ? 2 : 3}>¿Cómo quieres pagar?</TituloPaso>
            <div className="mt-4 space-y-3">
              {[
                { id: 'webpay' as const, nombre: 'Tarjeta (Webpay)', detalle: 'Débito, crédito o prepago. Pago seguro de Transbank.' },
                { id: 'mercadopago' as const, nombre: 'Mercado Pago', detalle: 'Tarjetas con cuotas o saldo de Mercado Pago.' },
                { id: 'transferencia' as const, nombre: 'Transferencia bancaria', detalle: 'Te damos los datos de la cuenta. Envías el comprobante y despachamos.' },
              ].map((mp) => (
                <label
                  key={mp.id}
                  className={`opcion ${metodoPago === mp.id ? 'opcion-activa' : ''}`}
                >
                  <input type="radio" name="pago" checked={metodoPago === mp.id} onChange={() => setMetodoPago(mp.id)} className="control-grande" />
                  <div>
                    <span className="text-lg font-bold">{mp.nombre}</span>
                    <p className="text-base text-gris-600">{mp.detalle}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Resumen lateral */}
        <aside className="lg:sticky lg:top-44 lg:w-96 lg:shrink-0">
          <div className="tarjeta">
            <h2 className="mb-3 text-xl font-bold">Resumen del pedido</h2>
            <ul className="max-h-60 space-y-2 overflow-y-auto text-base">
              {items.map((it) => (
                <li key={it.productoId} className="flex justify-between gap-2">
                  <span className="line-clamp-2">{it.cantidad} × {it.nombre}</span>
                  <span className="shrink-0 font-semibold">{formatoCLP(it.precioUnitario * it.cantidad)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 space-y-2 border-t border-borde pt-3 text-base">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatoCLP(total())}</span></div>
              <div className="flex justify-between gap-3">
                <span>Envío ({envioElegido.nombre})</span>
                <span className={costoEnvio === 0 ? 'font-semibold text-verde' : ''}>
                  {costoEnvio === 0 ? 'Gratis' : formatoCLP(costoEnvio)}
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t border-borde pt-3 text-xl font-bold">
                <span>Total a pagar</span><span className="text-2xl">{formatoCLP(totalFinal)}</span>
              </div>
            </div>
            {error && <p role="alert" className="mt-4 rounded-lg bg-oferta/10 p-3 text-base font-semibold text-oferta">{error}</p>}
            <button onClick={pagar} disabled={procesando} className="btn-primario btn-grande mt-5 w-full">
              {procesando ? 'Procesando…' : metodoPago === 'transferencia' ? 'Crear pedido' : `Pagar ${formatoCLP(totalFinal)}`}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
