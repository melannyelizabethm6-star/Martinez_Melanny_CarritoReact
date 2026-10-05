# 🛒 TIENDA PALMIRA — Carrito de Compras

Reto práctico **React — Carrito de Compras con Validaciones de Stock**
SENA · Centro de Biotecnología Industrial (CBI Palmira) · Desarrollo Front-End con React
Instructor: Daniel Alfonso Martínez Payán

| | |
|---|---|
| **Aprendiz** | [Melanny Elizabeth Martinez Delgado] |
| **Ficha** | [3409924] |
| **Tecnología usada** | ☑ React 18 + Vite · JavaScript (ES2022) · CSS puro |
| **Repositorio público** | [ENLACE AL REPOSITORIO: https://github.com/TU_USUARIO/Apellido_Nombre_CarritoReact] |
| **Despliegue (opcional)** | [ENLACE] |

---

## 🚀 Instalar y ejecutar

Requisitos: Node.js 18 o superior.

```bash
git clone https://github.com/TU_USUARIO/Apellido_Nombre_CarritoReact.git
cd Apellido_Nombre_CarritoReact
npm install
npm run dev        # abre http://localhost:5173
```

Otros comandos:

```bash
npm run build      # compilación de producción
npm run preview    # sirve la compilación
npm test           # 15 pruebas automáticas (los 12 casos del instructor + extras)
```

## ✨ Qué hace

- **Navbar fija** con el nombre a la izquierda y el carrito a la derecha con contador de **unidades** (se oculta en 0).
- **Drawer lateral** del carrito: cierra con ✕, `Esc` o clic fuera; bloquea el scroll y atrapa el foco.
- **Catálogo** desde un array JSON en el frontend (`src/data/productos.js`), sin API ni base de datos.
- **Agregar** suma a la línea existente (nunca duplica) y se deshabilita con "Sin stock".
- **Campo de cantidad** reutilizable (`QuantityInput`): bloquea `e E + - . ,` y letras, pegado inválido, `0`, negativos y la rueda del mouse. Usa `type="text"` + `inputMode="numeric"`, nunca `type="number"`.
- **Stock máximo** en las 3 vías (escribir, botón `+`, agregar de nuevo) con el toast *"Este es el máximo de producto disponible en stock"*.
- **Mínimo 1**: con cantidad 1, `−` o escribir `0` muestran un toast interactivo con **Eliminar / Cancelar**. También hay botón 🗑️ directo.
- **Subtotales, total de unidades y total de la compra** en COP con `Intl.NumberFormat('es-CO')`.
- **Toasts propios** (sin librerías): 4 tipos, auto-cierre de 4 s (configurable), botón ✕, animación, apilables y accesibles (`role="status"`, `aria-live="polite"`).
- **Extras de desempate**: persistencia en `localStorage`, diseño mobile-first, animaciones sutiles (badge con pulse, hover, drawer), accesibilidad (aria-labels, `:focus-visible`, focus trap, `role="dialog"`), componentes reutilizables y pruebas automáticas.

## 🗂️ Estructura

```
src/
├── components/   Navbar, ProductCard, CartPanel, CartItem, QuantityInput, Toast, ToastContainer
├── context/      CartContext.jsx      (estado global del carrito)
├── hooks/        useCart, useToasts, useLocalStorage
├── data/         productos.js         (array JSON del reto)
├── utils/        formatCurrency, validators, cartOperations (funciones puras)
├── styles/       App.css
└── test/         carrito.test.jsx     (12 casos del instructor + extras)
```

## ✅ Casos de prueba del instructor

Todos cubiertos en `src/test/carrito.test.jsx` (`npm test`). Para verificarlos a mano:

| # | Cómo probarlo | Resultado esperado |
|---|---|---|
| 1 | Teclear `e E + - . ,` en cualquier campo de cantidad | No escribe nada |
| 2 | Pegar `-5`, `3e2`, `abc` | No se pega |
| 3 | Catálogo: borrar y escribir `0` | Vuelve al valor anterior + toast "cantidad mínima" |
| 4 | Carrito: borrar y escribir `0` | No cambia + toast con Eliminar/Cancelar |
| 5 | Café (stock 8): escribir `999` | Queda en 8 + toast de máximo |
| 6 | Panela (stock 3): agregar 2 y luego 2 | Queda en 3 + toast de máximo |
| 7 | Carrito: `+` con cantidad = stock | No sube + toast de máximo |
| 8 | Carrito: `−` con cantidad 1 → Eliminar | Se elimina y el total se recalcula |
| 9 | Agregar el mismo producto dos veces | Una sola línea con cantidades sumadas |
| 10 | Café ×2, Panela ×3, Arepa ×1 | $ 57.000 · $ 29.400 · $ 12.000 · Total **$ 98.400** |
| 11 | Chocolate ×1 | Botón "Sin stock" deshabilitado |
| 12 | Agregar productos | Badge = suma de unidades |

## 📸 Capturas de evidencia

Guarda las capturas en la carpeta `evidencias/` con estos nombres:

| # | Funcionalidad | Captura (ruta) | ¿Funciona? |
|---|---|---|---|
| 1 | Navbar e ícono con contador | `./evidencias/01-navbar.png` | Sí |
| 2 | Agregar producto desde el catálogo | `./evidencias/02-agregar.png` | Sí |
| 3 | Bloqueo de la tecla "e" y de negativos / 0 | `./evidencias/03-validaciones.png` | Sí |
| 4 | Toast de stock máximo | `./evidencias/04-toast-maximo.png` | Sí |
| 5 | Toast de cantidad mínima con opción de eliminar | `./evidencias/05-toast-minimo.png` | Sí |
| 6 | Subtotales y total con varios productos | `./evidencias/06-totales.png` | Sí |
| 7 | Producto eliminado y total recalculado | `./evidencias/07-eliminado.png` | Sí |

### Vista previa

![Navbar](./evidencias/01-navbar.png)
![Agregar](./evidencias/02-agregar.png)
![Validaciones](./evidencias/03-validaciones.png)
![Toast máximo](./evidencias/04-toast-maximo.png)
![Toast mínimo](./evidencias/05-toast-minimo.png)
![Totales](./evidencias/06-totales.png)
![Eliminado](./evidencias/07-eliminado.png)

---

## 📤 Subir a GitHub

```bash
git init
git add .
git commit -m "Carrito de compras React — TIENDA PALMIRA"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/Apellido_Nombre_CarritoReact.git
git push -u origin main
```

Crea el repositorio como **público** y reemplaza `Apellido_Nombre` por tu apellido y nombre. Verifica con `git clone` en otra carpeta que corre con `npm install && npm run dev`.
