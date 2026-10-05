// Pruebas automáticas: los 12 casos del instructor + persistencia.
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../App';
import { MSG_MAX_STOCK, MSG_MIN_CART, MSG_MIN_QTY } from '../utils/validators';

const norm = (text) => text.replace(/\s/g, ' ');

const setup = () => ({ user: userEvent.setup(), ...render(<App />) });

const catalogInput = (nombre) => screen.getByLabelText(`Cantidad de ${nombre}`);
const cartInput = (nombre) => screen.getByLabelText(`Cantidad en el carrito de ${nombre}`);
const addButton = (nombre) =>
  screen.getByRole('button', { name: new RegExp(`(Agregar ${nombre} al carrito|${nombre}: sin stock)`) });

async function add(user, nombre, qty = 1) {
  const input = catalogInput(nombre);
  await user.clear(input);
  await user.type(input, String(qty));
  await user.click(addButton(nombre));
}

const openCart = (user) => user.click(screen.getByRole('button', { name: /Abrir carrito/ }));

const CAFE = 'Café de Huila 500 g';
const PANELA = 'Panela orgánica 1 kg';
const AREPA = 'Arepa de choclo x6';
const CHOCOLATE = 'Chocolate de mesa';

describe('Casos de prueba del instructor', () => {
  it('1. Las teclas e, E, +, -, ., , no escriben nada', async () => {
    const { user } = setup();
    const input = catalogInput(CAFE);
    await user.click(input);
    await user.keyboard('eE+-.,');
    expect(input).toHaveValue('1');
    expect(input).toHaveAttribute('type', 'text'); // nunca type="number"
  });

  it('2. Pegar -5, 3e2 o abc no se pega', async () => {
    const { user } = setup();
    const input = catalogInput(CAFE);
    for (const text of ['-5', '3e2', 'abc']) {
      await user.click(input);
      await user.paste(text);
      expect(input).toHaveValue('1');
    }
  });

  it('3. Escribir 0 en el catálogo conserva el valor y muestra toast de mínimo 1', async () => {
    const { user } = setup();
    const input = catalogInput(CAFE);
    await user.clear(input);
    await user.type(input, '0');
    expect(input).toHaveValue('1');
    expect(await screen.findByText(MSG_MIN_QTY)).toBeInTheDocument();
  });

  it('4. Escribir 0 en el carrito no cambia la cantidad y ofrece eliminar', async () => {
    const { user } = setup();
    await add(user, CAFE, 2);
    await openCart(user);
    const input = cartInput(CAFE);
    await user.clear(input);
    await user.type(input, '0');
    expect(input).toHaveValue('2');
    expect(await screen.findByText(MSG_MIN_CART)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Eliminar' })).toBeInTheDocument();
  });

  it('5. Escribir 999 con stock 8 corrige a 8 y muestra el toast de máximo', async () => {
    const { user } = setup();
    const input = catalogInput(CAFE);
    await user.clear(input);
    await user.type(input, '999');
    expect(input).toHaveValue('8');
    expect(await screen.findByText(MSG_MAX_STOCK)).toBeInTheDocument();
  });

  it('6. Panela (stock 3): agregar 2 y 2 más queda en 3 con toast', async () => {
    const { user } = setup();
    await add(user, PANELA, 2);
    await add(user, PANELA, 2);
    expect(await screen.findByText(MSG_MAX_STOCK)).toBeInTheDocument();
    expect(screen.getByTestId('cart-badge')).toHaveTextContent('3');
    await openCart(user);
    expect(cartInput(PANELA)).toHaveValue('3');
  });

  it('7. En el carrito, + con cantidad = stock no sube y muestra toast', async () => {
    const { user } = setup();
    await add(user, CAFE, 8);
    await openCart(user);
    await user.click(screen.getByRole('button', { name: `Aumentar cantidad de ${CAFE}` }));
    expect(cartInput(CAFE)).toHaveValue('8');
    expect(await screen.findByText(MSG_MAX_STOCK)).toBeInTheDocument();
  });

  it('8. En el carrito, − con cantidad 1 pide confirmar; al confirmar elimina y recalcula', async () => {
    const { user } = setup();
    await add(user, CAFE, 1);
    await openCart(user);
    await user.click(screen.getByRole('button', { name: `Disminuir cantidad de ${CAFE}` }));
    expect(await screen.findByText(MSG_MIN_CART)).toBeInTheDocument();
    expect(cartInput(CAFE)).toHaveValue('1'); // no baja a 0
    await user.click(screen.getByRole('button', { name: 'Eliminar' }));
    expect(screen.queryByLabelText(`Cantidad en el carrito de ${CAFE}`)).not.toBeInTheDocument();
    expect(norm(screen.getByTestId('total-price').textContent)).toBe('$ 0');
    expect(screen.queryByTestId('cart-badge')).not.toBeInTheDocument();
  });

  it('9. Agregar dos veces el mismo producto deja una sola línea con cantidades sumadas', async () => {
    const { user } = setup();
    await add(user, CAFE, 2);
    await add(user, CAFE, 3);
    await openCart(user);
    const list = screen.getByRole('list');
    expect(within(list).getAllByRole('listitem')).toHaveLength(1);
    expect(cartInput(CAFE)).toHaveValue('5');
  });

  it('10. Café×2, Panela×3, Arepa×1 → subtotales y total $98.400', async () => {
    const { user } = setup();
    await add(user, CAFE, 2);
    await add(user, PANELA, 3);
    await add(user, AREPA, 1);
    await openCart(user);
    expect(norm(screen.getByLabelText(`Subtotal de ${CAFE}`).textContent)).toBe('$ 57.000');
    expect(norm(screen.getByLabelText(`Subtotal de ${PANELA}`).textContent)).toBe('$ 29.400');
    expect(norm(screen.getByLabelText(`Subtotal de ${AREPA}`).textContent)).toBe('$ 12.000');
    expect(norm(screen.getByTestId('total-price').textContent)).toBe('$ 98.400');
    expect(screen.getByTestId('total-units')).toHaveTextContent('6');
  });

  it('11. Al agregar todo el stock el botón queda deshabilitado ("Sin stock")', async () => {
    const { user } = setup();
    await add(user, CHOCOLATE, 1);
    const button = addButton(CHOCOLATE);
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Sin stock');
  });

  it('12. El badge del navbar muestra la suma de unidades (no de líneas)', async () => {
    const { user } = setup();
    expect(screen.queryByTestId('cart-badge')).not.toBeInTheDocument(); // oculto con 0
    await add(user, CAFE, 2);
    await add(user, AREPA, 4);
    expect(screen.getByTestId('cart-badge')).toHaveTextContent('6');
  });
});

describe('Extras', () => {
  it('el drawer se cierra con Escape', async () => {
    const { user } = setup();
    await openCart(user);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument(); // aria-hidden al cerrarse
  });

  it('persiste el carrito en localStorage', async () => {
    const first = setup();
    await add(first.user, CAFE, 3);
    first.unmount();
    render(<App />);
    expect(screen.getByTestId('cart-badge')).toHaveTextContent('3');
  });

  it('no usa alert, confirm ni prompt', async () => {
    const calls = [];
    const original = { a: window.alert, c: window.confirm, p: window.prompt };
    window.alert = window.confirm = window.prompt = () => calls.push(1);
    const { user } = setup();
    await add(user, CAFE, 1);
    await openCart(user);
    await user.click(screen.getByRole('button', { name: `Disminuir cantidad de ${CAFE}` }));
    expect(calls).toHaveLength(0);
    Object.assign(window, { alert: original.a, confirm: original.c, prompt: original.p });
  });
});
