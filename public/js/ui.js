/**
 * ui.js — Renderizado de todas las pantallas de CONVOCADOS
 * Depende de: data.js, cart.js (cargados antes en el HTML)
 */

/* ═══════════════════════════════════════════════════════════
   UTILIDADES DE UI
   ═══════════════════════════════════════════════════════════ */

/** Muestra una pantalla por su id, oculta las demás */
function mostrarPantalla(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('activo'));
  const pantalla = document.getElementById('screen-' + id);
  if (pantalla) {
    pantalla.classList.add('activo');
    pantalla.scrollTop = 0;
    window.scrollTo(0, 0);
  }
  // Actualiza nav inferior
  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('activo', n.dataset.screen === id);
  });
}

/** Muestra un toast temporal */
function mostrarToast(msg, tipo = '', duracion = 2800) {
  let toast = document.getElementById('toast-global');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-global';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = 'toast visible ' + tipo;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('visible');
  }, duracion);
}

/** Manejo de imagen con fallback */
function imgConFallback(src, alt, cls) {
  const fallback = 'https://placehold.co/600x400/1a1a1a/555555?text=Sin+imagen';
  return `<img
    src="${src || fallback}"
    alt="${escHtml(alt)}"
    class="${cls}"
    loading="lazy"
    onerror="this.onerror=null;this.src='${fallback}'"
  >`;
}

/** Escapa HTML para evitar XSS */
function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ═══════════════════════════════════════════════════════════
   MODAL DE CONFIRMACIÓN
   ═══════════════════════════════════════════════════════════ */

function mostrarModal({ titulo, mensaje, labelConfirmar = 'Confirmar', labelCancelar = 'Cancelar', onConfirmar }) {
  let overlay = document.getElementById('modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'modal-overlay';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal">
        <h2 id="modal-titulo"></h2>
        <p id="modal-mensaje"></p>
        <div class="modal-acciones">
          <button id="modal-cancelar" class="btn btn-outline btn-sm"></button>
          <button id="modal-confirmar" class="btn btn-danger btn-sm"></button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => {
      if (e.target === overlay) cerrarModal();
    });
  }
  document.getElementById('modal-titulo').textContent  = titulo;
  document.getElementById('modal-mensaje').textContent = mensaje;
  document.getElementById('modal-cancelar').textContent  = labelCancelar;
  document.getElementById('modal-confirmar').textContent = labelConfirmar;

  const btnConf = document.getElementById('modal-confirmar');
  btnConf.replaceWith(btnConf.cloneNode(true)); // elimina listeners anteriores
  document.getElementById('modal-confirmar').addEventListener('click', () => {
    cerrarModal();
    if (onConfirmar) onConfirmar();
  });
  document.getElementById('modal-cancelar').onclick = cerrarModal;

  requestAnimationFrame(() => overlay.classList.add('visible'));
}

function cerrarModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) overlay.classList.remove('visible');
}

/* ═══════════════════════════════════════════════════════════
   BADGE DEL CARRITO
   ═══════════════════════════════════════════════════════════ */

function actualizarBadge() {
  const total = Cart.contarItems();
  const badge = document.getElementById('carrito-badge');
  const badgeNav = document.getElementById('carrito-badge-nav');
  if (badge) {
    badge.textContent = total;
    badge.classList.toggle('oculto', total === 0);
  }
  if (badgeNav) {
    badgeNav.textContent = total > 0 ? total : '';
    badgeNav.style.display = total > 0 ? 'flex' : 'none';
  }
}

/* ═══════════════════════════════════════════════════════════
   PANTALLA: INICIO
   ═══════════════════════════════════════════════════════════ */

function renderInicio() {
  const screen = document.getElementById('screen-inicio');
  if (!screen) return;

  const destacados = getDestacados();

  screen.innerHTML = `
    <!-- Topbar -->
    <div class="topbar">
      <span class="topbar-logo">CONV<span>O</span>CADOS</span>
      <button class="btn-icon" id="btn-nav-info" aria-label="Info del negocio" title="Info">ℹ️</button>
    </div>

    <!-- Hero -->
    <div class="hero">
      <h1 class="hero-nombre">CONVOCADOS</h1>
      <p class="hero-slogan">"${escHtml(NEGOCIO.slogan)}"</p>
    </div>

    <!-- Banner promo -->
    ${NEGOCIO.promo.activa ? `
    <div class="banner-promo">
      <span class="banner-promo-icon">🔥</span>
      <div class="banner-promo-texto">
        <strong>${escHtml(NEGOCIO.promo.texto)}</strong>
        <span>${escHtml(NEGOCIO.promo.precio)}</span>
      </div>
    </div>` : ''}

    <!-- Categorías -->
    <div class="seccion-inicio">
      <p class="seccion-titulo">📂 Categorías</p>
      <div class="chips-scroll" id="chips-categorias-inicio">
        ${CATEGORIAS.map(c => `
          <button class="chip" data-cat="${c.id}">
            <span class="chip-emoji">${c.emoji}</span>
            ${escHtml(c.nombre)}
          </button>`).join('')}
      </div>
    </div>

    <!-- Destacados -->
    <div class="seccion-inicio">
      <p class="seccion-titulo">⭐ Destacados</p>
      <div class="cards-scroll" id="cards-destacados">
        ${destacados.map(p => `
          <div class="card-mini" data-id="${p.id}">
            ${imgConFallback(p.imagen, p.nombre, 'card-mini-img')}
            <div class="card-mini-body">
              <div class="card-mini-nombre">${escHtml(p.nombre)}</div>
              <div class="card-mini-precio">${formatPrecio(p.precioCentimos)}${p.tipo === 'alitas' || p.tipo === 'vino' ? '<small> desde</small>' : ''}</div>
            </div>
          </div>`).join('')}
      </div>
    </div>

    <!-- CTA -->
    <div class="px-16">
      <button class="btn btn-primary" id="btn-explorar-carta">🍽️ Explorar la carta completa</button>
    </div>
  `;

  // Eventos
  screen.querySelector('#btn-nav-info').addEventListener('click', () => {
    mostrarPantalla('info');
    renderInfo();
  });

  screen.querySelectorAll('#chips-categorias-inicio .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      App.filtroCategoria = chip.dataset.cat;
      mostrarPantalla('carta');
      renderCarta(chip.dataset.cat);
    });
  });

  screen.querySelectorAll('#cards-destacados .card-mini').forEach(card => {
    card.addEventListener('click', () => {
      const prod = getProducto(card.dataset.id);
      if (prod) {
        mostrarPantalla('detalle');
        renderDetalle(prod);
      }
    });
  });

  screen.querySelector('#btn-explorar-carta').addEventListener('click', () => {
    App.filtroCategoria = 'todos';
    mostrarPantalla('carta');
    renderCarta('todos');
  });
}

