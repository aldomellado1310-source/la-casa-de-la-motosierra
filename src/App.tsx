// ============================================================
// App principal: layout general + ruteo (React Router).
// Las páginas pesadas (checkout, admin) se cargan con lazy
// para aligerar la carga inicial en conexiones lentas.
// ============================================================
import { Suspense, lazy, useEffect } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import BotonWhatsApp from './components/BotonWhatsApp';
import SplashInicio from './components/SplashInicio';
import RutaProtegida from './components/RutaProtegida';
import Home from './pages/Home';
import Tienda from './pages/Tienda';
import Producto from './pages/Producto';
import Carrito from './pages/Carrito';
import { useAuth } from './stores/useAuth';
import { useCarrito } from './stores/useCarrito';
import { useSeo } from './utils/seo';

// Carga diferida de páginas menos frecuentes
const Checkout = lazy(() => import('./pages/Checkout'));
const PagoRetorno = lazy(() => import('./pages/PagoRetorno'));
const Ingresar = lazy(() => import('./pages/Ingresar'));
const Registro = lazy(() => import('./pages/Registro'));
const MiCuenta = lazy(() => import('./pages/MiCuenta'));
const CotizacionNueva = lazy(() => import('./pages/CotizacionNueva'));
const Nosotros = lazy(() => import('./pages/Nosotros'));
const PreguntasFrecuentes = lazy(() => import('./pages/PreguntasFrecuentes'));
const Admin = lazy(() => import('./pages/admin/Admin'));
const Favoritos = lazy(() => import('./pages/Favoritos'));
const Marcas = lazy(() => import('./pages/Marcas'));
const Seguimiento = lazy(() => import('./pages/Seguimiento'));
const Compatibilidad = lazy(() => import('./pages/Compatibilidad'));
const Terminos = lazy(() => import('./pages/Terminos'));
const Privacidad = lazy(() => import('./pages/Privacidad'));

/** Vuelve al inicio de la página en cada navegación */
function ScrollArriba() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

/** Página 404 con metadatos propios */
function NoEncontrada() {
  useSeo({
    titulo: 'Página no encontrada',
    descripcion: 'La dirección que buscas no existe o fue movida. Encuentra repuestos para motosierras y desbrozadoras en nuestra tienda.',
  });
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <p className="font-display text-6xl font-bold text-borde">404</p>
      <h1 className="titulo-seccion mt-2">Esta página se fue al monte</h1>
      <p className="mt-3 text-sm text-gris-600">
        La dirección que buscas no existe o fue movida. Lo que sí tenemos es el
        repuesto que andas buscando.
      </p>
      <div className="mt-6 flex justify-center gap-2">
        <Link to="/tienda" className="btn-primario">Ir a la tienda</Link>
        <Link to="/" className="btn-secundario">Volver al inicio</Link>
      </div>
    </div>
  );
}

export default function App() {
  const inicializar = useAuth((s) => s.inicializar);
  const usuario = useAuth((s) => s.usuario);
  const sincronizarCarrito = useCarrito((s) => s.sincronizarConUsuario);

  // Inicializa la sesión una sola vez
  useEffect(() => {
    inicializar();
  }, [inicializar]);

  // Sincroniza el carrito con Firestore al cambiar la sesión
  useEffect(() => {
    void sincronizarCarrito(usuario?.uid ?? null);
  }, [usuario?.uid, sincronizarCarrito]);

  return (
    <div className="flex min-h-screen flex-col">
      <SplashInicio />
      <ScrollArriba />
      <Header />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="flex min-h-[40vh] items-center justify-center text-verde">Cargando…</div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tienda" element={<Tienda />} />
            <Route path="/producto/:id" element={<Producto />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/favoritos" element={<Favoritos />} />
            <Route path="/marcas" element={<Marcas />} />
            <Route path="/seguimiento" element={<Seguimiento />} />
            <Route path="/compatibilidad" element={<Compatibilidad />} />
            <Route path="/terminos" element={<Terminos />} />
            <Route path="/privacidad" element={<Privacidad />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/pago/retorno" element={<PagoRetorno />} />
            <Route path="/ingresar" element={<Ingresar />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/cotizaciones/nueva" element={<CotizacionNueva />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/preguntas-frecuentes" element={<PreguntasFrecuentes />} />
            <Route
              path="/mi-cuenta"
              element={
                <RutaProtegida>
                  <MiCuenta />
                </RutaProtegida>
              }
            />
            <Route
              path="/admin"
              element={
                <RutaProtegida soloAdmin>
                  <Admin />
                </RutaProtegida>
              }
            />
            <Route path="*" element={<NoEncontrada />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <BotonWhatsApp />
    </div>
  );
}
