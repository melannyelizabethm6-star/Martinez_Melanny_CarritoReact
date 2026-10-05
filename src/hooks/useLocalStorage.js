import { useEffect, useState } from 'react';

/** useState que se persiste en localStorage (tolera JSON dañado o storage bloqueado). */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage lleno o bloqueado: la app sigue funcionando sin persistencia */
    }
  }, [key, value]);

  return [value, setValue];
}