/* ═══════════════════════════════════════════════════════════
   PANTALLA: CARTA
   ═══════════════════════════════════════════════════════════ */

function renderCarta(catInicial = 'todos') {
  const screen = document.getElementById('screen-carta');
  if (!screen) return;

  screen.innerHTML = `
    <!-- Topbar -->
    <div class="topbar">
      <button class="btn-icon" id="btn-volver-inicio" aria-label="Volver al inicio">←</button>
      <span class="topbar-titulo">🍽️ La Carta</span>
      <div style="width:40px"></div>
    </div>

    <!-- Buscador -->
    <div class="buscador-wrap">
      <div class="buscador">
        <span class="buscador-icon">🔍</span>
        <input type="search" id="input-buscar" placeholder="Buscar producto…" autocomplete="off" maxlength="60">
        <button class="buscador-clear" id="btn-limpiar-busqueda" aria-label="Limpiar">✕</button>
      </div>
    </div>

    <!-- Filtros de categoría -->
    <div class="filtros-wrap">
      <div class="chips-scroll" id="chips-filtros">
        <button class="chip ${catInicial === 'todos' ? 'activo' : ''}" data-cat="todos">
          <span class="chip-emoji">🍽️</span> Todos
        </button>
        ${CATEGORIAS.map(c => `
          <button class="chip ${catInicial === c.id ? 'activo' : ''}" data-cat="${c.id}">
            <span class="chip-emoji">${c.emoji}</span> ${escHtml(c.nombre)}
          </button>`).join('')}
      </div>
    </div>

    <!-- Grid de productos -->
    <div class="productos-grid" id="productos-grid"></div>
  `;

  // Estado local de búsqueda y filtro
  let textoBusqueda = '';
  let categoriaActiva = catInicial;

  function aplicarFiltros() {
    let lista = textoBusqueda.trim()
      ? buscarProductos(textoBusqueda)
      : filtrarPorCategoria(categoriaActiva);

    if (textoBusqueda.trim() && categoriaActiva !== 'todos') {
      lista = lista.filter(p => p.categoria === categoriaActiva);
    }

    renderGridProductos(lista);
  }

  function renderGridProductos(lista) {
    const grid = document.getElementById('productos-grid');
    if (!grid) return;

    if (!lista.length) {
      grid.innerHTML = `
        <div class="estado-vacio" style="grid-column:1/-1">
          <div class="estado-vacio-icon">🔎</div>
          <h3>No encontramos productos</h3>
          <p>Intenta con otro término o cambia la categoría.</p>
        </div>`;
      return;
    }

    grid.innerHTML = lista.map(p => `
      <div class="producto-card" data-id="${p.id}" role="button" tabindex="0" aria-label="${escHtml(p.nombre)}">
        <div class="producto-img-wrap">
          ${imgConFallback(p.imagen, p.nombre, 'producto-img')}
          ${p.agotado ? `<div class="badge-agotado"><span>AGOTADO</span></div>` : ''}
          ${p.alcoholico ? `<span class="badge-18">+18</span>` : ''}
        </div>
        <div class="producto-body">
          <div class="producto-nombre">${escHtml(p.nombre)}</div>
          <div class="producto-desc">${escHtml(p.descripcion)}</div>
          <div class="producto-precio">
            ${p.tipo === 'alitas' || p.tipo === 'vino' ? '<span class="desde">desde </span>' : ''}
            ${formatPrecio(p.precioCentimos)}
          </div>
          <button class="btn-agregar" ${p.agotado ? 'disabled aria-disabled="true"' : ''} data-id="${p.id}">
            ${p.agotado ? 'Agotado' : '+ Agregar'}
          </button>
        </div>
      </div>`).join('');

    // Eventos tarjetas
    grid.querySelectorAll('.producto-card').forEach(card => {
      const handler = () => {
        const prod = getProducto(card.dataset.id);
        if (prod && !prod.agotado) {
          mostrarPantalla('detalle');
          renderDetalle(prod);
        }
      };
      card.addEventListener('click', handler);
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') handler(); });
    });

    grid.querySelectorAll('.btn-agregar').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const prod = getProducto(btn.dataset.id);
        if (!prod || prod.agotado) return;
        // Productos simples sin opciones → agregar directo; con opciones → abrir detalle
        if (prod.tipo === 'simple') {
          Cart.agregar({ productoId: prod.id, cantidad: 1, opciones: {}, observaciones: '' });
          actualizarBadge();
          mostrarToast('✅ ' + prod.nombre + ' agregado', 'exito');
        } else {
          mostrarPantalla('detalle');
          renderDetalle(prod);
        }
      });
    });
  }

  // Buscador
  const inputBuscar = screen.querySelector('#input-buscar');
  const btnLimpiar  = screen.querySelector('#btn-limpiar-busqueda');

  inputBuscar.addEventListener('input', () => {
    textoBusqueda = inputBuscar.value;
    btnLimpiar.style.display = textoBusqueda ? 'flex' : 'none';
    aplicarFiltros();
  });

  btnLimpiar.addEventListener('click', () => {
    inputBuscar.value = '';
    textoBusqueda = '';
    btnLimpiar.style.display = 'none';
    inputBuscar.focus();
    aplicarFiltros();
  });
  btnLimpiar.style.display = 'none';

  // Chips de filtro
  screen.querySelectorAll('#chips-filtros .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      screen.querySelectorAll('#chips-filtros .chip').forEach(c => c.classList.remove('activo'));
      chip.classList.add('activo');
      categoriaActiva = chip.dataset.cat;
      aplicarFiltros();
    });
  });

  screen.querySelector('#btn-volver-inicio').addEventListener('click', () => {
    mostrarPantalla('inicio');
  });

  aplicarFiltros();
}

