<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\GameSessionController;
use App\Http\Controllers\Api\TeamController; 

// --- RUTE PUBLIK (TIDAK PERLU LOGIN, UNTUK MAHASISWA) ---
Route::post('/login', [AuthController::class, 'login']);
Route::post('/check-session', [TeamController::class, 'checkSession']);
Route::post('/create-teams', [TeamController::class, 'store']);


// --- RUTE PRIVATE (WAJIB LOGIN SUPERADMIN / PIC) ---
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Rute Game Session
    Route::get('/sessions', [GameSessionController::class, 'index']);
    Route::post('/sessions', [GameSessionController::class, 'store']);
    Route::get('/sessions/{id}', [GameSessionController::class, 'show']);
    Route::post('/sessions/{id}/start', [GameSessionController::class, 'start']);
    Route::post('/sessions/{id}/end', [GameSessionController::class, 'endSession']);
    
    // Rute Live, Leaderboard, & Redeem
    Route::get('/sessions/{id}/live', [GameSessionController::class, 'getLiveData']);
    Route::post('/sessions/{id}/finish-pos', [GameSessionController::class, 'finishPos']);
    Route::get('/sessions/{id}/leaderboard', [GameSessionController::class, 'getLeaderboard']);
    Route::post('/sessions/{id}/redeem', [GameSessionController::class, 'redeemCoins']);

    // Rute Delete Team (Kick)
    Route::delete('/teams/{id}', [TeamController::class, 'destroy']);
});