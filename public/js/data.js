/**
 * data.js — Datos centralizados de CONVOCADOS
 * Para editar teléfono, dirección, horarios o productos, solo modifica este archivo.
 */

// ─── CONFIGURACIÓN DEL NEGOCIO ──────────────────────────────────────────────
const NEGOCIO = {
  nombre:    'CONVOCADOS',
  slogan:    'Alitas, brindis y buenos momentos',
  telefono:  '+51 965 370 205',
  whatsapp:  '51965370205',          // ← número real, no cambiar
  direccion: '[Reemplazar con dirección real]',
  maps:      'https://maps.google.com/?q=-12.0464,-77.0428', // ← reemplazar coords reales
  horarios: [
    { dia: 'Lunes a jueves', hora: '12:00 pm – 11:00 pm' },
    { dia: 'Viernes',        hora: '12:00 pm – 1:00 am'  },
    { dia: 'Sábado',         hora: '11:00 am – 1:00 am'  },
    { dia: 'Domingo',        hora: '11:00 am – 10:00 pm' },
  ],
  promo: {
    texto:    'Tabla Mixta + Limonada Frozen',
    precio:   'Solo S/ 55.00',
    activa:   true,
  },
};

// ─── CONSTANTES DE CATEGORÍAS ───────────────────────────────────────────────
const CATEGORIAS = [
  { id: 'alitas',    nombre: 'Alitas',             emoji: '🍗' },
  { id: 'burgers',   nombre: 'Hamburguesas',        emoji: '🍔' },
  { id: 'piqueos',   nombre: 'Piqueos',             emoji: '🧆' },
  { id: 'cocteles',  nombre: 'Cócteles y tragos',   emoji: '🍹' },
  { id: 'cervezas',  nombre: 'Cervezas',            emoji: '🍺' },
  { id: 'vinos',     nombre: 'Vinos',               emoji: '🍷' },
  { id: 'sinAlc',    nombre: 'Bebidas sin alcohol',  emoji: '🥤' },
];

// ─── OPCIONES GLOBALES DE ALITAS ─────────────────────────────────────────────
// precioCentimos = precio en céntimos (1 sol = 100 céntimos)
const ALITAS_PORCIONES = [
  { id: 'p6',  label: '6 unidades',  extra: 0     },   // precio base incluido
  { id: 'p12', label: '12 unidades', extra: 1500  },   // +S/ 15.00
  { id: 'p18', label: '18 unidades', extra: 2800  },   // +S/ 28.00
];

const ALITAS_MAX_SALSAS = { p6: 1, p12: 2, p18: 3 };

const ALITAS_SALSAS = [
  { id: 'bbq',       nombre: 'BBQ'        },
  { id: 'acevich',   nombre: 'Acevichada' },
  { id: 'bufalo',    nombre: 'Búfalo'     },
  { id: 'marac',     nombre: 'Maracuyá'   },
  { id: 'picante',   nombre: 'Picante'    },
];

const ALITAS_ADICIONALES = [
  { id: 'papas',     nombre: 'Papas fritas',      precio: 500  },  // +S/ 5.00
  { id: 'huanc',     nombre: 'Crema huancaína',   precio: 200  },  // +S/ 2.00
  { id: 'tart',      nombre: 'Crema tártara',     precio: 200  },  // +S/ 2.00
  { id: 'ranch',     nombre: 'Ranch',             precio: 200  },  // +S/ 2.00
];

// ─── ADICIONALES DE BURGERS ──────────────────────────────────────────────────
const BURGERS_ADICIONALES = [
  { id: 'queso',  nombre: 'Extra queso',  precio: 150 },  // +S/ 1.50
  { id: 'tocino', nombre: 'Extra tocino', precio: 200 },  // +S/ 2.00
  { id: 'huevo',  nombre: 'Huevo frito',  precio: 150 },  // +S/ 1.50
  { id: 'jalap',  nombre: 'Jalapeños',    precio: 100 },  // +S/ 1.00
];

// ─── PRESENTACIONES DE VINOS ─────────────────────────────────────────────────
const VINOS_PRESENTACIONES = [
  { id: 'copa',    label: 'Copa',    extra: 0    },  // precio base
  { id: 'botella', label: 'Botella', extra: 3500 },  // +S/ 35.00
];

