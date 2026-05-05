<?php
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use App\Models\GameSession;
use App\Models\Team;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\GameSessionController;


// Rute Login (Bebas diakses)
Route::post('/login', [AuthController::class, 'login']);

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

Route::post('/create-teams', function (Request $request) {

    $session = GameSession::where('session_code', $request->session_code)->first();

    if (!$session) {
        return response()->json([
            'status' => 'session_not_found'
        ], 404);
    }

    // cek duplicate nama team di session yg sama
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

    // 🔥 CREATE TEAM
    $newTeam = Team::create([
        'game_session_id' => $session->id,
        'name' => $request->team_name,
        'major' => $request->team_major,

        // default value
        'score' => 0,
        'code' => strtoupper(substr(md5(uniqid()), 0, 6)), // random code
        'is_redeemed' => 0,
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
        return response()->json([
            'status' => 'team_not_found'
        ], 404);
    }

    // 2. ambil posts berdasarkan team_id
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


Route::post('/leaderboard', function (Request $request) {

    // 1. cari session
    $session = GameSession::where('session_code', $request->session_code)->first();

    if (!$session) {
        return response()->json([
            'status' => 'session_not_found'
        ], 404);
    }

    // 2. ambil leaderboard + total coins
    $leaderboard = DB::table('teams')
        ->leftJoin('team_posts', function ($join) {
            $join->on('teams.id', '=', 'team_posts.team_id');
        })
        ->where('teams.game_session_id', $session->id)
        ->select(
            'teams.id',
            'teams.name',
            'teams.major',

            // total coins (reward saja)
            DB::raw('COALESCE(SUM(CASE WHEN team_posts.status = "reward" THEN team_posts.earned_coins ELSE 0 END), 0) as total_coins'),

            // total post
            DB::raw('COUNT(team_posts.id) as total_posts'),

            // jumlah post selesai
            DB::raw('SUM(CASE WHEN team_posts.status = "reward" THEN 1 ELSE 0 END) as completed_posts')
        )
        ->groupBy('teams.id', 'teams.name', 'teams.major')
        ->orderByDesc('total_coins')
        ->get();

    // 3. tentukan isFinished
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

    if (!$session) {
        return response()->json([
            'status' => 'session_not_found'
        ], 404);
    }

    return response()->json([
        'status' => 'success',
        'data' => [
            'id' => $session->id,
            'name' => $session->name,
            'session_code' => $session->session_code,
            'start_time' => $session->start_time,
            'duration' => $session->duration,
            'redeem_name' => $session->redeem_name,
            'redeem_location' => $session->redeem_location,
            'qr_link' => $session->qr_link,
            'qr_image_path' => $session->qr_image_path,
            'status' => $session->status,
        ]
    ]);
});
Route::post('/getTeamCoins', function (Request $request) {

    // 1. cari session
    $session = GameSession::where('session_code', $request->session_code)->first();

    if (!$session) {
        return response()->json([
            'status' => 'session_not_found'
        ], 404);
    }

    // 2. cari team
    $team = Team::where('game_session_id', $session->id)
                ->where('name', $request->team_name)
                ->first();

    if (!$team) {
        return response()->json([
            'status' => 'team_not_found'
        ], 404);
    }

    // 3. ambil total coin dari team_posts
    $totalCoins = DB::table('team_posts')
        ->where('team_id', $team->id)
        ->where('status', 'reward') // 🔥 penting
        ->sum('earned_coins');

    return response()->json([
        'status' => 'success',
        'team' => $team,
        'total_coins' => $totalCoins
    ]);
});

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
