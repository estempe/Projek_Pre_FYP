<?php
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use App\Models\GameSession;
use App\Models\Team;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\GameSessionController;
use App\Http\Controllers\Api\TeamController; 

// ==========================================================
// --- RUTE PUBLIK (TIDAK PERLU LOGIN, UNTUK MAHASISWA) ---
// ==========================================================

Route::post('/login', [AuthController::class, 'login']);

// --- RUTE API MAHASISWA ---

Route::post('/check-session', function (Request $request) {
    $session = GameSession::where('session_code', $request->session_code)->first();

    if ($session) {
        return response()->json([
            'status' => 'found',
            'data' => $session
        ]);
    }

    return response()->json(['status' => 'not_found'], 404);
});

Route::post('/create-teams', function (Request $request) {
    $session = GameSession::where('session_code', $request->session_code)->first();

    if (!$session) {
        return response()->json(['status' => 'session_not_found'], 404);
    }

    // Cek duplicate nama team
    $existingTeam = Team::where('game_session_id', $session->id)
                    ->where('name', $request->team_name)
                    ->where('major', $request->team_major)
                    ->first();

    if ($existingTeam) {
        return response()->json([
            'status' => 'team_exists',
            'team' => $existingTeam
        ]);
    }

    // CREATE TEAM
    $newTeam = Team::create([
        'game_session_id' => $session->id,
        'name'            => $request->team_name,
        'major'           => $request->team_major,
        'total_coins'     => 0, 
        'code'            => strtoupper(substr(md5(uniqid()), 0, 6)), 
        'is_redeemed'     => 0,
        'redeemed_amount' => 0,
    ]);

    return response()->json([
        'status' => 'team_created',
        'team' => $newTeam
    ]);
});

Route::post('/team-posts', function (Request $request) {
    $session = GameSession::where('session_code', $request->session_code)->first();
    $team = Team::where('game_session_id', $session->id)
                ->where('name', $request->team_name)
                ->first();

    if (!$team) {
        return response()->json(['status' => 'team_not_found'], 404);
    }

    $posts = DB::table('team_posts')
        ->join('posts', 'team_posts.post_id', '=', 'posts.id')
        ->where('team_posts.team_id', $team->id)
        ->select(
            'posts.id',
            'posts.name',
            'posts.location',
            'posts.max_duration',
            'team_posts.status',
            'team_posts.earned_coins',
            'team_posts.check_in_time'
        )
        ->get();

    return response()->json([
        'status' => 'success',
        'team' => $team,
        'data' => $posts
    ]);
});

Route::get('/getTeams', function () {
    return Team::all();
});

Route::get('/session-status/{code}', function ($code) {
    $session = GameSession::where('session_code', $code)->first();
    return response()->json(['status' => $session->status ?? 'not_found']);
});

Route::post('/rejoin', function (Request $request) {
    $session = GameSession::where('session_code', $request->session_code)->first();

    if (!$session) return response()->json(['status' => 'session_not_found'], 404);

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

Route::post('/leaderboard', function (Request $request) {
    $session = GameSession::where('session_code', $request->session_code)->first();

    if (!$session) return response()->json(['status' => 'session_not_found'], 404);

    $leaderboard = DB::table('teams')
        ->leftJoin('team_posts', function ($join) {
            $join->on('teams.id', '=', 'team_posts.team_id');
        })
        ->where('teams.game_session_id', $session->id)
        ->select(
            'teams.id',
            'teams.name',
            'teams.major',
            // 🔥 PERBAIKAN: Ubah "reward" menjadi "completed"
            DB::raw('COALESCE(SUM(CASE WHEN team_posts.status = "completed" THEN team_posts.earned_coins ELSE 0 END), 0) as total_coins'),
            DB::raw('COUNT(team_posts.id) as total_posts'),
            // 🔥 PERBAIKAN: Ubah "reward" menjadi "completed"
            DB::raw('SUM(CASE WHEN team_posts.status = "completed" THEN 1 ELSE 0 END) as completed_posts')
        )
        ->groupBy('teams.id', 'teams.name', 'teams.major')
        ->orderByDesc('total_coins')
        ->get();

    $leaderboard = $leaderboard->map(function ($team) {
        $team->isFinished = ($team->total_posts > 0 && $team->total_posts == $team->completed_posts);
        return $team;
    });

    return response()->json([
        'status' => 'success',
        'data' => $leaderboard
    ]);
});

Route::post('/sessionData', function (Request $request) {
    $session = GameSession::where('session_code', $request->session_code)->first();

    if (!$session) return response()->json(['status' => 'session_not_found'], 404);

    return response()->json([
        'status' => 'success',
        'data' => $session
    ]);
});

Route::post('/getTeamCoins', function (Request $request) {
    $session = GameSession::where('session_code', $request->session_code)->first();

    if (!$session) return response()->json(['status' => 'session_not_found'], 404);

    $team = Team::where('game_session_id', $session->id)
                ->where('name', $request->team_name)
                ->first();

    if (!$team) return response()->json(['status' => 'team_not_found'], 404);

    $totalCoins = DB::table('team_posts')
        ->where('team_id', $team->id)
        // 🔥 PERBAIKAN: Ubah "reward" menjadi "completed"
        ->where('status', 'completed') 
        ->sum('earned_coins');

    return response()->json([
        'status' => 'success',
        'team' => $team,
        'total_coins' => $totalCoins
    ]);
});

// ==========================================================
// --- RUTE PRIVATE (WAJIB LOGIN SUPERADMIN / PIC) ---
// ==========================================================

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/sessions', [GameSessionController::class, 'index']);
    Route::post('/sessions', [GameSessionController::class, 'store']);
    Route::get('/sessions/{id}', [GameSessionController::class, 'show']);
    Route::put('/sessions/{id}', [GameSessionController::class, 'update']);
    Route::post('/sessions/{id}/start', [GameSessionController::class, 'start']);
    Route::post('/sessions/{id}/end', [GameSessionController::class, 'endSession']);
    
    Route::get('/sessions/{id}/live', [GameSessionController::class, 'getLiveData']);
    Route::post('/sessions/{id}/finish-pos', [GameSessionController::class, 'finishPos']);
    Route::get('/sessions/{id}/leaderboard', [GameSessionController::class, 'getLeaderboard']);
    Route::post('/sessions/{id}/redeem', [GameSessionController::class, 'redeemCoins']);

    Route::delete('/teams/{id}', [TeamController::class, 'destroy']);
});