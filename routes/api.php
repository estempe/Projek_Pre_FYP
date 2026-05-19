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
// --- RUTE PUBLIK (MAHASISWA) ---
// ==========================================================

Route::post('/login', [AuthController::class, 'login']);
Route::post('/student-sync', [App\Http\Controllers\Api\GameSessionController::class, 'studentGameplaySync']);

Route::post('/check-session', function (Request $request) {
    $session = GameSession::where('session_code', $request->session_code)->first();
    if ($session) return response()->json(['status' => 'found', 'data' => $session]);
    return response()->json(['status' => 'not_found'], 404);
});

Route::post('/create-teams', function (Request $request) {
    $session = GameSession::where('session_code', $request->session_code)->first();
    if (!$session) return response()->json(['status' => 'session_not_found'], 404);

    if ($session->status === 'live') return response()->json(['status' => 'session_started'], 400);
    if ($session->status === 'ended') return response()->json(['status' => 'session_ended'], 400);

    $existingTeam = Team::where('game_session_id', $session->id)
                    ->where('name', $request->team_name)
                    ->first();

    if ($existingTeam) return response()->json(['status' => 'team_exists', 'team' => $existingTeam]);

    $emergencyCode = strtoupper(substr(md5(uniqid()), 0, 6));

    $teamCount = Team::where('game_session_id', $session->id)->count();

    $newTeam = Team::create([
        'game_session_id' => $session->id,
        'name'            => $request->team_name,
        'major'           => $request->team_major,
        'total_coins'     => 0, 
        'emergency_code'  => $emergencyCode, 
        'is_redeemed'     => 0,
        'redeemed_amount' => 0,
    ]);

    $posts = DB::table('posts')->where('game_session_id', $session->id)->orderBy('id')->get();

    if ($posts->count() > 0) {
        $shiftIndex = $teamCount % $posts->count();
        
        $shiftedPosts = $posts->slice($shiftIndex)->merge($posts->take($shiftIndex));

        $teamPostsData = [];
        $now = now();
        
        foreach ($shiftedPosts as $post) {
            $teamPostsData[] = [
                'team_id'      => $newTeam->id,
                'post_id'      => $post->id,
                'status'       => 'locked',
                'earned_coins' => 0,
                'created_at'   => $now,
                'updated_at'   => $now,
            ];
        }
        
        // Insert semua jadwal pos untuk tim ini ke database
        DB::table('team_posts')->insert($teamPostsData);
    }

    return response()->json(['status' => 'team_created', 'team' => $newTeam]);
});

Route::post('/team-posts', function (Request $request) {
    $session = GameSession::where('session_code', $request->session_code)->first();
    if (!$session) return response()->json(['status' => 'session_not_found'], 404);

    $team = Team::where('game_session_id', $session->id)->where('name', $request->team_name)->first();
    if (!$team) return response()->json(['status' => 'team_not_found'], 404);

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
            'team_posts.check_in_time' // 
        )
        ->orderBy('team_posts.id', 'asc')
        ->get();

    return response()->json(['status' => 'success', 'team' => $team, 'data' => $posts]);
});

Route::get('/getTeams', function (Request $request) {
    $session = GameSession::where('session_code', $request->query('session_code'))->first();
    if (!$session) return response()->json([]);
    return Team::where('game_session_id', $session->id)->get();
});

Route::get('/session-status/{code}', function ($code) {
    $session = GameSession::where('session_code', $code)->first();
    if (!$session) return response()->json(['status' => 'not_found']);

    $remaining_seconds = 0;
    if ($session->status === 'live' && $session->start_time && $session->duration) {
        $start = \Carbon\Carbon::parse($session->start_time);
        
        $parts = explode(':', $session->duration);
        $hours = isset($parts[0]) ? (int)$parts[0] : 0;
        $minutes = isset($parts[1]) ? (int)$parts[1] : 0;
        $seconds = isset($parts[2]) ? (int)$parts[2] : 0;

        $end = $start->copy()->addHours($hours)->addMinutes($minutes)->addSeconds($seconds);
        $now = \Carbon\Carbon::now();
        
        $remaining_seconds = $now->diffInSeconds($end, false);
        if ($remaining_seconds < 0) $remaining_seconds = 0;
    }

    return response()->json([
        'status' => $session->status,
        'remaining_seconds' => $remaining_seconds
    ]);
});

