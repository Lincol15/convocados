/**
 * main.js — Entry point y router simple de la SPA CONVOCADOS
 *
 * Orden de carga en el HTML (cada uno debe estar antes de este):
 *   1. data.js      → NEGOCIO, PRODUCTOS, helpers
 *   2. cart.js      → Cart
 *   3. whatsapp.js  → WA
 *   4. ui.js        → render* y utilidades de UI
 *   5. main.js      → este archivo
 */

// ── Estado global de la app ──────────────────────────────────
const App = {
  pantallaActual: 'inicio',
  filtroCategoria: 'todos',
};

// ── Bootstrap ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  _inicializarNav();
  _inicializarCarritoFlotante();
  _renderPantallaInicial();
});

// ── Navegación inferior ──────────────────────────────────────
function _inicializarNav() {
  document.querySelectorAll('.nav-item[data-screen]').forEach(btn => {
    btn.addEventListener('click', () => {
      const destino = btn.dataset.screen;
      App.pantallaActual = destino;

      switch (destino) {
        case 'inicio':
          mostrarPantalla('inicio');
          renderInicio();
          break;
        case 'carta':
          mostrarPantalla('carta');
          renderCarta(App.filtroCategoria || 'todos');
          break;
        case 'carrito':
          mostrarPantalla('carrito');
          renderCarrito();
          break;
        case 'info':
          mostrarPantalla('info');
          renderInfo();
          break;
        default:
          mostrarPantalla(destino);
      }
    });
  });
}

// ── Botón carrito flotante ───────────────────────────────────
function _inicializarCarritoFlotante() {
  const btn = document.getElementById('btn-carrito-flotante');
  if (btn) {
    btn.addEventListener('click', () => {
      App.pantallaActual = 'carrito';
      mostrarPantalla('carrito');
      renderCarrito();
    });
  }
}

// ── Render inicial ───────────────────────────────────────────
function _renderPantallaInicial() {
  // Renderizar inicio y mostrar pantalla
  renderInicio();
  mostrarPantalla('inicio');
  // Actualizar badge del carrito con lo que haya en localStorage
  actualizarBadge();
}
