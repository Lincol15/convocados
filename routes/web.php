<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CartaController;

/*
|--------------------------------------------------------------------------
| Rutas de CONVOCADOS
|--------------------------------------------------------------------------
*/

// Carta digital (SPA)
Route::get('/', [CartaController::class, 'index'])->name('carta');

// Página del QR imprimible
Route::get('/qr', [CartaController::class, 'qr'])->name('qr');
