// Funciones PURAS del carrito (sin React, sin efectos): fáciles de probar y de leer.
// El carrito se guarda como [{ id, cantidad }]; nombre/precio/stock se leen siempre del catálogo.
//
// Cada operación devuelve { cart, status } donde status puede ser:
//   'ok'  → se aplicó tal cual
//   'max' → se corrigió al stock máximo (hay que avisar con toast)
//   'min' → cantidad inválida (< 1): el carrito NO cambia (hay que avisar con toast)
import { PRODUCTOS } from '../data/productos';

export const STATUS = { OK: 'ok', MAX: 'max', MIN: 'min' };

export const findProduct = (id) => PRODUCTOS.find((p) => p.id === id);
export const getQuantity = (cart, id) => cart.find((l) => l.id === id)?.cantidad ?? 0;

/** Agrega `qty` unidades; si la línea ya existe, SUMA (nunca duplica) y respeta el stock. */
export function addItem(cart, producto, qty) {
  if (!Number.isInteger(qty) || qty < 1) return { cart, status: STATUS.MIN };

  const current = getQuantity(cart, producto.id);
  const desired = current + qty;
  const next = Math.min(desired, producto.stock);
  const status = desired > producto.stock ? STATUS.MAX : STATUS.OK;

  if (next === current) return { cart, status: STATUS.MAX }; // ya está todo el stock en el carrito

  const updated = current
    ? cart.map((l) => (l.id === producto.id ? { ...l, cantidad: next } : l))
    : [...cart, { id: producto.id, cantidad: next }];
  return { cart: updated, status };
}

/** Fija la cantidad de una línea (escritura directa, botones + y −). */
export function updateQuantity(cart, producto, qty) {
  if (!Number.isInteger(qty) || qty < 1) return { cart, status: STATUS.MIN };

  const next = Math.min(qty, producto.stock);
  const status = qty > producto.stock ? STATUS.MAX : STATUS.OK;
  const updated = cart.map((l) => (l.id === producto.id ? { ...l, cantidad: next } : l));
  return { cart: updated, status };
}

export const removeItem = (cart, id) => cart.filter((l) => l.id !== id);

export const clearCart = () => [];

/** Convierte el carrito en líneas con datos del catálogo y subtotal = precio × cantidad. */
export function getLines(cart) {
  return cart
    .map((l) => {
      const producto = findProduct(l.id);
      return producto ? { producto, cantidad: l.cantidad, subtotal: producto.precio * l.cantidad } : null;
    })
    .filter(Boolean);
}

/** Totales: unidades (suma de cantidades) y total de la compra (suma de subtotales). */
export function getTotals(lines) {
  return lines.reduce(
    (acc, l) => ({ totalUnits: acc.totalUnits + l.cantidad, totalPrice: acc.totalPrice + l.subtotal }),
    { totalUnits: 0, totalPrice: 0 }
  );
}

/** Limpia datos guardados (localStorage manipulado o catálogo cambiado). */
export function sanitizeCart(raw) {
  if (!Array.isArray(raw)) return [];
  const seen = new Set();
  const clean = [];
  for (const l of raw) {
    const producto = findProduct(l?.id);
    if (!producto || seen.has(l.id) || !Number.isInteger(l.cantidad) || l.cantidad < 1) continue;
    seen.add(l.id);
    clean.push({ id: l.id, cantidad: Math.min(l.cantidad, producto.stock) });
  }
  return clean;
}
