// Mensajes exactos pedidos por el reto
export const MSG_MAX_STOCK = 'Este es el máximo de producto disponible en stock';
export const MSG_MIN_QTY = 'La cantidad mínima es 1';
export const MSG_MIN_CART = 'Esta es la cantidad mínima. ¿Deseas eliminar el producto?';

// Solo dígitos (enteros positivos, sin signos, punto, coma ni "e")
export const DIGITS_ONLY = /^\d+$/;

// Teclas de control que sí se permiten en el campo
const ALLOWED_CONTROL_KEYS = new Set([
  'Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Enter',
]);
const ALLOWED_SHORTCUTS = new Set(['a', 'c', 'v', 'x', 'z']);

/**
 * ¿Debe bloquearse esta tecla? (se usa en onKeyDown con preventDefault)
 * Bloquea e, E, +, -, ., , y cualquier cosa que no sea dígito o tecla de control.
 */
export function shouldBlockKey(event) {
  const { key, ctrlKey, metaKey } = event;
  if ((ctrlKey || metaKey) && ALLOWED_SHORTCUTS.has(key.toLowerCase())) return false;
  if (ALLOWED_CONTROL_KEYS.has(key)) return false;
  if (/^\d$/.test(key)) return false;
  return true;
}

/** Limita un entero al rango [1, max] */
export const clampQuantity = (value, max) => Math.min(Math.max(value, 1), max);