/* ═══════════════════════════════════════════════════════════
   PANTALLA: DETALLE DEL PRODUCTO
   ═══════════════════════════════════════════════════════════ */

function renderDetalle(prod) {
  const screen = document.getElementById('screen-detalle');
  if (!screen) return;

  // Estado local del detalle
  let estado = {
    cantidad: 1,
    porcionId: null,        // para alitas
    salsas: [],             // para alitas
    presentacionId: null,   // para vinos
    adicionales: [],        // ids de adicionales seleccionados
    observaciones: '',
  };

  function calcularTotal() {
    return calcularPrecioUnitario(prod, estado) * estado.cantidad;
  }

  function actualizarTotal() {
    const el = document.getElementById('detalle-total-valor');
    if (el) el.textContent = formatPrecio(calcularTotal());
  }

  function maxSalsas() {
    if (!estado.porcionId) return 0;
    return ALITAS_MAX_SALSAS[estado.porcionId] || 1;
  }

  function actualizarSalsas() {
    const max = maxSalsas();
    // Actualiza el tag de máximo
    const maxTag = document.getElementById('salsas-max-tag');
    if (maxTag) maxTag.textContent = `Máx. ${max}`;

    // Deshabilita checkboxes si se llegó al límite
    document.querySelectorAll('.salsa-cb').forEach(cb => {
      if (!cb.checked) {
        cb.disabled = estado.salsas.length >= max;
        cb.closest('.opcion-item').querySelector('.opcion-label').style.opacity =
          (estado.salsas.length >= max && !cb.checked) ? '0.4' : '1';
        cb.closest('.opcion-item').querySelector('.opcion-label').style.cursor =
          (estado.salsas.length >= max && !cb.checked) ? 'not-allowed' : 'pointer';
      }
    });

    // Quita salsas que sobrepasen el nuevo máximo al cambiar porción
    if (estado.salsas.length > max) {
      estado.salsas = estado.salsas.slice(0, max);
      document.querySelectorAll('.salsa-cb').forEach(cb => {
        cb.checked = estado.salsas.includes(cb.value);
      });
    }

    const errorEl = document.getElementById('error-salsas');
    if (errorEl) errorEl.textContent = '';
  }

  // ── Construir HTML de opciones según tipo ──────────────────

  let htmlOpciones = '';

  if (prod.alcoholico) {
    htmlOpciones += `
      <div class="aviso-18">
        🔞 <span>Venta de alcohol solo para mayores de 18 años.</span>
      </div>`;
  }

  // Alitas: porción + salsas + adicionales
  if (prod.tipo === 'alitas') {
    htmlOpciones += `
      <div class="opcion-seccion">
        <div class="opcion-titulo">
          🍗 Porción
          <span class="req-tag">obligatorio</span>
        </div>
        <div class="opciones-grid" id="grupo-porciones">
          ${ALITAS_PORCIONES.map(p => `
            <div class="opcion-item">
              <input type="radio" name="porcion" id="porc-${p.id}" value="${p.id}" class="porcion-radio">
              <label class="opcion-label" for="porc-${p.id}">
                ${escHtml(p.label)}
                ${p.extra > 0 ? `<span class="extra-precio">+${formatPrecio(p.extra)}</span>` : ''}
              </label>
            </div>`).join('')}
        </div>
        <div class="error-msg" id="error-porcion"></div>
      </div>

      <div class="opcion-seccion">
        <div class="opcion-titulo">
          🌶️ Salsas
          <span class="req-tag">mín. 1</span>
          <span class="max-tag" id="salsas-max-tag">Máx. —</span>
        </div>
        <div class="opciones-grid" id="grupo-salsas">
          ${ALITAS_SALSAS.map(s => `
            <div class="opcion-item">
              <input type="checkbox" id="salsa-${s.id}" value="${s.id}" class="salsa-cb">
              <label class="opcion-label" for="salsa-${s.id}">${escHtml(s.nombre)}</label>
            </div>`).join('')}
        </div>
        <div class="error-msg" id="error-salsas"></div>
      </div>

      <div class="opcion-seccion">
        <div class="opcion-titulo">➕ Adicionales</div>
        <div class="adicionales-list">
          ${ALITAS_ADICIONALES.map(a => `
            <div class="adicional-item">
              <input type="checkbox" id="adic-${a.id}" value="${a.id}" class="adicional-cb">
              <label class="adicional-label" for="adic-${a.id}">
                <div class="adicional-label-left">
                  <span class="adicional-check"></span>
                  ${escHtml(a.nombre)}
                </div>
                <span class="adicional-precio">+${formatPrecio(a.precio)}</span>
              </label>
            </div>`).join('')}
        </div>
      </div>`;
  }

  // Burger: adicionales
  if (prod.tipo === 'burger') {
    htmlOpciones += `
      <div class="opcion-seccion">
        <div class="opcion-titulo">➕ Adicionales</div>
        <div class="adicionales-list">
          ${BURGERS_ADICIONALES.map(a => `
            <div class="adicional-item">
              <input type="checkbox" id="adic-${a.id}" value="${a.id}" class="adicional-cb">
              <label class="adicional-label" for="adic-${a.id}">
                <div class="adicional-label-left">
                  <span class="adicional-check"></span>
                  ${escHtml(a.nombre)}
                </div>
                <span class="adicional-precio">+${formatPrecio(a.precio)}</span>
              </label>
            </div>`).join('')}
        </div>
      </div>`;
  }

  // Vino: presentación copa/botella
  if (prod.tipo === 'vino') {
    htmlOpciones += `
      <div class="opcion-seccion">
        <div class="opcion-titulo">
          🍷 Presentación
          <span class="req-tag">obligatorio</span>
        </div>
        <div class="opciones-grid" id="grupo-presentacion">
          ${VINOS_PRESENTACIONES.map(v => `
            <div class="opcion-item">
              <input type="radio" name="presentacion" id="pres-${v.id}" value="${v.id}" class="presentacion-radio">
              <label class="opcion-label" for="pres-${v.id}">
                ${escHtml(v.label)}
                ${v.extra > 0
                  ? `<span class="extra-precio">+${formatPrecio(v.extra)} (${formatPrecio(prod.precioCentimos + v.extra)})</span>`
                  : `<span class="extra-precio">${formatPrecio(prod.precioCentimos)}</span>`}
              </label>
            </div>`).join('')}
        </div>
        <div class="error-msg" id="error-presentacion"></div>
      </div>`;
  }

  // Observaciones (todos)
  htmlOpciones += `
    <div class="observaciones-wrap">
      <label class="campo-label" for="obs-input">📝 Observaciones <span style="font-weight:400;text-transform:none">(opcional)</span></label>
      <textarea id="obs-input" class="observaciones" maxlength="200"
        placeholder="Ej: sin cebolla, extra picante, alergia a mariscos…"></textarea>
      <div class="obs-contador"><span id="obs-count">0</span>/200</div>
    </div>`;

  // ── Render HTML ────────────────────────────────────────────
  screen.innerHTML = `
    <div class="detalle-header">
      ${imgConFallback(prod.imagen, prod.nombre, 'detalle-img')}
      <button class="detalle-volver" id="btn-detalle-volver" aria-label="Volver">←</button>
      ${prod.alcoholico ? '<span class="badge-18" style="position:absolute;top:12px;right:12px;font-size:0.75rem;padding:4px 10px">+18</span>' : ''}
    </div>

    <div class="detalle-body">
      <h2 class="detalle-nombre">${escHtml(prod.nombre)}</h2>
      <p class="detalle-desc">${escHtml(prod.descripcion)}</p>
      <div class="detalle-precio">
        ${prod.tipo === 'alitas' || prod.tipo === 'vino' ? '<small>desde </small>' : ''}
        <span id="precio-base-display">${formatPrecio(prod.precioCentimos)}</span>
      </div>

      ${htmlOpciones}

      <!-- Selector de cantidad -->
      <div class="opcion-seccion">
        <div class="opcion-titulo">🔢 Cantidad</div>
        <div style="display:flex;align-items:center;gap:16px">
          <div class="cantidad-wrap">
            <button class="cantidad-btn" id="btn-menos" aria-label="Menos" disabled>−</button>
            <span class="cantidad-num" id="cantidad-display">1</span>
            <button class="cantidad-btn" id="btn-mas" aria-label="Más">+</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Barra inferior fija -->
    <div class="detalle-total-bar">
      <div>
        <div class="detalle-total-label">Total</div>
        <div class="detalle-total-valor" id="detalle-total-valor">${formatPrecio(prod.precioCentimos)}</div>
      </div>
      <button class="detalle-total-btn" id="btn-agregar-pedido">🛒 Agregar al pedido</button>
    </div>
  `;

  // ── Eventos del detalle ────────────────────────────────────

  // Volver
  screen.querySelector('#btn-detalle-volver').addEventListener('click', () => {
    history.back ? window.history.go(-1) : mostrarPantalla('carta');
    // Fallback seguro
    setTimeout(() => {
      if (document.getElementById('screen-detalle').classList.contains('activo')) {
        mostrarPantalla('carta');
        renderCarta(App.filtroCategoria || 'todos');
      }
    }, 100);
  });

  // Porciones alitas
  screen.querySelectorAll('.porcion-radio').forEach(radio => {
    radio.addEventListener('change', () => {
      estado.porcionId = radio.value;
      actualizarSalsas();
      actualizarTotal();
      document.getElementById('error-porcion').textContent = '';
    });
  });

  // Salsas alitas
  screen.querySelectorAll('.salsa-cb').forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.checked) {
        if (estado.salsas.length >= maxSalsas()) {
          cb.checked = false;
          const errorEl = document.getElementById('error-salsas');
          if (errorEl) errorEl.textContent = `⚠️ Máximo ${maxSalsas()} salsa(s) para esta porción.`;
          return;
        }
        estado.salsas.push(cb.value);
      } else {
        estado.salsas = estado.salsas.filter(s => s !== cb.value);
      }
      actualizarSalsas();
      actualizarTotal();
      document.getElementById('error-salsas').textContent = '';
    });
  });

  // Presentación vino
  screen.querySelectorAll('.presentacion-radio').forEach(radio => {
    radio.addEventListener('change', () => {
      estado.presentacionId = radio.value;
      actualizarTotal();
      document.getElementById('error-presentacion').textContent = '';
    });
  });

  // Adicionales
  screen.querySelectorAll('.adicional-cb').forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.checked) {
        if (!estado.adicionales.includes(cb.value)) estado.adicionales.push(cb.value);
      } else {
        estado.adicionales = estado.adicionales.filter(a => a !== cb.value);
      }
      actualizarTotal();
    });
  });

  // Cantidad
  const btnMenos = screen.querySelector('#btn-menos');
  const btnMas   = screen.querySelector('#btn-mas');
  const cantNum  = screen.querySelector('#cantidad-display');

  btnMas.addEventListener('click', () => {
    estado.cantidad++;
    cantNum.textContent = estado.cantidad;
    btnMenos.disabled = estado.cantidad <= 1;
    actualizarTotal();
  });
  btnMenos.addEventListener('click', () => {
    if (estado.cantidad > 1) {
      estado.cantidad--;
      cantNum.textContent = estado.cantidad;
      btnMenos.disabled = estado.cantidad <= 1;
      actualizarTotal();
    }
  });

  // Observaciones
  const obsInput = screen.querySelector('#obs-input');
  const obsCount = screen.querySelector('#obs-count');
  obsInput.addEventListener('input', () => {
    estado.observaciones = obsInput.value;
    obsCount.textContent = obsInput.value.length;
  });

  // Agregar al pedido
  screen.querySelector('#btn-agregar-pedido').addEventListener('click', () => {
    // Validaciones
    let valido = true;

    if (prod.tipo === 'alitas') {
      if (!estado.porcionId) {
        document.getElementById('error-porcion').textContent = '⚠️ Debes seleccionar una porción.';
        valido = false;
      }
      if (estado.salsas.length === 0) {
        document.getElementById('error-salsas').textContent = '⚠️ Debes elegir al menos 1 salsa.';
        valido = false;
      }
    }

    if (prod.tipo === 'vino' && !estado.presentacionId) {
      document.getElementById('error-presentacion').textContent = '⚠️ Debes seleccionar una presentación.';
      valido = false;
    }

    if (!valido) return;

    // Construir opciones legibles para mostrar en el carrito
    const opcionesTexto = construirOpcionesTexto(prod, estado);

    Cart.agregar({
      productoId:    prod.id,
      cantidad:      estado.cantidad,
      opciones:      { ...estado },
      opcionesTexto: opcionesTexto,
      observaciones: estado.observaciones.trim(),
      subtotalUnitario: calcularPrecioUnitario(prod, estado),
    });

    actualizarBadge();
    mostrarToast('✅ ' + prod.nombre + ' agregado al pedido', 'exito');
    mostrarPantalla('carta');
    renderCarta(App.filtroCategoria || 'todos');
  });
}

