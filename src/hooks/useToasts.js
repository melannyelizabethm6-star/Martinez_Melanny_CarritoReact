import { useCallback, useRef, useState } from 'react';

const DEFAULT_DURATION = 4000; // 4 s
const EXIT_ANIMATION_MS = 250;

/**
 * Sistema de toasts propio (sin librerías).
 * - addToast({ type, message, duration, actions }) → id
 * - Auto-cierre configurable, cierre manual, apilables, con acciones (toast interactivo).
 */
export function useToasts() {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(1);

  const removeToast = useCallback((id) => {
    // 1) marca como "saliendo" para animar; 2) lo quita del DOM
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), EXIT_ANIMATION_MS);
  }, []);

  const addToast = useCallback(
    ({ type = 'info', message, duration = DEFAULT_DURATION, actions = [], dedupeKey } = {}) => {
      const id = nextId.current++;
      setToasts((prev) => {
        // Evita apilar toasts idénticos (p. ej. al escribir rápido)
        const base = dedupeKey ? prev.filter((t) => t.dedupeKey !== dedupeKey) : prev;
        return [...base, { id, type, message, duration, actions, dedupeKey, leaving: false }];
      });
      return id;
    },
    []
  );

  return { toasts, addToast, removeToast };
}
