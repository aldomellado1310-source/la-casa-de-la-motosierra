// ============================================================
// Admin > Resumen: el pulso del negocio en una pantalla.
// Ventas del mes, pedidos por atender, stock crítico y
// cotizaciones por vencer.
// ============================================================
import { useEffect, useState } from 'react';
import { obtenerTodosLosPedidos } from '../../services/pedidos';
import { obtenerTodasLasCotizaciones } from '../../services/cotizaciones';
import {
  invalidarCacheProductos, marcarAvisoNotificado, obtenerAvisosPendientes, obtenerProductos,
} from '../../services/productos';
import { formatoCLP } from '../../utils/precio';
import BadgeStock from '../../components/BadgeStock';
import EstadoError from '../../components/EstadoError';
import type { AvisoStock, Cotizacion, Pedido, Producto } from '../../types';

/** Estados que cuentan como venta concretada */
const ESTADOS_VENTA = ['pagado', 'preparando', 'despachado', 'listo_retiro', 'entregado'];
/** Umbral de stock crítico */
const UMBRAL_CRITICO = 5;
/** Días de anticipación para avisar cotizaciones por vencer */
const DIAS_VENCIMIENTO = 7;

interface Props {
  /** Navega a otra pestaña del panel */
  irA: (pestania: 'productos' | 'pedidos' | 'cotizaciones') => void;
}

