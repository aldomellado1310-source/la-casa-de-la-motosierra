// ============================================================
// Estado de error reutilizable: mensaje amigable + reintento.
// Se muestra cuando una carga de datos falla (red caída,
// Firestore inaccesible) en vez de dejar un "Cargando…" eterno.
// ============================================================

interface Props {
  /** Mensaje complementario; por defecto sugiere revisar la conexión */
  mensaje?: string;
  /** Handler del botón Reintentar; si falta, no se muestra el botón */
  onReintentar?: () => void;
}

export default function EstadoError({ mensaje, onReintentar }: Props) {
  return (
    <div role="alert" className="tarjeta animar-entrada mx-auto max-w-md py-8 text-center">
      <p className="font-semibold text-grafito">No pudimos cargar la información.</p>
      <p className="mt-1 text-sm text-gris-600">
        {mensaje ?? 'Revisa tu conexión a internet e inténtalo de nuevo.'}
      </p>
      {onReintentar && (
        <button onClick={onReintentar} className="btn-secundario mt-4">
          Reintentar
        </button>
      )}
    </div>
  );
}
