import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

/** Acceso al estado global del carrito (y a los toasts) desde cualquier componente. */
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}