export default function AdminResumen({ irA }: Props) {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [avisos, setAvisos] = useState<AvisoStock[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  const cargar = () => {
    setCargando(true);
    setError(false);
    invalidarCacheProductos();
    Promise.all([
      obtenerTodosLosPedidos(),
      obtenerTodasLasCotizaciones(),
      obtenerProductos(true),
      obtenerAvisosPendientes(),
    ])
      .then(([ps, cs, prods, avs]) => {
        setPedidos(ps);
        setCotizaciones(cs);
        setProductos(prods);
        setAvisos(avs);
      })
      .catch(() => setError(true))
      .finally(() => setCargando(false));
  };
  useEffect(cargar, []);

  const marcarAvisado = async (id: string) => {
    await marcarAvisoNotificado(id);
    setAvisos((prev) => prev.filter((a) => a.id !== id));
  };

  if (error) {
    return <EstadoError onReintentar={cargar} />;
  }
  if (cargando) {
    return <p className="text-sm text-gris-600">Cargando resumen…</p>;
  }

  const ahora = new Date();
  const esDelMes = (iso: string) => {
    const f = new Date(iso);
    return f.getFullYear() === ahora.getFullYear() && f.getMonth() === ahora.getMonth();
  };

  const ventasMes = pedidos.filter((p) => ESTADOS_VENTA.includes(p.estado) && esDelMes(p.fecha));
  const totalVentasMes = ventasMes.reduce((acc, p) => acc + p.total, 0);
  const porValidar = pedidos.filter((p) => p.estado === 'pendiente_validacion');
  const porPreparar = pedidos.filter((p) => p.estado === 'pagado');
  const stockCritico = productos
    .filter((p) => p.activo && p.stock <= UMBRAL_CRITICO)
    .sort((a, b) => a.stock - b.stock);
  const limiteVencimiento = new Date(ahora.getTime() + DIAS_VENCIMIENTO * 24 * 60 * 60 * 1000);
  const cotizacionesPorVencer = cotizaciones.filter(
    (c) => c.estado === 'enviada' && new Date(c.validaHasta) <= limiteVencimiento,
  );

  const TARJETAS = [
    {
      titulo: 'Ventas del mes',
      valor: formatoCLP(totalVentasMes),
      detalle: `${ventasMes.length} pedido(s) concretado(s)`,
      accion: () => irA('pedidos'),
      alerta: false,
    },
    {
      titulo: 'Por validar (transferencias)',
      valor: String(porValidar.length),
      detalle: porValidar.length > 0 ? 'Revisa los comprobantes' : 'Nada pendiente',
      accion: () => irA('pedidos'),
      alerta: porValidar.length > 0,
    },
    {
      titulo: 'Por preparar',
      valor: String(porPreparar.length),
      detalle: porPreparar.length > 0 ? 'Pagados, listos para armar' : 'Nada pendiente',
      accion: () => irA('pedidos'),
      alerta: porPreparar.length > 0,
    },
    {
      titulo: 'Stock crítico',
      valor: String(stockCritico.length),
      detalle: `${UMBRAL_CRITICO} unidades o menos`,
      accion: () => irA('productos'),
      alerta: stockCritico.some((p) => p.stock === 0),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Indicadores principales */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {TARJETAS.map((t) => (
          <button
            key={t.titulo}
            onClick={t.accion}
            className={`tarjeta text-left transition-colors hover:border-verde ${
              t.alerta ? 'border-naranja/60 bg-naranja/5' : ''
            }`}
          >
            <p className="text-xs font-bold uppercase tracking-wide text-gris-600">{t.titulo}</p>
            <p className="mt-1 font-display text-3xl font-bold text-grafito">{t.valor}</p>
            <p className={`mt-0.5 text-xs ${t.alerta ? 'font-semibold text-naranja-oscuro' : 'text-gris-600'}`}>
              {t.detalle}
            </p>
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Stock crítico */}
        <section className="tarjeta">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold">Stock crítico</h2>
            <button onClick={() => irA('productos')} className="text-sm font-semibold text-verde hover:underline">
              Gestionar →
            </button>
          </div>
          {stockCritico.length === 0 ? (
            <p className="text-sm text-gris-600">Todo el inventario está sobre {UMBRAL_CRITICO} unidades. ✓</p>
          ) : (
            <ul className="divide-y divide-borde">
              {stockCritico.slice(0, 6).map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <span className="min-w-0">
                    <span className="line-clamp-1 font-semibold">{p.nombre}</span>
                    <span className="text-xs text-gris-600">SKU {p.sku}</span>
                  </span>
                  <BadgeStock producto={p} compacto />
                </li>
              ))}
              {stockCritico.length > 6 && (
                <li className="pt-2 text-xs text-gris-600">y {stockCritico.length - 6} más…</li>
              )}
            </ul>
          )}
        </section>

        {/* Avisos "cuando llegue stock" pendientes */}
        <section className="tarjeta">
          <h2 className="mb-3 font-bold">Avisos de stock pendientes</h2>
          {avisos.length === 0 ? (
            <p className="text-sm text-gris-600">
              Nadie espera aviso de reposición. Los clientes que usan “Avísame cuando llegue” aparecen aquí.
            </p>
          ) : (
            <ul className="divide-y divide-borde">
              {avisos.map((a) => {
                const producto = productos.find((p) => p.id === a.productoId);
                const disponible = (producto?.stock ?? 0) > 0;
                return (
                  <li key={a.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                    <span className="min-w-0">
                      <span className="font-mono text-xs font-bold">{a.sku}</span>
                      <a href={`mailto:${a.email}`} className="block text-xs text-verde hover:underline">{a.email}</a>
                      {disponible && (
                        <span className="mt-0.5 inline-block rounded-full bg-verde-badge px-2 py-0.5 text-[10px] font-bold text-verde-oscuro">
                          Ya hay stock — avisar
                        </span>
                      )}
                    </span>
                    <button
                      onClick={() => void marcarAvisado(a.id)}
                      className="shrink-0 text-xs font-semibold text-verde hover:underline"
                    >
                      Marcar avisado
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Cotizaciones por vencer */}
        <section className="tarjeta">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold">Cotizaciones por vencer</h2>
            <button onClick={() => irA('cotizaciones')} className="text-sm font-semibold text-verde hover:underline">
              Gestionar →
            </button>
          </div>
          {cotizacionesPorVencer.length === 0 ? (
            <p className="text-sm text-gris-600">
              Ninguna cotización enviada vence en los próximos {DIAS_VENCIMIENTO} días.
            </p>
          ) : (
            <ul className="divide-y divide-borde">
              {cotizacionesPorVencer.slice(0, 6).map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <span>
                    <span className="font-mono text-xs font-bold">{c.folio}</span>
                    <span className="block text-xs text-gris-600">{c.razonSocial ?? c.nombreCliente}</span>
                  </span>
                  <span className="text-right">
                    <span className="block font-semibold">{formatoCLP(c.total)}</span>
                    <span className="text-xs text-naranja-oscuro">
                      vence {new Date(c.validaHasta).toLocaleDateString('es-CL')}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
