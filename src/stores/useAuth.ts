// ============================================================
// Store de sesión (Zustand): Firebase Auth + perfil Firestore.
// En MODO DEMO ofrece un login simulado (cliente y admin) para
// poder recorrer todos los flujos sin credenciales.
// ============================================================
import { create } from 'zustand';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { MODO_DEMO, auth, db } from '../config/firebase';
import type { Direccion, MaquinaCliente, Usuario } from '../types';

interface EstadoAuth {
  usuario: Usuario | null;
  cargando: boolean;
  /** Inicializa el listener de sesión (llamar una vez en App) */
  inicializar: () => void;
  registrar: (datos: {
    nombre: string;
    email: string;
    password: string;
    tipo: 'particular' | 'empresa';
    rut?: string;
    razonSocial?: string;
  }) => Promise<void>;
  ingresar: (email: string, password: string) => Promise<void>;
  ingresarConGoogle: () => Promise<void>;
  salir: () => Promise<void>;
  actualizarPerfil: (datos: Partial<Usuario>) => Promise<void>;
  agregarDireccion: (dir: Omit<Direccion, 'id'>) => Promise<void>;
  eliminarDireccion: (id: string) => Promise<void>;
  agregarMaquina: (maquina: Omit<MaquinaCliente, 'id'>) => Promise<void>;
  eliminarMaquina: (id: string) => Promise<void>;
}

/** Usuarios simulados del modo demo */
const DEMO_USUARIOS: Record<string, { password: string; usuario: Usuario }> = {
  'cliente@demo.cl': {
    password: 'demo1234',
    usuario: {
      uid: 'demo-cliente', nombre: 'Juan Soto', email: 'cliente@demo.cl',
      tipo: 'particular', direcciones: [], rol: 'cliente',
    },
  },
  'empresa@demo.cl': {
    password: 'demo1234',
    usuario: {
      uid: 'demo-empresa', nombre: 'María Vera', email: 'empresa@demo.cl',
      tipo: 'empresa', rut: '76.543.210-K', razonSocial: 'Forestal Río Simpson Ltda.',
      direcciones: [], rol: 'cliente',
    },
  },
  'admin@demo.cl': {
    password: 'demo1234',
    usuario: {
      uid: 'demo-admin', nombre: 'Administración', email: 'admin@demo.cl',
      tipo: 'particular', direcciones: [], rol: 'admin',
    },
  },
};

/** Carga (o crea) el perfil Firestore de un usuario autenticado */
async function cargarPerfil(uid: string, datosBase: Partial<Usuario>): Promise<Usuario> {
  const refPerfil = doc(db!, 'usuarios', uid);
  const snap = await getDoc(refPerfil);
  if (snap.exists()) {
    return { ...(snap.data() as Usuario), uid };
  }
  const nuevo: Usuario = {
    uid,
    nombre: datosBase.nombre ?? '',
    email: datosBase.email ?? '',
    tipo: datosBase.tipo ?? 'particular',
    rut: datosBase.rut,
    razonSocial: datosBase.razonSocial,
    direcciones: [],
    rol: 'cliente',
  };
  const { uid: _uid, ...sinUid } = nuevo;
  await setDoc(refPerfil, sinUid);
  return nuevo;
}

