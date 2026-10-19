<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QR — CONVOCADOS</title>
  <style>
    :root {
      --naranja: #FF6B00;
      --dorado:  #FFD700;
      --bg:      #0D0D0D;
      --texto:   #F0F0F0;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      background: var(--bg);
      color: var(--texto);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }

    .qr-card {
      background: #fff;
      border-radius: 20px;
      padding: 28px 32px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      max-width: 380px;
      width: 100%;
      box-shadow: 0 8px 40px rgba(255,107,0,0.3);
    }

    .qr-nombre {
      font-size: 1.6rem;
      font-weight: 900;
      letter-spacing: 3px;
      text-transform: uppercase;
      background: linear-gradient(135deg, var(--naranja), var(--dorado));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .qr-img-wrap {
      background: #fff;
      padding: 8px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .qr-img-wrap svg,
    .qr-img-wrap img {
      width: 240px;
      height: 240px;
      display: block;
    }

    .qr-instruccion {
      font-size: 0.88rem;
      color: #444;
      text-align: center;
      line-height: 1.5;
    }

    .qr-slogan {
      font-size: 0.82rem;
      color: #777;
      font-style: italic;
      text-align: center;
    }

    .qr-url {
      font-size: 0.72rem;
      color: #aaa;
      word-break: break-all;
      text-align: center;
    }

    .qr-footer {
      margin-top: 28px;
      text-align: center;
      color: #555;
      font-size: 0.78rem;
    }

    /* Botones de acción (solo en pantalla, ocultos al imprimir) */
    .qr-acciones {
      display: flex;
      gap: 12px;
      margin-top: 20px;
      flex-wrap: wrap;
      justify-content: center;
    }
    .qr-btn {
      padding: 10px 22px;
      border-radius: 99px;
      border: none;
      font-size: 0.88rem;
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .qr-btn-print {
      background: var(--naranja);
      color: #fff;
    }
    .qr-btn-print:hover { background: #e05a00; }
    .qr-btn-carta {
      background: transparent;
      border: 2px solid var(--naranja);
      color: var(--naranja);
    }
    .qr-btn-carta:hover { background: rgba(255,107,0,0.1); }

    /* Imprimir: ocultar botones, mostrar solo la tarjeta */
    @media print {
      body { background: #fff; padding: 0; justify-content: flex-start; }
      .qr-acciones { display: none !important; }
      .qr-card { box-shadow: none; }
      .qr-nombre { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>

<div class="qr-card">
  <div class="qr-nombre">CONVOCADOS</div>

  <div class="qr-img-wrap">
    {{-- Genera el QR con simple-qrcode --}}
    {!! QrCode::size(240)->style('round')->eye('circle')->color(13, 13, 13)->generate($url) !!}
  </div>

  <p class="qr-instruccion">
    📱 Escanea el código con tu celular<br>
    para ver la carta y hacer tu pedido
  </p>

  <p class="qr-slogan">"Alitas, brindis y buenos momentos"</p>

  <p class="qr-url">{{ $url }}</p>
</div>

<div class="qr-acciones">
  <button class="qr-btn qr-btn-print" onclick="window.print()">🖨️ Imprimir QR</button>
  <a href="{{ route('carta') }}" class="qr-btn qr-btn-carta">🍽️ Ver Carta</a>
</div>

<p class="qr-footer">
  Coloca este QR en cada mesa para que tus clientes<br>
  puedan pedir directamente desde su celular.
</p>

</body>
</html>