Route::post('/rejoin', function (Illuminate\Http\Request $request) {
    $session = \App\Models\GameSession::where('session_code', $request->session_code)->first();
    
    if (!$session) {
        return response()->json(['status' => 'session_not_found'], 404);
    }

    // CARI TIM BERDASARKAN NAMA DAN KODE DARURAT
    $team = \App\Models\Team::where('game_session_id', $session->id)
                ->where('name', $request->name)
                ->where('emergency_code', $request->emergency_code) // <--- INI KUNCI UTAMANYA!
                ->first();

    if (!$team) {
        return response()->json(['status' => 'team_not_found'], 404);
    }

    return response()->json(['status' => 'found', 'team' => $team]);
});

Route::post('/leaderboard', function (Request $request) {
    $session = GameSession::where('session_code', $request->session_code)->first();
    if (!$session) return response()->json(['status' => 'session_not_found'], 404);
    
    $leaderboard = DB::table('teams')
        ->leftJoin('team_posts', function ($join) { $join->on('teams.id', '=', 'team_posts.team_id'); })
        ->where('teams.game_session_id', $session->id)
        ->select('teams.id', 'teams.name', 'teams.major', DB::raw('COALESCE(SUM(CASE WHEN team_posts.status = "completed" THEN team_posts.earned_coins ELSE 0 END), 0) as total_coins'), DB::raw('COUNT(team_posts.id) as total_posts'), DB::raw('SUM(CASE WHEN team_posts.status = "completed" THEN 1 ELSE 0 END) as completed_posts'))
        ->groupBy('teams.id', 'teams.name', 'teams.major')
        ->orderByDesc('total_coins')->get();
        
    $leaderboard = $leaderboard->map(function ($team) {
        $team->isFinished = ($team->total_posts > 0 && $team->total_posts == $team->completed_posts);
        return $team;
    });
        
    return response()->json([
        'status' => 'success', 
        'success' => true,
        'session_status' => $session->status, 
        'data' => $leaderboard
    ]);
});

Route::post('/sessionData', function (Request $request) {
    $session = GameSession::where('session_code', $request->session_code)->first();
    if (!$session) return response()->json(['status' => 'session_not_found'], 404);
    return response()->json(['status' => 'success', 'data' => $session]);
});
Route::post('/getTeamCoins', function (Request $request) {
    $session = GameSession::where('session_code', $request->session_code)->first();
    if (!$session) return response()->json(['status' => 'session_not_found'], 404);
    $team = Team::where('game_session_id', $session->id)->where('name', $request->team_name)->first();
    if (!$team) return response()->json(['status' => 'team_not_found'], 404);
    $totalCoins = DB::table('team_posts')->where('team_id', $team->id)->where('status', 'completed')->sum('earned_coins');
    return response()->json(['status' => 'success', 'team' => $team, 'total_coins' => $totalCoins]);
});

// ==========================================================
// --- RUTE PRIVATE (WAJIB LOGIN SUPERADMIN / PIC) ---
// ==========================================================
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) { return $request->user(); });
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
    Route::delete('/sessions/{id}/delete', [App\Http\Controllers\Api\GameSessionController::class, 'destroySession']);
    Route::post('/sessions/{id}/checkin-pos', function (Illuminate\Http\Request $request, $id) {
    $teamPost = Illuminate\Support\Facades\DB::table('team_posts')
        ->where('team_id', $request->team_id)
        ->where('post_id', $request->post_id)
        ->first();

    if (!$teamPost) return response()->json(['success' => false, 'message' => 'Data tidak ditemukan']);

    Illuminate\Support\Facades\DB::table('team_posts')
        ->where('id', $teamPost->id)
        ->update([
            'status' => 'active',
            'check_in_time' => now()
        ]);

    return response()->json(['success' => true]);
});
});