export const useAuth = create<EstadoAuth>((set, get) => ({
  usuario: null,
  cargando: true,

  inicializar: () => {
    if (MODO_DEMO) {
      // Restaurar sesión demo desde localStorage
      const guardado = localStorage.getItem('demo-sesion');
      set({ usuario: guardado ? (JSON.parse(guardado) as Usuario) : null, cargando: false });
      return;
    }
    onAuthStateChanged(auth!, async (fbUser) => {
      if (!fbUser) {
        set({ usuario: null, cargando: false });
        return;
      }
      const perfil = await cargarPerfil(fbUser.uid, {
        nombre: fbUser.displayName ?? '',
        email: fbUser.email ?? '',
      });
      set({ usuario: perfil, cargando: false });
    });
  },

  registrar: async ({ nombre, email, password, tipo, rut, razonSocial }) => {
    if (MODO_DEMO) {
      const usuario: Usuario = {
        uid: `demo-${Date.now()}`, nombre, email, tipo, rut, razonSocial,
        direcciones: [], rol: 'cliente',
      };
      localStorage.setItem('demo-sesion', JSON.stringify(usuario));
      set({ usuario });
      return;
    }
    const cred = await createUserWithEmailAndPassword(auth!, email, password);
    await updateProfile(cred.user, { displayName: nombre });
    const perfil = await cargarPerfil(cred.user.uid, { nombre, email, tipo, rut, razonSocial });
    // Si el perfil ya existía no traería tipo empresa: forzamos los datos del registro
    if (perfil.tipo !== tipo || perfil.rut !== rut) {
      await updateDoc(doc(db!, 'usuarios', cred.user.uid), { tipo, rut: rut ?? null, razonSocial: razonSocial ?? null });
      perfil.tipo = tipo; perfil.rut = rut; perfil.razonSocial = razonSocial;
    }
    set({ usuario: perfil });
  },

  ingresar: async (email, password) => {
    if (MODO_DEMO) {
      const demo = DEMO_USUARIOS[email.toLowerCase()];
      if (!demo || demo.password !== password) {
        throw new Error('Credenciales inválidas. En modo demo usa cliente@demo.cl / empresa@demo.cl / admin@demo.cl con clave demo1234.');
      }
      localStorage.setItem('demo-sesion', JSON.stringify(demo.usuario));
      set({ usuario: demo.usuario });
      return;
    }
    await signInWithEmailAndPassword(auth!, email, password);
  },

  ingresarConGoogle: async () => {
    if (MODO_DEMO) {
      const usuario = DEMO_USUARIOS['cliente@demo.cl'].usuario;
      localStorage.setItem('demo-sesion', JSON.stringify(usuario));
      set({ usuario });
      return;
    }
    await signInWithPopup(auth!, new GoogleAuthProvider());
  },

  salir: async () => {
    if (MODO_DEMO) {
      localStorage.removeItem('demo-sesion');
      set({ usuario: null });
      return;
    }
    await signOut(auth!);
    set({ usuario: null });
  },

  actualizarPerfil: async (datos) => {
    const actual = get().usuario;
    if (!actual) return;
    const actualizado = { ...actual, ...datos };
    if (MODO_DEMO) {
      localStorage.setItem('demo-sesion', JSON.stringify(actualizado));
      set({ usuario: actualizado });
      return;
    }
    const { uid: _uid, ...sinUid } = actualizado;
    await updateDoc(doc(db!, 'usuarios', actual.uid), sinUid as Record<string, unknown>);
    set({ usuario: actualizado });
  },

  agregarDireccion: async (dir) => {
    const actual = get().usuario;
    if (!actual) return;
    const nueva: Direccion = { ...dir, id: `dir-${Date.now()}` };
    await get().actualizarPerfil({ direcciones: [...actual.direcciones, nueva] });
  },

  eliminarDireccion: async (id) => {
    const actual = get().usuario;
    if (!actual) return;
    await get().actualizarPerfil({ direcciones: actual.direcciones.filter((d) => d.id !== id) });
  },

  agregarMaquina: async (maquina) => {
    const actual = get().usuario;
    if (!actual) return;
    const nueva: MaquinaCliente = { ...maquina, id: `maq-${Date.now()}` };
    await get().actualizarPerfil({ maquinas: [...(actual.maquinas ?? []), nueva] });
  },

  eliminarMaquina: async (id) => {
    const actual = get().usuario;
    if (!actual) return;
    await get().actualizarPerfil({ maquinas: (actual.maquinas ?? []).filter((m) => m.id !== id) });
  },
}));
