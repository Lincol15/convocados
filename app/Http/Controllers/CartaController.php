<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

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
     */
    public function qr(Request $request)
    {
        $url = $request->query('url', url('/'));
        return view('qr', compact('url'));
    }
}
