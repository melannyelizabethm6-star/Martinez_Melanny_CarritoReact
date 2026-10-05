import { memo } from 'react';
import QuantityInput from './QuantityInput';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/formatCurrency';

function CartItem({ producto, cantidad, subtotal }) {
  const {
    increment,
    decrement,
    setCartQuantity,
    askToRemove,
    removeFromCart,
    notifyMax,
    notifyInvalidInput,
  } = useCart();

  return (
    <li className="cart-item">
      <div className="cart-item__info">
        <p className="cart-item__name">{producto.nombre}</p>
        <p className="cart-item__unit">{formatCurrency(producto.precio)} c/u</p>
      </div>

      <div className="cart-item__qty">
        <button
          type="button"
          className="btn btn--icon"
          onClick={() => decrement(producto.id)}
          aria-label={`Disminuir cantidad de ${producto.nombre}`}
        >
          −
        </button>
        <QuantityInput
          value={cantidad}
          max={producto.stock}
          onChange={(n) => setCartQuantity(producto.id, n)}
          onMin={() => askToRemove(producto.id)} // escribir 0 → toast con opción de eliminar
          onMax={notifyMax}
          onInvalidPaste={notifyInvalidInput}
          label={`Cantidad en el carrito de ${producto.nombre}`}
        />
        <button
          type="button"
          className="btn btn--icon"
          onClick={() => increment(producto.id)}
          aria-label={`Aumentar cantidad de ${producto.nombre}`}
        >
          +
        </button>
      </div>

      <p className="cart-item__subtotal" aria-label={`Subtotal de ${producto.nombre}`}>
        {formatCurrency(subtotal)}
      </p>

      <button
        type="button"
        className="btn btn--icon btn--danger"
        onClick={() => removeFromCart(producto.id)}
        aria-label={`Eliminar ${producto.nombre} del carrito`}
        title="Eliminar"
      >
        🗑️
      </button>
    </li>
  );
}

export default memo(CartItem);
