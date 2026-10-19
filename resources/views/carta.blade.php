<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="theme-color" content="#0D0D0D">
  <meta name="description" content="Carta digital de CONVOCADOS — Alitas, brindis y buenos momentos">

  <!-- PWA / iOS -->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="CONVOCADOS">
  <meta name="mobile-web-app-capable" content="yes">

  <!-- Open Graph (compartir en redes) -->
  <meta property="og:title"       content="CONVOCADOS — Carta Digital">
  <meta property="og:description" content="Alitas, brindis y buenos momentos. Pide desde tu celular.">
  <meta property="og:type"        content="website">

  <title>CONVOCADOS — Carta Digital</title>

  <!-- CSS -->
  <link rel="stylesheet" href="{{ asset('css/styles.css') }}">

  <!-- Favicon emoji fallback -->
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍗</text></svg>">
</head>
<body>

<!-- ═══════════════════════════════════════════════
     CONTENEDOR PRINCIPAL DE LA SPA
     ═══════════════════════════════════════════════ -->
<div id="app">

  <!-- ── PANTALLA: INICIO ──────────────────────── -->
  <section id="screen-inicio" class="screen" role="main" aria-label="Inicio"></section>

  <!-- ── PANTALLA: CARTA ───────────────────────── -->
  <section id="screen-carta" class="screen" role="main" aria-label="Carta de productos"></section>

  <!-- ── PANTALLA: DETALLE ─────────────────────── -->
  <section id="screen-detalle" class="screen" role="main" aria-label="Detalle del producto"></section>

  <!-- ── PANTALLA: CARRITO ─────────────────────── -->
  <section id="screen-carrito" class="screen" role="main" aria-label="Mi pedido"></section>

  <!-- ── PANTALLA: DATOS DEL PEDIDO ────────────── -->
  <section id="screen-datos" class="screen" role="main" aria-label="Datos del pedido"></section>

  <!-- ── PANTALLA: INFO DEL NEGOCIO ────────────── -->
  <section id="screen-info" class="screen" role="main" aria-label="Información del negocio"></section>

  <!-- ══════════════════════════════════════════════
       BOTÓN CARRITO FLOTANTE (visible en todas)
       ══════════════════════════════════════════════ -->
  <button id="btn-carrito-flotante" aria-label="Ver mi pedido" title="Mi pedido">
    🛒
    <span class="carrito-badge oculto" id="carrito-badge" aria-live="polite">0</span>
  </button>

  <!-- ══════════════════════════════════════════════
       NAVEGACIÓN INFERIOR
       ══════════════════════════════════════════════ -->
  <nav class="bottom-nav" role="navigation" aria-label="Navegación principal">

    <button class="nav-item activo" data-screen="inicio" aria-label="Inicio">
      <span class="nav-icon">🏠</span>
      <span>Inicio</span>
    </button>

    <button class="nav-item" data-screen="carta" aria-label="La carta">
      <span class="nav-icon">🍽️</span>
      <span>Carta</span>
    </button>

    <button class="nav-item" data-screen="carrito" aria-label="Mi pedido">
      <span class="nav-icon">🛒</span>
      <span>
        Pedido
        <span id="carrito-badge-nav"
              style="display:none;background:var(--naranja);color:#fff;font-size:0.6rem;
                     font-weight:900;border-radius:99px;padding:1px 5px;margin-left:3px;
                     vertical-align:middle"
              aria-live="polite"></span>
      </span>
    </button>

    <button class="nav-item" data-screen="info" aria-label="Info del local">
      <span class="nav-icon">ℹ️</span>
      <span>Local</span>
    </button>

  </nav>

</div><!-- /#app -->

<!-- ══════════════════════════════════════════════
     SCRIPTS (orden de dependencias)
     ══════════════════════════════════════════════ -->
<script src="{{ asset('js/data.js') }}"></script>
<script src="{{ asset('js/cart.js') }}"></script>
<script src="{{ asset('js/whatsapp.js') }}"></script>
<script src="{{ asset('js/ui.js') }}"></script>
<script src="{{ asset('js/main.js') }}"></script>

</body>
</html>
