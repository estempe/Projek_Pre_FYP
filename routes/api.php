<?php

use Illuminate\Support\Facades\Route;
use App\Models\Table_Soal;
use App\Models\GameSession;
use App\Models\Team;
use App\Http\Controllers\Api\AuthController;
use Illuminate\Http\Request;

// Pintu untuk mengambil data soal dari database
Route::get('/soal', function () {
    return Table_Soal::all();
});

// Pintu khusus untuk Login Panitia
Route::post('/login', [AuthController::class, 'login']);


Route::post('/check-session', function (Request $request) {
    $session = GameSession::where('session_code', $request->session_code)->first();

    if ($session) {
        return response()->json([
            'status' => 'found',
            'data' => $session
        ]);
    }

    return response()->json([
        'status' => 'not_found'
    ], 404);
});

Route::get('/getTeams', function () {
    return Team::all();
});

Route::get('/session-status/{code}', function ($code) {
    $session = GameSession::where('session_code', $code)->first();

    return response()->json([
        'status' => $session->status
    ]);
});

Route::post('/rejoin', function (Request $request) {
    $session = GameSession::where('session_code', $request->session_code)->first();

    if (!$session) {
        return response()->json(['status' => 'session_not_found'], 404);
    }

    $team = Team::where('name', $request->name)
                ->where('game_session_id', $session->id)
                ->first();

    if ($team) {
        return response()->json([
            'status' => 'found',
            'team' => $team,
            'session' => $session
        ]);
    }

    return response()->json(['status' => 'team_not_found'], 404);
});