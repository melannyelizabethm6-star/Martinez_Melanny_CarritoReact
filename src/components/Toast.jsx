import { useEffect, useRef } from 'react';

const ICONS = { success: '✅', warning: '⚠️', error: '⛔', info: 'ℹ️' };

/**
 * Toast individual. Se cierra solo tras `duration` ms (se pausa al pasar el mouse o enfocar),
 * se puede cerrar con ✕ y admite botones de acción (toast interactivo, Punto 6).
 */
export default function Toast({ toast, onClose }) {
  const { id, type, message, duration, actions, leaving } = toast;
  const timer = useRef(null);

  const startTimer = () => {
    clearTimeout(timer.current);
    if (duration > 0) timer.current = setTimeout(() => onClose(id), duration);
  };
  const stopTimer = () => clearTimeout(timer.current);

  useEffect(() => {
    startTimer();
    return stopTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, duration]);

  return (
    <div
      className={`toast toast--${type} ${leaving ? 'toast--leaving' : ''}`}
      role="status"
      aria-live="polite"
      onMouseEnter={stopTimer}
      onMouseLeave={startTimer}
      onFocus={stopTimer}
      onBlur={startTimer}
    >
      <span className="toast__icon" aria-hidden="true">{ICONS[type]}</span>
      <div className="toast__body">
        <p className="toast__message">{message}</p>
        {actions.length > 0 && (
          <div className="toast__actions">
            {actions.map((action) => (
              <button
                key={action.label}
                type="button"
                className={`btn btn--small btn--${action.variant ?? 'ghost'}`}
                onClick={() => {
                  action.onClick?.();
                  onClose(id); // cualquier acción cierra el toast
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <button type="button" className="toast__close" onClick={() => onClose(id)} aria-label="Cerrar notificación">
        ✕
      </button>
    </div>
  );
}
