// Servicio de usuarios para el panel admin
import { collection, getDocs } from 'firebase/firestore';
import { MODO_DEMO, db } from '../config/firebase';
import type { Usuario } from '../types';

/** Lista todos los clientes registrados (solo admin) */
export async function obtenerTodosLosUsuarios(): Promise<Usuario[]> {
  if (MODO_DEMO) {
    return [
      { uid: 'demo-cliente', nombre: 'Juan Soto', email: 'cliente@demo.cl', tipo: 'particular', direcciones: [], rol: 'cliente' },
      { uid: 'demo-empresa', nombre: 'María Vera', email: 'empresa@demo.cl', tipo: 'empresa', rut: '76.543.210-K', razonSocial: 'Forestal Río Simpson Ltda.', direcciones: [], rol: 'cliente' },
    ];
  }
  const snap = await getDocs(collection(db!, 'usuarios'));
  return snap.docs.map((d) => ({ ...(d.data() as Usuario), uid: d.id }));
}
