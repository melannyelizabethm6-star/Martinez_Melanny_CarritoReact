// Formato de moneda COP, ej.: "$ 28.500"
const formatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const formatCurrency = (value) => formatter.format(value);
