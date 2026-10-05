import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import CartPanel from './components/CartPanel';
import ToastContainer from './components/ToastContainer';
import { PRODUCTOS } from './data/productos';

export default function App() {
  return (
    <CartProvider>
      <Navbar />
      <main className="container" id="catalogo">
        <section aria-labelledby="catalogo-title">
          <h1 id="catalogo-title" className="title">Productos típicos de la región</h1>
          <p className="muted subtitle">Elige la cantidad y agrégala a tu carrito.</p>
          <div className="grid">
            {PRODUCTOS.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
        </section>
      </main>
      <CartPanel />
      <ToastContainer />
    </CartProvider>
  );
}
