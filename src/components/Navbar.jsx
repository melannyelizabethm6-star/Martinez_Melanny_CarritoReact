import { useCart } from '../hooks/useCart';

/** Punto 2: navbar fija, nombre a la izquierda y carrito con contador a la derecha. */
export default function Navbar() {
  const { totalUnits, openCart, isCartOpen } = useCart();

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <a className="navbar__brand" href="#catalogo">
          <span aria-hidden="true">🛒</span> TIENDA PALMIRA
        </a>

        <button
          type="button"
          className="navbar__cart"
          onClick={openCart}
          aria-label={`Abrir carrito, ${totalUnits} ${totalUnits === 1 ? 'unidad' : 'unidades'}`}
          aria-haspopup="dialog"
          aria-expanded={isCartOpen}
        >
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor"
               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
          </svg>
          {/* aria-live anuncia los cambios; key reinicia la animación "pulse" en cada cambio */}
          <span aria-live="polite" aria-atomic="true">
            {totalUnits > 0 && (
              <span key={totalUnits} className="navbar__badge" data-testid="cart-badge">
                {totalUnits}
              </span>
            )}
          </span>
        </button>
      </div>
    </header>
  );
}