/** Construye un string legible de las opciones elegidas */
function construirOpcionesTexto(prod, estado) {
  const partes = [];

  if (prod.tipo === 'alitas') {
    if (estado.porcionId) {
      const p = ALITAS_PORCIONES.find(p => p.id === estado.porcionId);
      if (p) partes.push(p.label);
    }
    if (estado.salsas.length) {
      const nombres = estado.salsas.map(id => {
        const s = ALITAS_SALSAS.find(s => s.id === id);
        return s ? s.nombre : id;
      });
      partes.push('Salsas: ' + nombres.join(', '));
    }
    if (estado.adicionales.length) {
      const nombres = estado.adicionales.map(id => {
        const a = ALITAS_ADICIONALES.find(a => a.id === id);
        return a ? a.nombre : id;
      });
      partes.push('+ ' + nombres.join(', '));
    }
  }

  if (prod.tipo === 'burger' && estado.adicionales.length) {
    const nombres = estado.adicionales.map(id => {
      const a = BURGERS_ADICIONALES.find(a => a.id === id);
      return a ? a.nombre : id;
    });
    partes.push('+ ' + nombres.join(', '));
  }

  if (prod.tipo === 'vino' && estado.presentacionId) {
    const v = VINOS_PRESENTACIONES.find(v => v.id === estado.presentacionId);
    if (v) partes.push(v.label);
  }

  return partes.join(' · ');
}

