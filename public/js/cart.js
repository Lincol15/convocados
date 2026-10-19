/**
 * cart.js — Lógica del carrito en memoria + persistencia en localStorage
 *
 * Cada ítem del carrito tiene esta forma:
 * {
 *   productoId:       string,
 *   cantidad:         number,
 *   opciones:         object  (estado raw del detalle),
 *   opcionesTexto:    string  (resumen legible para mostrar),
 *   observaciones:    string,
 *   subtotalUnitario: number  (céntimos por unidad, ya con extras)
 * }
 *
 * Regla de igualdad: dos ítems son el MISMO si tienen el mismo
 * productoId + opcionesTexto + observaciones (caso insensible a espacios).
 * Si coinciden se suma cantidad; si difieren se agrega línea nueva.
 */

const STORAGE_KEY = 'convocados_carrito_v1';

const Cart = (() => {
  // ── Estado interno ──────────────────────────────────────────
  let _items = [];

  // ── Persistencia ────────────────────────────────────────────

  function _guardar() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_items));
    } catch (e) {
      // Safari privado puede lanzar QuotaExceededError; ignorar silenciosamente
      console.warn('Cart: no se pudo guardar en localStorage', e);
    }
  }

  function _cargar() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) _items = parsed;
      }
    } catch (e) {
      console.warn('Cart: no se pudo leer localStorage', e);
      _items = [];
    }
  }

  // ── Clave de igualdad ────────────────────────────────────────
  function _clave(item) {
    return [
      item.productoId,
      (item.opcionesTexto  || '').trim(),
      (item.observaciones  || '').trim().toLowerCase(),
    ].join('||');
  }

  // ── API pública ──────────────────────────────────────────────

  /**
   * Agrega un ítem al carrito.
   * Si ya existe un ítem con la misma clave, suma la cantidad.
   */
  function agregar(item) {
    // Asegurar valores mínimos
    const nuevo = {
      productoId:       item.productoId,
      cantidad:         Math.max(1, item.cantidad || 1),
      opciones:         item.opciones         || {},
      opcionesTexto:    item.opcionesTexto    || '',
      observaciones:    (item.observaciones   || '').trim(),
      subtotalUnitario: item.subtotalUnitario || 0,
    };

    // Calcular subtotalUnitario si no viene (para productos simples)
    if (!nuevo.subtotalUnitario) {
      const prod = getProducto(nuevo.productoId);
      if (prod) nuevo.subtotalUnitario = prod.precioCentimos;
    }

    const claveNueva = _clave(nuevo);
    const existente  = _items.find(it => _clave(it) === claveNueva);

    if (existente) {
      existente.cantidad += nuevo.cantidad;
    } else {
      _items.push(nuevo);
    }

    _guardar();
  }

  /**
   * Cambia la cantidad de un ítem por su índice.
   * delta: +1 o -1.
   * Si la cantidad llega a 0, elimina el ítem.
   */
  function cambiarCantidad(idx, delta) {
    if (idx < 0 || idx >= _items.length) return;
    _items[idx].cantidad += delta;
    if (_items[idx].cantidad <= 0) {
      _items.splice(idx, 1);
    }
    _guardar();
  }

  /**
   * Elimina un ítem por su índice.
   */
  function eliminar(idx) {
    if (idx < 0 || idx >= _items.length) return;
    _items.splice(idx, 1);
    _guardar();
  }

  /**
   * Vacía todo el carrito.
   */
  function vaciar() {
    _items = [];
    _guardar();
  }

  /**
   * Devuelve una copia del array de ítems (inmutable desde fuera).
   */
  function obtener() {
    return _items.map(it => ({ ...it }));
  }

  /**
   * Cantidad total de unidades en el carrito (suma de todas las cantidades).
   */
  function contarItems() {
    return _items.reduce((acc, it) => acc + it.cantidad, 0);
  }

  /**
   * Total general en céntimos.
   * subtotalUnitario ya incluye extras (porción, adicionales, presentación).
   */
  function calcularTotal() {
    return _items.reduce((acc, it) => acc + it.subtotalUnitario * it.cantidad, 0);
  }

  /**
   * ¿Hay algún producto alcohólico en el carrito?
   */
  function tieneAlcohol() {
    return _items.some(it => {
      const p = getProducto(it.productoId);
      return p && p.alcoholico;
    });
  }

  // ── Inicialización: cargar al importar ───────────────────────
  _cargar();

  return { agregar, cambiarCantidad, eliminar, vaciar, obtener, contarItems, calcularTotal, tieneAlcohol };
})();
