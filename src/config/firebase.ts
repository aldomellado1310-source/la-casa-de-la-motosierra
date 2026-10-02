// ============================================================
// Configuración de Firebase.
// Si faltan las variables de entorno, la app corre en MODO DEMO
// con datos locales (src/data/seed.ts) para poder evaluarla
// sin un proyecto Firebase configurado.
// ============================================================
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
};

/** true cuando no hay credenciales de Firebase → se usan datos locales */
export const MODO_DEMO = !firebaseConfig.apiKey || !firebaseConfig.projectId;

let app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;

if (!MODO_DEMO) {
  app = initializeApp(firebaseConfig);
  _auth = getAuth(app);
  _db = getFirestore(app);
  _storage = getStorage(app);
}

/** Instancias de Firebase — null en modo demo */
export const auth = _auth;
export const db = _db;
export const storage = _storage;

/** URL base de Cloud Functions (pagos y PDF) */
export const FUNCTIONS_URL = (import.meta.env.VITE_FUNCTIONS_URL as string | undefined) ?? '';

/** Número de WhatsApp de la tienda */
export const WHATSAPP_NUMERO = (import.meta.env.VITE_WHATSAPP_NUMERO as string | undefined) ?? '56987568465';