/* ═══════════════════════════════════════════════════════════
   PANTALLA: CARRITO (MI PEDIDO)
   ═══════════════════════════════════════════════════════════ */

function renderCarrito() {
  const screen = document.getElementById('screen-carrito');
  if (!screen) return;

  const items = Cart.obtener();
  const tieneAlcohol = items.some(it => {
    const p = getProducto(it.productoId);
    return p && p.alcoholico;
  });

  screen.innerHTML = `
    <div class="topbar">
      <span class="topbar-titulo">🛒 Mi Pedido</span>
      ${items.length > 0
        ? `<button class="btn-icon btn-danger" id="btn-vaciar" title="Vaciar pedido">🗑️</button>`
        : '<div style="width:40px"></div>'}
    </div>

    ${items.length === 0 ? renderCarritoVacio() : renderCarritoConItems(items, tieneAlcohol)}
  `;

  if (items.length === 0) {
    screen.querySelector('#btn-explorar-desde-carrito')?.addEventListener('click', () => {
      App.filtroCategoria = 'todos';
      mostrarPantalla('carta');
      renderCarta('todos');
    });
    return;
  }

  // Vaciar pedido
  screen.querySelector('#btn-vaciar')?.addEventListener('click', () => {
    mostrarModal({
      titulo: '¿Vaciar el pedido?',
      mensaje: 'Se eliminarán todos los productos del carrito. Esta acción no se puede deshacer.',
      labelConfirmar: 'Sí, vaciar',
      labelCancelar: 'Cancelar',
      onConfirmar: () => {
        Cart.vaciar();
        actualizarBadge();
        renderCarrito();
        mostrarToast('🗑️ Pedido vaciado', '');
      }
    });
  });

  // Botones de cantidad en el carrito
  screen.querySelectorAll('.carrito-qty-btn[data-accion]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx);
      const accion = btn.dataset.accion;
      if (accion === 'mas') Cart.cambiarCantidad(idx, 1);
      if (accion === 'menos') Cart.cambiarCantidad(idx, -1);
      actualizarBadge();
      renderCarrito();
    });
  });

  // Eliminar ítem
  screen.querySelectorAll('.btn-eliminar-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx);
      Cart.eliminar(idx);
      actualizarBadge();
      renderCarrito();
      mostrarToast('❌ Producto eliminado', '');
    });
  });

  // Seguir comprando
  screen.querySelector('#btn-seguir-comprando')?.addEventListener('click', () => {
    mostrarPantalla('carta');
    renderCarta(App.filtroCategoria || 'todos');
  });

  // Ir a datos del pedido
  screen.querySelector('#btn-ir-datos')?.addEventListener('click', () => {
    mostrarPantalla('datos');
    renderDatos();
  });
}

