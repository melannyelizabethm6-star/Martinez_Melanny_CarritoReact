import { useEffect, useState } from 'react';
import { DIGITS_ONLY, shouldBlockKey } from '../utils/validators';

/**
 * Campo de cantidad REUTILIZABLE (catálogo y carrito). Punto 4.
 * Usa type="text" + inputMode="numeric" (NUNCA type="number": deja escribir e, +, -, .).
 *
 * Props:
 *  - value: cantidad actual (entero ≥ 1)
 *  - max: stock máximo permitido
 *  - onChange(n): se llama con una cantidad válida (1..max)
 *  - onMin(): el usuario intentó 0 → quien use el componente decide el aviso
 *  - onMax(): el usuario intentó superar el stock → se corrige a max y se avisa
 *  - onInvalidPaste(): se bloqueó un pegado inválido
 */
export default function QuantityInput({
  value,
  max,
  onChange,
  onMin,
  onMax,
  onInvalidPaste,
  label,
  id,
  disabled = false,
}) {
  // Texto que se ve en el campo: permite quedar vacío mientras se edita.
  const [draft, setDraft] = useState(String(value));

  useEffect(() => setDraft(String(value)), [value]);

  // Lógica común para escribir y pegar
  const applyNumber = (n) => {
    if (n < 1) {
      setDraft(String(value)); // 0 → conserva el valor anterior
      onMin?.();
    } else if (n > max) {
      setDraft(String(max)); // > stock → corrige al máximo
      onChange(max);
      onMax?.();
    } else {
      setDraft(String(n));
      if (n !== value) onChange(n);
    }
  };

  const handleChange = (e) => {
    // Red de seguridad (arrastrar texto, IME, autocompletar): deja solo dígitos
    const digits = e.target.value.replace(/\D/g, '');
    if (digits === '') return setDraft(''); // vacío temporal; se restaura en onBlur
    applyNumber(Number(digits));
  };

  const handleKeyDown = (e) => {
    if (shouldBlockKey(e)) e.preventDefault(); // bloquea e, E, +, -, ., , y letras
  };

  const handlePaste = (e) => {
    e.preventDefault(); // controlamos nosotros el pegado
    const text = e.clipboardData.getData('text').trim();
    if (!DIGITS_ONLY.test(text)) return onInvalidPaste?.(); // "-5", "3e2", "abc" → no se pega
    applyNumber(Number(text));
  };

  // La rueda del mouse no debe cambiar el valor: se quita el foco del campo
  const handleWheel = (e) => e.currentTarget.blur();

  const handleBlur = () => {
    if (draft === '') setDraft(String(value)); // nunca queda vacío
  };

  return (
    <input
      id={id}
      className="qty-input"
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      autoComplete="off"
      value={draft}
      disabled={disabled}
      aria-label={label}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onWheel={handleWheel}
      onBlur={handleBlur}
      onDrop={(e) => e.preventDefault()}
    />
  );
}
