/**
 * whatsapp.js — Generación del mensaje y URL de WhatsApp
 *
 * Abre WhatsApp con el pedido formateado.
 * NO marca el pedido como enviado ni vacía el carrito.
 *
 * Número configurado: 51965370205 (no cambiar sin autorización)
 */

const WA = (() => {

  // ── Helpers ──────────────────────────────────────────────────

  /** Convierte céntimos a "S/ X.XX" */
  function _fmt(centimos) {
    return 'S/ ' + (centimos / 100).toFixed(2);
  }

  /** Línea separadora */
  const SEP = '──────────────────────────';

  // ── Construcción del mensaje ─────────────────────────────────

  /**
   * Genera el mensaje de WhatsApp completo.
   *
   * @param {object} params
   *   nombre      {string}
   *   modalidad   {string}  'local' | 'recojo' | 'delivery'
   *   mesa        {string}  solo si local
   *   direccion   {string}  solo si delivery
   *   referencia  {string}  solo si delivery (opcional)
   *   items       {Array}   ítems del carrito
   *   total       {number}  total en céntimos
   */
  function generarMensaje({ nombre, modalidad, mesa, direccion, referencia, items, total }) {
    const lineas = [];

    // Cabecera
    lineas.push('🏟️ CONVOCADOS — Nuevo pedido');
    lineas.push(SEP);

    // Datos del cliente
    lineas.push(`👤 Cliente: ${nombre}`);
    lineas.push(`📋 Modalidad: ${_labelModalidad(modalidad)}`);

    if (modalidad === 'local' && mesa) {
      lineas.push(`🪑 Mesa: ${mesa}`);
    }
    if (modalidad === 'delivery') {
      lineas.push(`📍 Dirección: ${direccion}`);
      if (referencia && referencia.trim()) {
        lineas.push(`🗺️ Referencia: ${referencia.trim()}`);
      }
    }

    lineas.push(SEP);
    lineas.push('🛒 Productos:');
    lineas.push('');

    // Ítems
    items.forEach((it, i) => {
      const prod = getProducto(it.productoId);
      if (!prod) return;

      const subtotal = it.subtotalUnitario * it.cantidad;
      lineas.push(`${i + 1}. ${prod.nombre}  ×${it.cantidad}`);

      if (it.opcionesTexto && it.opcionesTexto.trim()) {
        lineas.push(`   ↳ ${it.opcionesTexto}`);
      }
      if (it.observaciones && it.observaciones.trim()) {
        lineas.push(`   📝 ${it.observaciones.trim()}`);
      }
      lineas.push(`   💰 ${_fmt(subtotal)}`);
      lineas.push('');
    });

    lineas.push(SEP);
    lineas.push(`💵 Total productos: ${_fmt(total)}`);

    if (modalidad === 'delivery') {
      lineas.push('🚗 Costo de delivery: Pendiente de confirmación');
    }

    lineas.push('');
    lineas.push('⚠️ Este pedido requiere confirmación del restaurante.');

    return lineas.join('\n');
  }

  /** Etiqueta legible de la modalidad */
  function _labelModalidad(mod) {
    const map = {
      local:    '🪑 Consumo en el local',
      recojo:   '🏃 Recojo en tienda',
      delivery: '🛵 Delivery',
    };
    return map[mod] || mod;
  }

  // ── URL de WhatsApp ──────────────────────────────────────────

  /**
   * Genera la URL wa.me con el mensaje codificado.
   * Usa el número real del negocio: 51965370205
   */
  function generarURL(params) {
    const mensaje = generarMensaje(params);
    const encoded = encodeURIComponent(mensaje);
    return `https://wa.me/${NEGOCIO.whatsapp}?text=${encoded}`;
  }

  // ── API pública ──────────────────────────────────────────────
  return { generarMensaje, generarURL };

})();