function renderCarritoVacio() {
  return `
    <div class="estado-vacio" style="padding-top:80px">
      <div class="estado-vacio-icon">🛒</div>
      <h3>Tu pedido está vacío</h3>
      <p>Agrega productos desde la carta para comenzar.</p>
      <div style="margin-top:24px;padding:0 32px">
        <button class="btn btn-primary" id="btn-explorar-desde-carrito">🍽️ Ver la carta</button>
      </div>
    </div>`;
}

function renderCarritoConItems(items, tieneAlcohol) {
  const totalCentimos = Cart.calcularTotal();

  const htmlItems = items.map((it, idx) => {
    const prod = getProducto(it.productoId);
    if (!prod) return '';
    const subtotal = it.subtotalUnitario * it.cantidad;
    return `
      <div class="carrito-item">
        ${imgConFallback(prod.imagen, prod.nombre, 'carrito-item-img')}
        <div class="carrito-item-info">
          <div class="carrito-item-nombre">${escHtml(prod.nombre)}</div>
          ${it.opcionesTexto ? `<div class="carrito-item-opciones">${escHtml(it.opcionesTexto)}</div>` : ''}
          ${it.observaciones ? `<div class="carrito-item-obs">📝 ${escHtml(it.observaciones)}</div>` : ''}
          <div class="carrito-item-footer">
            <span class="carrito-item-precio">${formatPrecio(subtotal)}</span>
            <div class="carrito-item-acciones">
              <div class="carrito-qty-wrap">
                <button class="carrito-qty-btn" data-accion="menos" data-idx="${idx}" aria-label="Menos">−</button>
                <span class="carrito-qty-num">${it.cantidad}</span>
                <button class="carrito-qty-btn" data-accion="mas" data-idx="${idx}" aria-label="Más">+</button>
              </div>
              <button class="btn-icon btn-danger btn-sm btn-eliminar-item" data-idx="${idx}" aria-label="Eliminar">✕</button>
            </div>
          </div>
        </div>
      </div>`;
  }).join('');

  return `
    <div class="carrito-lista">${htmlItems}</div>

    <!-- Resumen -->
    <div class="carrito-resumen">
      <div class="resumen-row">
        <span>Subtotal productos</span>
        <span class="resumen-valor">${formatPrecio(totalCentimos)}</span>
      </div>
      <div class="resumen-row">
        <span>Delivery</span>
        <span class="resumen-pendiente">Pendiente de confirmación</span>
      </div>
      <div class="resumen-row total">
        <span>Total</span>
        <span class="resumen-valor">${formatPrecio(totalCentimos)}</span>
      </div>
    </div>

    <!-- Aviso -->
    <div class="aviso-carrito">
      ℹ️ Abrir WhatsApp <strong>no confirma ni vacía</strong> el pedido. El restaurante debe confirmarlo.
    </div>

    ${tieneAlcohol ? `
    <div class="aviso-carrito" style="border-color:rgba(255,215,0,0.3);color:var(--dorado)">
      🔞 Este pedido contiene bebidas alcohólicas. Venta solo para mayores de 18 años.
    </div>` : ''}

    <!-- Acciones -->
    <div class="carrito-acciones">
      <button class="btn btn-gold" id="btn-ir-datos">📲 Continuar y enviar por WhatsApp</button>
      <button class="btn btn-outline" id="btn-seguir-comprando">← Seguir comprando</button>
    </div>`;
}

/* ═══════════════════════════════════════════════════════════
   PANTALLA: DATOS DEL PEDIDO
   ═══════════════════════════════════════════════════════════ */