// ─── CATÁLOGO DE PRODUCTOS ───────────────────────────────────────────────────
// precioCentimos: precio BASE en céntimos (sin extras)
// agotado: true bloquea el botón de agregar
// destacado: aparece en la sección "Destacados" del inicio
const PRODUCTOS = [

  // ── ALITAS ────────────────────────────────────────────────────────────────
  {
    id: 'al01',
    categoria:       'alitas',
    nombre:          'Alitas Mixtas',
    descripcion:     'Alitas crujientes bañadas en tu salsa favorita. Elige porción y hasta 3 salsas.',
    precioCentimos:  2200,   // S/ 22.00 base (porción de 6)
    imagen:          'https://placehold.co/600x400/1a1a1a/FF6B00?text=Alitas+Mixtas',
    destacado:       true,
    agotado:         false,
    alcoholico:      false,
    tipo:            'alitas',   // controla la pantalla de detalle
  },
  {
    id: 'al02',
    categoria:       'alitas',
    nombre:          'Alitas BBQ',
    descripcion:     'Glaseadas con BBQ casera, humeadas y caramelizadas.',
    precioCentimos:  2200,
    imagen:          'https://placehold.co/600x400/1a1a1a/FF6B00?text=Alitas+BBQ',
    destacado:       false,
    agotado:         false,
    alcoholico:      false,
    tipo:            'alitas',
  },
  {
    id: 'al03',
    categoria:       'alitas',
    nombre:          'Alitas Picantes',
    descripcion:     'Salsa picante intensa con toques cítricos.',
    precioCentimos:  2200,
    imagen:          'https://placehold.co/600x400/1a1a1a/FF6B00?text=Alitas+Picantes',
    destacado:       false,
    agotado:         false,
    alcoholico:      false,
    tipo:            'alitas',
  },

  // ── HAMBURGUESAS ─────────────────────────────────────────────────────────
  {
    id: 'hb01',
    categoria:       'burgers',
    nombre:          'Burger Clásica',
    descripcion:     'Pan brioche, carne 180g, lechuga, tomate, cebolla caramelizada y mayonesa de la casa.',
    precioCentimos:  2800,   // S/ 28.00
    imagen:          'https://placehold.co/600x400/1a1a1a/FF6B00?text=Burger+Clásica',
    destacado:       true,
    agotado:         false,
    alcoholico:      false,
    tipo:            'burger',
  },
  {
    id: 'hb02',
    categoria:       'burgers',
    nombre:          'Burger Convocada',
    descripcion:     'Doble carne 120g c/u, doble queso cheddar, bacon crujiente y salsa especial.',
    precioCentimos:  3800,   // S/ 38.00
    imagen:          'https://placehold.co/600x400/1a1a1a/FFD700?text=Burger+Convocada',
    destacado:       true,
    agotado:         false,
    alcoholico:      false,
    tipo:            'burger',
  },
  {
    id: 'hb03',
    categoria:       'burgers',
    nombre:          'Burger de Pollo',
    descripcion:     'Pechuga apanada crujiente, coleslaw, pepinillos y ranch.',
    precioCentimos:  2600,   // S/ 26.00
    imagen:          'https://placehold.co/600x400/1a1a1a/FF6B00?text=Burger+de+Pollo',
    destacado:       false,
    agotado:         false,
    alcoholico:      false,
    tipo:            'burger',
  },

  // ── PIQUEOS ───────────────────────────────────────────────────────────────
  {
    id: 'pq01',
    categoria:       'piqueos',
    nombre:          'Papas Fritas',
    descripcion:     'Papas en bastón, doradas y crujientes.',
    precioCentimos:  1200,   // S/ 12.00
    imagen:          'https://placehold.co/600x400/1a1a1a/FF6B00?text=Papas+Fritas',
    destacado:       false,
    agotado:         false,
    alcoholico:      false,
    tipo:            'simple',
  },
  {
    id: 'pq02',
    categoria:       'piqueos',
    nombre:          'Aros de Cebolla',
    descripcion:     'Aros apanados, crocantes por fuera y suaves por dentro.',
    precioCentimos:  1500,   // S/ 15.00
    imagen:          'https://placehold.co/600x400/1a1a1a/FF6B00?text=Aros+de+Cebolla',
    destacado:       false,
    agotado:         false,
    alcoholico:      false,
    tipo:            'simple',
  },
  {
    id: 'pq03',
    categoria:       'piqueos',
    nombre:          'Tequeños de Queso',
    descripcion:     '8 tequeños artesanales rellenos de queso manchego fundido.',
    precioCentimos:  1800,   // S/ 18.00
    imagen:          'https://placehold.co/600x400/1a1a1a/FFD700?text=Tequeños',
    destacado:       true,
    agotado:         false,
    alcoholico:      false,
    tipo:            'simple',
  },
  {
    id: 'pq04',
    categoria:       'piqueos',
    nombre:          'Tabla Mixta Convocados',
    descripcion:     'Alitas (6), tequeños (4), papas fritas y dip. Ideal para compartir.',
    precioCentimos:  4500,   // S/ 45.00
    imagen:          'https://placehold.co/600x400/1a1a1a/FFD700?text=Tabla+Mixta',
    destacado:       true,
    agotado:         false,
    alcoholico:      false,
    tipo:            'simple',
  },

  // ── CÓCTELES Y TRAGOS ────────────────────────────────────────────────────
  {
    id: 'ct01',
    categoria:       'cocteles',
    nombre:          'Pisco Sour',
    descripcion:     'El clásico peruano. Pisco quebranta, limón, jarabe y clara de huevo.',
    precioCentimos:  2200,   // S/ 22.00
    imagen:          'https://placehold.co/600x400/1a1a1a/FFD700?text=Pisco+Sour',
    destacado:       true,
    agotado:         false,
    alcoholico:      true,
    tipo:            'simple',
  },
  {
    id: 'ct02',
    categoria:       'cocteles',
    nombre:          'Chilcano',
    descripcion:     'Pisco, ginger ale, limón y bitters de Angostura.',
    precioCentimos:  1800,   // S/ 18.00
    imagen:          'https://placehold.co/600x400/1a1a1a/FF6B00?text=Chilcano',
    destacado:       false,
    agotado:         false,
    alcoholico:      true,
    tipo:            'simple',
  },
  {
    id: 'ct03',
    categoria:       'cocteles',
    nombre:          'Margarita',
    descripcion:     'Tequila, triple sec, jugo de limón y sal en el borde.',
    precioCentimos:  2000,   // S/ 20.00
    imagen:          'https://placehold.co/600x400/1a1a1a/FF6B00?text=Margarita',
    destacado:       false,
    agotado:         false,
    alcoholico:      true,
    tipo:            'simple',
  },
  {
    id: 'ct04',
    categoria:       'cocteles',
    nombre:          'Mojito',
    descripcion:     'Ron blanco, hierbabuena fresca, azúcar, limón y soda.',
    precioCentimos:  1900,   // S/ 19.00
    imagen:          'https://placehold.co/600x400/1a1a1a/FF6B00?text=Mojito',
    destacado:       false,
    agotado:         false,
    alcoholico:      true,
    tipo:            'simple',
  },

  // ── CERVEZAS ─────────────────────────────────────────────────────────────
  {
    id: 'ce01',
    categoria:       'cervezas',
    nombre:          'Pilsen Callao',
    descripcion:     'Botella 620ml. La cerveza peruana de siempre.',
    precioCentimos:  1000,   // S/ 10.00
    imagen:          'https://placehold.co/600x400/1a1a1a/FF6B00?text=Pilsen+Callao',
    destacado:       false,
    agotado:         false,
    alcoholico:      true,
    tipo:            'simple',
  },
  {
    id: 'ce02',
    categoria:       'cervezas',
    nombre:          'Cusqueña Rubia',
    descripcion:     'Botella 620ml. Cerveza premium de malta y cebada andina.',
    precioCentimos:  1200,   // S/ 12.00
    imagen:          'https://placehold.co/600x400/1a1a1a/FFD700?text=Cusqueña+Rubia',
    destacado:       true,
    agotado:         false,
    alcoholico:      true,
    tipo:            'simple',
  },
  {
    id: 'ce03',
    categoria:       'cervezas',
    nombre:          'Artesanal IPA',
    descripcion:     'Lata 473ml. Lupulada intensa con notas cítricas y florales.',
    precioCentimos:  1800,   // S/ 18.00
    imagen:          'https://placehold.co/600x400/1a1a1a/FF6B00?text=Artesanal+IPA',
    destacado:       false,
    agotado:         false,
    alcoholico:      true,
    tipo:            'simple',
  },

  // ── VINOS ─────────────────────────────────────────────────────────────────
  {
    id: 'vi01',
    categoria:       'vinos',
    nombre:          'Vino Tinto Malbec',
    descripcion:     'Malbec argentino. Notas de frutos rojos y ciruela, final suave.',
    precioCentimos:  1800,   // S/ 18.00 (copa)
    imagen:          'https://placehold.co/600x400/1a1a1a/FFD700?text=Malbec',
    destacado:       false,
    agotado:         false,
    alcoholico:      true,
    tipo:            'vino',
  },
  {
    id: 'vi02',
    categoria:       'vinos',
    nombre:          'Sauvignon Blanc',
    descripcion:     'Fresco y afrutado, con notas de maracuyá y hierba fresca.',
    precioCentimos:  1800,   // S/ 18.00 (copa)
    imagen:          'https://placehold.co/600x400/1a1a1a/FFD700?text=Sauvignon+Blanc',
    destacado:       false,
    agotado:         false,
    alcoholico:      true,
    tipo:            'vino',
  },

  // ── BEBIDAS SIN ALCOHOL ───────────────────────────────────────────────────
  {
    id: 'sa01',
    categoria:       'sinAlc',
    nombre:          'Limonada Frozen',
    descripcion:     'Limonada helada con menta fresca. Refrescante y natural.',
    precioCentimos:  1000,   // S/ 10.00
    imagen:          'https://placehold.co/600x400/1a1a1a/FF6B00?text=Limonada+Frozen',
    destacado:       true,
    agotado:         false,
    alcoholico:      false,
    tipo:            'simple',
  },
  {
    id: 'sa02',
    categoria:       'sinAlc',
    nombre:          'Gaseosa',
    descripcion:     'Coca-Cola, Inca Kola o Sprite. Botella 500ml.',
    precioCentimos:   600,   // S/ 6.00
    imagen:          'https://placehold.co/600x400/1a1a1a/FF6B00?text=Gaseosa',
    destacado:       false,
    agotado:         false,
    alcoholico:      false,
    tipo:            'simple',
  },
  {
    id: 'sa03',
    categoria:       'sinAlc',
    nombre:          'Agua Mineral',
    descripcion:     'Sin gas o con gas. Botella 625ml.',
    precioCentimos:   400,   // S/ 4.00
    imagen:          'https://placehold.co/600x400/1a1a1a/FF6B00?text=Agua+Mineral',
    destacado:       false,
    agotado:         false,
    alcoholico:      false,
    tipo:            'simple',
  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

/** Convierte céntimos a string "S/ X.XX" */
function formatPrecio(centimos) {
  return 'S/ ' + (centimos / 100).toFixed(2);
}

/** Busca producto por id */
function getProducto(id) {
  return PRODUCTOS.find(p => p.id === id) || null;
}

/**
 * Precio por unidad en céntimos según las opciones elegidas
 * (porción de alitas, presentación de vino y adicionales).
 */
function calcularPrecioUnitario(prod, opciones) {
  const op          = opciones || {};
  const adicionales = Array.isArray(op.adicionales) ? op.adicionales : [];
  let base = prod.precioCentimos;

  // Extra porción alitas
  if (prod.tipo === 'alitas' && op.porcionId) {
    const p = ALITAS_PORCIONES.find(p => p.id === op.porcionId);
    if (p) base += p.extra;
  }

  // Extra presentación vino
  if (prod.tipo === 'vino' && op.presentacionId) {
    const pres = VINOS_PRESENTACIONES.find(v => v.id === op.presentacionId);
    if (pres) base += pres.extra;
  }

  // Adicionales
  const listaAdicionales =
    prod.tipo === 'alitas' ? ALITAS_ADICIONALES :
    prod.tipo === 'burger' ? BURGERS_ADICIONALES : [];
  adicionales.forEach(id => {
    const a = listaAdicionales.find(a => a.id === id);
    if (a) base += a.precio;
  });

  return base;
}

/** Filtra productos por categoría; 'todos' devuelve todos */
function filtrarPorCategoria(catId) {
  if (catId === 'todos') return PRODUCTOS;
  return PRODUCTOS.filter(p => p.categoria === catId);
}

/** Busca productos por texto (nombre o descripción) */
function buscarProductos(texto) {
  const t = texto.toLowerCase().trim();
  if (!t) return PRODUCTOS;
  return PRODUCTOS.filter(p =>
    p.nombre.toLowerCase().includes(t) ||
    p.descripcion.toLowerCase().includes(t)
  );
}

/** Productos destacados */
function getDestacados() {
  return PRODUCTOS.filter(p => p.destacado && !p.agotado);
}
