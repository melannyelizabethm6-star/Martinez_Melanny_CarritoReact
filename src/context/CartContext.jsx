import { createContext, useCallback, useMemo, useRef, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToasts } from '../hooks/useToasts';
import {
  STATUS,
  addItem,
  clearCart as clearCartOp,
  findProduct,
  getLines,
  getQuantity,
  getTotals,
  removeItem,
  sanitizeCart,
  updateQuantity,
} from '../utils/cartOperations';
import { MSG_MAX_STOCK, MSG_MIN_CART, MSG_MIN_QTY } from '../utils/validators';

export const CartContext = createContext(null);

const STORAGE_KEY = 'tienda-palmira:carrito:v1';
const ACTION_TOAST_DURATION = 8000; // los toasts con botones duran más para dar tiempo a decidir

export function CartProvider({ children }) {
  const [stored, setStored] = useLocalStorage(STORAGE_KEY, []);
  const cart = useMemo(() => sanitizeCart(stored), [stored]);
  const { toasts, addToast, removeToast } = useToasts();
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Espejo síncrono del carrito: evita datos viejos si llegan dos eventos seguidos.
  const cartRef = useRef(cart);
  cartRef.current = cart;

  const commit = useCallback(
    (next) => {
      cartRef.current = next;
      setStored(next);
    },
    [setStored]
  );

  // ----- Avisos (toasts) reutilizables -----
  const notifyMax = useCallback(
    () => addToast({ type: 'warning', message: MSG_MAX_STOCK, dedupeKey: 'max-stock' }),
    [addToast]
  );
  const notifyMinCatalog = useCallback(
    () => addToast({ type: 'warning', message: MSG_MIN_QTY, dedupeKey: 'min-qty' }),
    [addToast]
  );
  const notifyInvalidInput = useCallback(
    () =>
      addToast({
        type: 'error',
        message: 'Solo se permiten números enteros positivos (sin letras, signos, puntos ni comas)',
        dedupeKey: 'invalid-input',
      }),
    [addToast]
  );

  // ----- Operaciones del carrito -----
  const addToCart = useCallback(
    (producto, qty) => {
      const { cart: next, status } = addItem(cartRef.current, producto, qty);
      if (status === STATUS.MIN) return notifyMinCatalog();
      commit(next);
      if (status === STATUS.MAX) return notifyMax(); // Punto 5, vía 3: agregar de nuevo
      addToast({
        type: 'success',
        message: `${producto.nombre} agregado al carrito`,
        duration: 2500,
        dedupeKey: `added-${producto.id}`,
      });
    },
    [addToast, commit, notifyMax, notifyMinCatalog]
  );

  const removeFromCart = useCallback(
    (id) => {
      const producto = findProduct(id);
      commit(removeItem(cartRef.current, id));
      if (producto) {
        addToast({ type: 'info', message: `${producto.nombre} eliminado del carrito`, duration: 2500 });
      }
    },
    [addToast, commit]
  );

  // Punto 6: toast interactivo con "Eliminar" / "Cancelar"
  const askToRemove = useCallback(
    (id) => {
      addToast({
        type: 'warning',
        message: MSG_MIN_CART,
        duration: ACTION_TOAST_DURATION,
        dedupeKey: `min-${id}`,
        actions: [
          { label: 'Eliminar', variant: 'danger', onClick: () => removeFromCart(id) },
          { label: 'Cancelar', variant: 'ghost' },
        ],
      });
    },
    [addToast, removeFromCart]
  );

  /** Escribir una cantidad en el carrito (o botones +/−): aplica stock máx. y mínimo 1. */
  const setCartQuantity = useCallback(
    (id, qty) => {
      const producto = findProduct(id);
      if (!producto) return;
      const { cart: next, status } = updateQuantity(cartRef.current, producto, qty);
      if (status === STATUS.MIN) return askToRemove(id);
      commit(next);
      if (status === STATUS.MAX) notifyMax();
    },
    [askToRemove, commit, notifyMax]
  );

  const increment = useCallback(
    (id) => setCartQuantity(id, getQuantity(cartRef.current, id) + 1),
    [setCartQuantity]
  );
  const decrement = useCallback(
    (id) => setCartQuantity(id, getQuantity(cartRef.current, id) - 1), // con 1 → 0 → toast mínimo
    [setCartQuantity]
  );

  const clearCart = useCallback(() => {
    commit(clearCartOp());
    addToast({ type: 'info', message: 'Carrito vaciado', duration: 2500 });
  }, [addToast, commit]);

  const askToClear = useCallback(() => {
    addToast({
      type: 'warning',
      message: '¿Deseas vaciar todo el carrito?',
      duration: ACTION_TOAST_DURATION,
      dedupeKey: 'clear-cart',
      actions: [
        { label: 'Vaciar', variant: 'danger', onClick: clearCart },
        { label: 'Cancelar', variant: 'ghost' },
      ],
    });
  }, [addToast, clearCart]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  // ----- Valores derivados (Punto 7) -----
  const lines = useMemo(() => getLines(cart), [cart]);
  const { totalUnits, totalPrice } = useMemo(() => getTotals(lines), [lines]);

  const value = useMemo(
    () => ({
      cart,
      lines,
      totalUnits,
      totalPrice,
      isCartOpen,
      openCart,
      closeCart,
      getInCart: (id) => getQuantity(cart, id),
      addToCart,
      removeFromCart,
      setCartQuantity,
      increment,
      decrement,
      askToRemove,
      askToClear,
      notifyMax,
      notifyMinCatalog,
      notifyInvalidInput,
      toasts,
      addToast,
      removeToast,
    }),
    [
      cart, lines, totalUnits, totalPrice, isCartOpen, openCart, closeCart, addToCart,
      removeFromCart, setCartQuantity, increment, decrement, askToRemove, askToClear,
      notifyMax, notifyMinCatalog, notifyInvalidInput, toasts, addToast, removeToast,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