function renderDatos() {
  const screen = document.getElementById('screen-datos');
  if (!screen) return;

  const items = Cart.obtener();
  const tieneAlcohol = items.some(it => {
    const p = getProducto(it.productoId);
    return p && p.alcoholico;
  });
  const totalCentimos = Cart.calcularTotal();

  screen.innerHTML = `
    <div class="topbar">
      <button class="btn-icon" id="btn-datos-volver" aria-label="Volver al carrito">←</button>
      <span class="topbar-titulo">📋 Datos del Pedido</span>
      <div style="width:40px"></div>
    </div>

    <div class="form-pedido" id="form-pedido">

      <!-- Nombre -->
      <div class="form-grupo">
        <label class="form-label" for="inp-nombre">Nombre del cliente <span class="req">*</span></label>
        <input class="form-input" type="text" id="inp-nombre" placeholder="Tu nombre completo" maxlength="80" autocomplete="name">
        <div class="form-error" id="err-nombre"></div>
      </div>

      <!-- Modalidad -->
      <div class="form-grupo">
        <div class="form-label">Modalidad <span class="req">*</span></div>
        <div class="modalidad-grid">
          <div class="modalidad-item">
            <input type="radio" name="modalidad" id="mod-local" value="local" checked>
            <label class="modalidad-label" for="mod-local">
              <span class="modalidad-icon">🪑</span>
              <span class="modalidad-texto">En el local</span>
            </label>
          </div>
          <div class="modalidad-item">
            <input type="radio" name="modalidad" id="mod-recojo" value="recojo">
            <label class="modalidad-label" for="mod-recojo">
              <span class="modalidad-icon">🏃</span>
              <span class="modalidad-texto">Recojo</span>
            </label>
          </div>
          <div class="modalidad-item">
            <input type="radio" name="modalidad" id="mod-delivery" value="delivery">
            <label class="modalidad-label" for="mod-delivery">
              <span class="modalidad-icon">🛵</span>
              <span class="modalidad-texto">Delivery</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Mesa (solo LOCAL) -->
      <div class="form-grupo" id="grupo-mesa">
        <label class="form-label" for="inp-mesa">Número de mesa <span class="req">*</span></label>
        <input class="form-input" type="text" id="inp-mesa" placeholder="Ej: 5, Barra, VIP…" maxlength="20">
        <div class="form-error" id="err-mesa"></div>
      </div>

      <!-- Dirección (solo DELIVERY) -->
      <div class="form-grupo" id="grupo-direccion" style="display:none">
        <label class="form-label" for="inp-direccion">Dirección de entrega <span class="req">*</span></label>
        <input class="form-input" type="text" id="inp-direccion" placeholder="Av. Ejemplo 123, Urbanización…" maxlength="150" autocomplete="street-address">
        <div class="form-error" id="err-direccion"></div>
      </div>

      <!-- Referencia (solo DELIVERY, opcional) -->
      <div class="form-grupo" id="grupo-referencia" style="display:none">
        <label class="form-label" for="inp-referencia">Referencia <span style="font-weight:400;text-transform:none">(opcional)</span></label>
        <textarea class="form-textarea" id="inp-referencia" placeholder="Ej: Frente al parque, portón azul…" maxlength="120" rows="2"></textarea>
      </div>

      ${tieneAlcohol ? `
      <div class="aviso-carrito" style="border-color:rgba(255,215,0,0.3);color:var(--dorado);margin:0">
        🔞 Este pedido contiene bebidas alcohólicas. Venta solo para mayores de 18 años.
      </div>` : ''}

      <!-- Resumen del pedido -->
      <div class="resumen-pedido">
        <h3>📋 Resumen</h3>
        ${items.map((it, idx) => {
          const prod = getProducto(it.productoId);
          if (!prod) return '';
          return `
            <div class="resumen-pedido-item">
              <span>${it.cantidad}× ${escHtml(prod.nombre)}${it.opcionesTexto ? ' <small style="color:var(--texto3)">(' + escHtml(it.opcionesTexto) + ')</small>' : ''}</span>
              <strong>${formatPrecio(it.subtotalUnitario * it.cantidad)}</strong>
            </div>`;
        }).join('')}
        <div class="sep"></div>
        <div class="resumen-pedido-item">
          <strong>Total productos</strong>
          <strong style="color:var(--naranja)">${formatPrecio(totalCentimos)}</strong>
        </div>
      </div>

      <!-- Banner de éxito (oculto hasta enviar) -->
      <div class="banner-exito oculto" id="banner-exito">
        <span class="banner-exito-icon">✅</span>
        <span>WhatsApp abierto correctamente. Tu pedido queda <strong>pendiente de confirmación</strong> del restaurante. El carrito <strong>no se vació</strong>.</span>
      </div>

      <!-- Botón enviar -->
      <button class="btn btn-gold" id="btn-enviar-whatsapp" style="font-size:1.05rem">
        📲 Enviar pedido por WhatsApp
      </button>

    </div>
  `;

  // ── Eventos formulario ─────────────────────────────────────

  screen.querySelector('#btn-datos-volver').addEventListener('click', () => {
    mostrarPantalla('carrito');
    renderCarrito();
  });

  // Mostrar/ocultar campos según modalidad
  const radios = screen.querySelectorAll('input[name="modalidad"]');
  const grupoMesa       = screen.querySelector('#grupo-mesa');
  const grupoDireccion  = screen.querySelector('#grupo-direccion');
  const grupoReferencia = screen.querySelector('#grupo-referencia');

  function actualizarModalidad() {
    const val = screen.querySelector('input[name="modalidad"]:checked')?.value;
    grupoMesa.style.display      = val === 'local'    ? '' : 'none';
    grupoDireccion.style.display = val === 'delivery' ? '' : 'none';
    grupoReferencia.style.display= val === 'delivery' ? '' : 'none';
    // Limpiar errores al cambiar
    screen.querySelector('#err-mesa').textContent      = '';
    screen.querySelector('#err-direccion').textContent = '';
  }

  radios.forEach(r => r.addEventListener('change', actualizarModalidad));
  actualizarModalidad();

  // Enviar por WhatsApp
  screen.querySelector('#btn-enviar-whatsapp').addEventListener('click', () => {
    const nombre    = screen.querySelector('#inp-nombre').value.trim();
    const modalidad = screen.querySelector('input[name="modalidad"]:checked')?.value;
    const mesa      = screen.querySelector('#inp-mesa')?.value.trim();
    const direccion = screen.querySelector('#inp-direccion')?.value.trim();
    const referencia= screen.querySelector('#inp-referencia')?.value.trim();

    // Validaciones
    let valido = true;

    if (!nombre) {
      screen.querySelector('#err-nombre').textContent = '⚠️ El nombre es obligatorio.';
      screen.querySelector('#inp-nombre').classList.add('error');
      valido = false;
    } else {
      screen.querySelector('#err-nombre').textContent = '';
      screen.querySelector('#inp-nombre').classList.remove('error');
    }

    if (modalidad === 'local' && !mesa) {
      screen.querySelector('#err-mesa').textContent = '⚠️ El número de mesa es obligatorio.';
      screen.querySelector('#inp-mesa').classList.add('error');
      valido = false;
    } else if (modalidad === 'local') {
      screen.querySelector('#err-mesa').textContent = '';
      screen.querySelector('#inp-mesa').classList.remove('error');
    }

    if (modalidad === 'delivery' && !direccion) {
      screen.querySelector('#err-direccion').textContent = '⚠️ La dirección es obligatoria.';
      screen.querySelector('#inp-direccion').classList.add('error');
      valido = false;
    } else if (modalidad === 'delivery') {
      screen.querySelector('#err-direccion').textContent = '';
      screen.querySelector('#inp-direccion').classList.remove('error');
    }

    if (!valido) return;

    // Generar URL y abrir WhatsApp
    const url = WA.generarURL({
      nombre, modalidad, mesa, direccion, referencia,
      items: Cart.obtener(),
      total: totalCentimos,
    });

    window.open(url, '_blank');

    // Mostrar banner de éxito
    const banner = screen.querySelector('#banner-exito');
    banner.classList.remove('oculto');
    banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  // Limpiar error on input
  screen.querySelector('#inp-nombre').addEventListener('input', () => {
    screen.querySelector('#err-nombre').textContent = '';
    screen.querySelector('#inp-nombre').classList.remove('error');
  });
  screen.querySelector('#inp-mesa')?.addEventListener('input', () => {
    screen.querySelector('#err-mesa').textContent = '';
    screen.querySelector('#inp-mesa').classList.remove('error');
  });
  screen.querySelector('#inp-direccion')?.addEventListener('input', () => {
    screen.querySelector('#err-direccion').textContent = '';
    screen.querySelector('#inp-direccion').classList.remove('error');
  });
}

/* ═══════════════════════════════════════════════════════════
   PANTALLA: INFORMACIÓN DEL NEGOCIO
   ═══════════════════════════════════════════════════════════ */

function renderInfo() {
  const screen = document.getElementById('screen-info');
  if (!screen) return;

  const horariosHTML = NEGOCIO.horarios.map(h => `
    <li class="horario-item">
      <span class="horario-dia">${escHtml(h.dia)}</span>
      <span class="horario-hora">${escHtml(h.hora)}</span>
    </li>`).join('');

  const redesHTML = [
    NEGOCIO.instagram ? `<a href="${escHtml(NEGOCIO.instagram)}" target="_blank" rel="noopener" class="red-social-btn">
      <span class="red-social-icon">📸</span>Instagram</a>` : '',
    NEGOCIO.facebook  ? `<a href="${escHtml(NEGOCIO.facebook)}" target="_blank" rel="noopener" class="red-social-btn">
      <span class="red-social-icon">📘</span>Facebook</a>`  : '',
    NEGOCIO.tiktok    ? `<a href="${escHtml(NEGOCIO.tiktok)}" target="_blank" rel="noopener" class="red-social-btn">
      <span class="red-social-icon">🎵</span>TikTok</a>`    : '',
  ].filter(Boolean).join('');

  screen.innerHTML = `
    <div class="topbar">
      <button class="btn-icon" id="btn-info-volver" aria-label="Volver">←</button>
      <span class="topbar-titulo">ℹ️ El Local</span>
      <div style="width:40px"></div>
    </div>

    <!-- Header con logo -->
    <div class="info-header">
      <div class="info-logo">CONVOCADOS</div>
      <div class="info-slogan">"${escHtml(NEGOCIO.slogan)}"</div>
    </div>

    <!-- Contacto -->
    <div class="info-card">
      <div class="info-card-titulo">📞 Contacto</div>
      <div class="info-card-fila">
        <div class="info-card-fila-left">
          <span class="info-card-fila-icon">📱</span>
          <div class="info-card-fila-texto">
            <strong>${escHtml(NEGOCIO.telefono)}</strong>
            WhatsApp / Llamadas
          </div>
        </div>
        <a href="https://wa.me/${escHtml(NEGOCIO.whatsapp)}" target="_blank" rel="noopener"
           class="btn btn-primary btn-sm" style="width:auto;white-space:nowrap">💬 Escribir</a>
      </div>
    </div>

    <!-- Horarios -->
    <div class="info-card">
      <div class="info-card-titulo">🕐 Horarios de atención</div>
      <ul class="horario-lista">${horariosHTML}</ul>
    </div>

    <!-- Dirección -->
    <div class="info-card">
      <div class="info-card-titulo">📍 Dirección</div>
      <div class="info-card-fila">
        <div class="info-card-fila-left">
          <span class="info-card-fila-icon">🗺️</span>
          <div class="info-card-fila-texto">
            <strong>${escHtml(NEGOCIO.direccion)}</strong>
          </div>
        </div>
        <a href="${escHtml(NEGOCIO.maps)}" target="_blank" rel="noopener"
           class="btn btn-outline btn-sm" style="width:auto;white-space:nowrap">Abrir Maps</a>
      </div>
    </div>

    <!-- Redes sociales -->
    ${redesHTML ? `
    <div class="info-card">
      <div class="info-card-titulo">📲 Redes sociales</div>
      <div class="redes-grid">${redesHTML}</div>
    </div>` : ''}

    <!-- Aviso datos de ejemplo -->
    <div class="aviso-datos">
      ⚠️ Datos de ejemplo — reemplazar con la información real del negocio en el archivo <code>public/js/data.js</code>.
    </div>

    <div style="height:20px"></div>
  `;

  screen.querySelector('#btn-info-volver').addEventListener('click', () => {
    mostrarPantalla('inicio');
  });
}
