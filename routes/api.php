<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\GameSessionController;

// Rute Login
Route::post('/login', [AuthController::class, 'login']);

// Semua route yang butuh login
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/sessions', [GameSessionController::class, 'index']); 
    Route::post('/sessions', [GameSessionController::class, 'store']);
    Route::get('/sessions/{id}', [GameSessionController::class, 'show']);
    Route::post('/sessions/{id}/start', [GameSessionController::class, 'start']);

    // 🔥 Gabungan dari kamu + seany
    Route::get('/sessions/{id}/live', [GameSessionController::class, 'getLiveData']);
    Route::post('/sessions/{id}/finish-pos', [GameSessionController::class, 'finishPos']);
    Route::get('/sessions/{id}/leaderboard', [GameSessionController::class, 'getLeaderboard']);
    Route::post('/sessions/{id}/redeem', [GameSessionController::class, 'redeemCoins']);
});