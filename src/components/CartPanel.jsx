import { useEffect, useRef } from 'react';
import CartItem from './CartItem';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/formatCurrency';

const FOCUSABLE =
  'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

/**
 * Drawer lateral del carrito (Puntos 2 y 7).
 * Cierra con ✕, Escape y clic en el overlay; bloquea el scroll del body; atrapa el foco.
 */
export default function CartPanel() {
  const { isCartOpen, closeCart, lines, totalUnits, totalPrice, askToClear } = useCart();
  const panelRef = useRef(null);
  const closeBtnRef = useRef(null);

  // Bloquear scroll del body mientras el drawer está abierto
  useEffect(() => {
    if (!isCartOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isCartOpen]);

  // Foco: entra al abrir, vuelve al disparador al cerrar
  useEffect(() => {
    if (!isCartOpen) return undefined;
    const trigger = document.activeElement;
    closeBtnRef.current?.focus();
    return () => trigger?.focus?.();
  }, [isCartOpen]);

  // Escape para cerrar + focus trap con Tab
  useEffect(() => {
    if (!isCartOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') return closeCart();
      if (e.key !== 'Tab' || !panelRef.current) return;
      const items = panelRef.current.querySelectorAll(FOCUSABLE);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isCartOpen, closeCart]);

  return (
    <>
      <div
        className={`overlay ${isCartOpen ? 'overlay--visible' : ''}`}
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside
        ref={panelRef}
        className={`drawer ${isCartOpen ? 'drawer--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        aria-hidden={!isCartOpen}
        inert={isCartOpen ? undefined : ''}
      >
        <header className="drawer__header">
          <h2 id="cart-title">Tu carrito</h2>
          <button
            ref={closeBtnRef}
            type="button"
            className="btn btn--icon"
            onClick={closeCart}
            aria-label="Cerrar carrito"
          >
            ✕
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="drawer__empty">
            <p aria-hidden="true" className="drawer__empty-emoji">🧺</p>
            <p>Tu carrito está vacío.</p>
            <p className="muted">Agrega productos desde el catálogo.</p>
          </div>
        ) : (
          <ul className="drawer__list">
            {lines.map(({ producto, cantidad, subtotal }) => (
              <CartItem key={producto.id} producto={producto} cantidad={cantidad} subtotal={subtotal} />
            ))}
          </ul>
        )}

        <footer className="drawer__footer">
          <dl className="totals">
            <div className="totals__row">
              <dt>Total de unidades</dt>
              <dd data-testid="total-units">{totalUnits}</dd>
            </div>
            <div className="totals__row totals__row--grand">
              <dt>Total de la compra</dt>
              <dd data-testid="total-price">{formatCurrency(totalPrice)}</dd>
            </div>
          </dl>
          {lines.length > 0 && (
            <button type="button" className="btn btn--ghost btn--block" onClick={askToClear}>
              Vaciar carrito
            </button>
          )}
        </footer>
      </aside>
    </>
  );
}
