import Toast from './Toast';
import { useCart } from '../hooks/useCart';

/** Contenedor fijo (arriba a la derecha) donde se apilan los toasts. */
export default function ToastContainer() {
  const { toasts, removeToast } = useCart();

  return (
    <div className="toast-container" aria-label="Notificaciones">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  );
}
