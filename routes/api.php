<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\GameSessionController;

// Rute Login (Bebas diakses)
Route::post('/login', [AuthController::class, 'login']);

// Rute yang wajib pakai Token (Sudah Login)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Pintu untuk MENGAMBIL daftar sesi
    Route::get('/sessions', [GameSessionController::class, 'index']); 
    
    // Pintu untuk MEMBUAT sesi game baru
    Route::post('/sessions', [GameSessionController::class, 'store']);

    // Pintu untuk mengambil detail SATU sesi berdasarkan ID
    Route::get('/sessions/{id}', [GameSessionController::class, 'show']);
    
    // Pintu untuk mengubah status sesi menjadi 'live' (Mulai Sekarang)
    Route::post('/sessions/{id}/start', [GameSessionController::class, 'start']);
});