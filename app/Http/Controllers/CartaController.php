<?php

namespace App\Http\Controllers;

class CartaController extends Controller
{
    /**
     * Muestra la carta digital (SPA).
     */
    public function index()
    {
        return view('carta');
    }

    /**
     * Genera y muestra el código QR que apunta a la carta.
     * La URL es siempre la de la propia carta, para que nadie pueda
     * generar un QR con la marca que lleve a otro sitio.
     */
    public function qr()
    {
        $url = url('/');
        return view('qr', compact('url'));
    }
}
