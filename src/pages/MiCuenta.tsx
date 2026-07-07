// ============================================================
// Panel "Mi cuenta": datos personales, historial de pedidos,
// historial de cotizaciones y direcciones guardadas.
// ============================================================
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../stores/useAuth';
import { ETIQUETAS_ESTADO_PEDIDO, obtenerPedidosUsuario } from '../services/pedidos';
import { ETIQUETAS_ESTADO_COTIZACION, obtenerCotizacionesUsuario } from '../services/cotizaciones';
import { descargarPdfCotizacion } from '../services/pdfCotizacion';
import { REGIONES_CHILE } from '../services/envios';
import { obtenerMarcasCompatibles, obtenerModelosPorMarca } from '../services/productos';
import { formatoCLP } from '../utils/precio';
import type { Cotizacion, Pedido } from '../types';

type Pestania = 'datos' | 'maquinas' | 'pedidos' | 'cotizaciones' | 'direcciones';

export default function MiCuenta() {
  const navigate = useNavigate();
  const { usuario, salir, actualizarPerfil, agregarDireccion, eliminarDireccion, agregarMaquina, eliminarMaquina } = useAuth();
  const [pestania, setPestania] = useState<Pestania>('datos');
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);

  // Formulario de datos personales
  const [nombre, setNombre] = useState(usuario?.nombre ?? '');
  const [telefono, setTelefono] = useState(usuario?.telefono ?? '');
  const [guardado, setGuardado] = useState(false);

  // Formulario de nueva dirección
  const [nuevaDir, setNuevaDir] = useState({ alias: '', calle: '', numero: '', comuna: '', region: 'Aysén' });

  // Formulario "Mi máquina"
  const [marcasDisponibles, setMarcasDisponibles] = useState<string[]>([]);
  const [modelosDisponibles, setModelosDisponibles] = useState<string[]>([]);
  const [nuevaMaquina, setNuevaMaquina] = useState({ marca: '', modelo: '' });

  useEffect(() => {
    void obtenerMarcasCompatibles().then(setMarcasDisponibles);
  }, []);

  useEffect(() => {
    if (!nuevaMaquina.marca) {
      setModelosDisponibles([]);
      return;
    }
    void obtenerModelosPorMarca(nuevaMaquina.marca).then(setModelosDisponibles);
  }, [nuevaMaquina.marca]);

  useEffect(() => {
    if (!usuario) return;
    void obtenerPedidosUsuario(usuario.uid).then(setPedidos);
    void obtenerCotizacionesUsuario(usuario.uid).then(setCotizaciones);
  }, [usuario]);

  if (!usuario) return null; // RutaProtegida ya redirige

  const guardarDatos = async (e: React.FormEvent) => {
    e.preventDefault();
    await actualizarPerfil({ nombre, telefono });
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  };

  const crearDireccion = async (e: React.FormEvent) => {
    e.preventDefault();
    await agregarDireccion(nuevaDir);
    setNuevaDir({ alias: '', calle: '', numero: '', comuna: '', region: 'Aysén' });
  };

  const PESTANIAS: { id: Pestania; texto: string }[] = [
    { id: 'datos', texto: 'Mis datos' },
    { id: 'maquinas', texto: `Mis máquinas (${usuario.maquinas?.length ?? 0})` },
    { id: 'pedidos', texto: `Pedidos (${pedidos.length})` },
    { id: 'cotizaciones', texto: `Cotizaciones (${cotizaciones.length})` },
    { id: 'direcciones', texto: 'Direcciones' },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="titulo-seccion">Hola, {usuario.nombre.split(' ')[0]}</h1>
          <p className="text-sm text-gris-600">
            {usuario.tipo === 'empresa'
              ? `Cuenta empresa · ${usuario.razonSocial} (${usuario.rut})`
              : 'Cuenta particular'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {usuario.rol === 'admin' && (
            <button onClick={() => navigate('/admin')} className="btn-primario">
              Panel de administración
            </button>
          )}
          <button
            onClick={async () => { await salir(); navigate('/'); }}
            className="btn-secundario"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Aviso de rol para que el admin no se pierda en la vista de cliente */}
      {usuario.rol === 'admin' && (
        <p className="mb-6 rounded-lg bg-verde-badge p-3 text-sm text-verde-oscuro">
          Estás en la vista de cliente. El inventario, precios, ofertas, pedidos y cotizaciones
          se administran en el <button onClick={() => navigate('/admin')} className="font-bold underline">panel de administración</button>.
        </p>
      )}

      {/* Pestañas */}
      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-borde">
        {PESTANIAS.map((p) => (
          <button
            key={p.id}
            onClick={() => setPestania(p.id)}
            className={`shrink-0 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              pestania === p.id ? 'border-naranja text-naranja-oscuro' : 'border-transparent text-gris-600 hover:text-verde'
            }`}
          >
            {p.texto}
          </button>
        ))}
      </div>

      {/* Datos personales */}
      {pestania === 'datos' && (
        <form onSubmit={guardarDatos} className="tarjeta max-w-md space-y-3">
          <div>
            <label className="etiqueta">Nombre</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} className="campo" />
          </div>
          <div>
            <label className="etiqueta">Correo</label>
            <input value={usuario.email} disabled className="campo opacity-60" />
          </div>
          <div>
            <label className="etiqueta">Teléfono</label>
            <input value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="+56 9 …" className="campo" />
          </div>
          <button type="submit" className="btn-primario">{guardado ? '✓ Guardado' : 'Guardar cambios'}</button>
        </form>
      )}

      {/* Mis máquinas */}
      {pestania === 'maquinas' && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <p className="text-sm text-gris-600">
              Registra tus máquinas y la tienda te mostrará solo los repuestos compatibles con
              un clic, sin volver a elegir marca y modelo cada vez.
            </p>
            {(usuario.maquinas ?? []).length === 0 && (
              <div className="tarjeta py-8 text-center text-sm text-gris-600">
                Aún no registras máquinas.
              </div>
            )}
            {(usuario.maquinas ?? []).map((m) => (
              <div key={m.id} className="tarjeta flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold">{m.marca} {m.modelo || '· todos los modelos'}</p>
                  <button
                    onClick={() => {
                      const params = new URLSearchParams({ marca: m.marca });
                      if (m.modelo) params.set('modelo', m.modelo);
                      navigate(`/tienda?${params.toString()}`);
                    }}
                    className="text-sm font-semibold text-verde hover:underline"
                  >
                    Ver repuestos compatibles →
                  </button>
                </div>
                <button onClick={() => void eliminarMaquina(m.id)} className="text-xs text-red-600 hover:underline">
                  Eliminar
                </button>
              </div>
            ))}
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!nuevaMaquina.marca) return;
              await agregarMaquina({ marca: nuevaMaquina.marca, modelo: nuevaMaquina.modelo });
              setNuevaMaquina({ marca: '', modelo: '' });
            }}
            className="tarjeta space-y-3 self-start"
          >
            <h3 className="font-bold">Agregar máquina</h3>
            <div>
              <label className="etiqueta" htmlFor="maq-marca">Marca</label>
              <select
                id="maq-marca"
                value={nuevaMaquina.marca}
                onChange={(e) => setNuevaMaquina({ marca: e.target.value, modelo: '' })}
                className="campo"
                required
              >
                <option value="">Selecciona marca…</option>
                {marcasDisponibles.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="etiqueta" htmlFor="maq-modelo">Modelo</label>
              <select
                id="maq-modelo"
                value={nuevaMaquina.modelo}
                onChange={(e) => setNuevaMaquina({ ...nuevaMaquina, modelo: e.target.value })}
                className="campo"
                disabled={!nuevaMaquina.marca}
              >
                <option value="">{nuevaMaquina.marca ? 'Todos los modelos' : 'Elige una marca primero'}</option>
                {modelosDisponibles.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <button type="submit" className="btn-primario w-full">Guardar máquina</button>
          </form>
        </div>
      )}

      {/* Historial de pedidos */}
      {pestania === 'pedidos' && (
        <div className="space-y-3">
          {pedidos.length === 0 && <p className="text-sm text-gris-600">Aún no tienes pedidos.</p>}
          {pedidos.map((p) => (
            <div key={p.id} className="tarjeta">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-bold">{p.id}</span>
                  <span className="ml-3 text-xs text-gris-600">{new Date(p.fecha).toLocaleDateString('es-CL')}</span>
                </div>
                <span className="rounded-full bg-verde/10 px-3 py-1 text-xs font-semibold text-verde">
                  {ETIQUETAS_ESTADO_PEDIDO[p.estado]}
                </span>
              </div>
              <ul className="mt-2 text-sm text-grafito/80">
                {p.items.map((it) => (
                  <li key={it.productoId}>{it.cantidad}× {it.nombre}</li>
                ))}
              </ul>
              <p className="mt-2 text-right font-extrabold text-naranja-oscuro">{formatoCLP(p.total)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Historial de cotizaciones */}
      {pestania === 'cotizaciones' && (
        <div className="space-y-3">
          {cotizaciones.length === 0 && (
            <p className="text-sm text-gris-600">
              Aún no tienes cotizaciones. Arma tu carrito y solicita una desde ahí.
            </p>
          )}
          {cotizaciones.map((c) => (
            <div key={c.id} className="tarjeta">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-bold">{c.folio}</span>
                  <span className="ml-3 text-xs text-gris-600">
                    {new Date(c.fecha).toLocaleDateString('es-CL')} · válida hasta {new Date(c.validaHasta).toLocaleDateString('es-CL')}
                  </span>
                </div>
                <span className="rounded-full bg-naranja/10 px-3 py-1 text-xs font-semibold text-naranja-oscuro">
                  {ETIQUETAS_ESTADO_COTIZACION[c.estado]}
                </span>
              </div>
              <p className="mt-2 text-sm text-grafito/80">{c.items.length} ítem(s) · Total {formatoCLP(c.total)}</p>
              <button onClick={() => descargarPdfCotizacion(c)} className="btn-secundario mt-3">
                Descargar PDF
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Direcciones guardadas */}
      {pestania === 'direcciones' && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            {usuario.direcciones.length === 0 && <p className="text-sm text-gris-600">No tienes direcciones guardadas.</p>}
            {usuario.direcciones.map((d) => (
              <div key={d.id} className="tarjeta flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold">{d.alias}</p>
                  <p className="text-sm text-grafito/80">{d.calle} {d.numero}, {d.comuna}</p>
                  <p className="text-xs text-gris-600">Región de {d.region}</p>
                </div>
                <button onClick={() => eliminarDireccion(d.id)} className="text-xs text-red-600 hover:underline">
                  Eliminar
                </button>
              </div>
            ))}
          </div>
          <form onSubmit={crearDireccion} className="tarjeta space-y-3 self-start">
            <h3 className="font-bold">Agregar dirección</h3>
            <div>
              <label className="etiqueta">Alias</label>
              <input required value={nuevaDir.alias} onChange={(e) => setNuevaDir({ ...nuevaDir, alias: e.target.value })} placeholder="Casa, Taller…" className="campo" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="etiqueta">Calle</label>
                <input required value={nuevaDir.calle} onChange={(e) => setNuevaDir({ ...nuevaDir, calle: e.target.value })} className="campo" />
              </div>
              <div>
                <label className="etiqueta">Número</label>
                <input required value={nuevaDir.numero} onChange={(e) => setNuevaDir({ ...nuevaDir, numero: e.target.value })} className="campo" />
              </div>
            </div>
            <div>
              <label className="etiqueta">Comuna</label>
              <input required value={nuevaDir.comuna} onChange={(e) => setNuevaDir({ ...nuevaDir, comuna: e.target.value })} className="campo" />
            </div>
            <div>
              <label className="etiqueta">Región</label>
              <select value={nuevaDir.region} onChange={(e) => setNuevaDir({ ...nuevaDir, region: e.target.value })} className="campo">
                {REGIONES_CHILE.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <button type="submit" className="btn-primario w-full">Guardar dirección</button>
          </form>
        </div>
      )}
    </div>
  );
}
