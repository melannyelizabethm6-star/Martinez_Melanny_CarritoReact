import { memo, useState } from 'react';
import QuantityInput from './QuantityInput';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/formatCurrency';

// Emoji decorativo por producto (el array del catálogo se mantiene exacto)
const EMOJIS = { 1: '☕', 2: '🍯', 3: '🌽', 4: '🍫', 5: '🍬', 6: '🥃' };

function ProductCard({ producto }) {
  const { getInCart, addToCart, notifyMax, notifyMinCatalog, notifyInvalidInput } = useCart();
  const [cantidad, setCantidad] = useState(1); // Punto 3: inicia en 1

  const enCarrito = getInCart(producto.id);
  const disponible = producto.stock - enCarrito; // stock que aún se puede agregar
  const sinStock = disponible <= 0;

  const handleAdd = () => {
    addToCart(producto, cantidad);
    setCantidad(1);
  };

  return (
    <article className="card" aria-labelledby={`prod-${producto.id}`}>
      <div className="card__emoji" aria-hidden="true">{EMOJIS[producto.id]}</div>
      <h3 id={`prod-${producto.id}`} className="card__name">{producto.nombre}</h3>
      <p className="card__price">{formatCurrency(producto.precio)}</p>
      <p className={`card__stock ${sinStock ? 'card__stock--empty' : ''}`}>
        Stock disponible: <strong>{Math.max(disponible, 0)}</strong>
      </p>

      <div className="card__actions">
        <QuantityInput
          value={cantidad}
          max={producto.stock}
          onChange={setCantidad}
          onMin={notifyMinCatalog}
          onMax={notifyMax}
          onInvalidPaste={notifyInvalidInput}
          disabled={sinStock}
          label={`Cantidad de ${producto.nombre}`}
        />
        <button
          type="button"
          className="btn btn--primary"
          onClick={handleAdd}
          disabled={sinStock}
          aria-label={sinStock ? `${producto.nombre}: sin stock` : `Agregar ${producto.nombre} al carrito`}
        >
          {sinStock ? 'Sin stock' : 'Agregar'}
        </button>
      </div>
    </article>
  );
}

export default memo(ProductCard);
