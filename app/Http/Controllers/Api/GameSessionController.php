<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\GameSession;
use Illuminate\Support\Str;
use App\Models\Post;
use Illuminate\Support\Facades\Storage;

class GameSessionController extends Controller
{
    public function index(Request $request)
    {
        $sessions = GameSession::select('id', 'name', 'session_code', 'start_time', 'duration', 'status')
            ->orderBy('start_time', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Berhasil mengambil daftar sesi',
            'data'    => $sessions
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'            => 'required|string|max:255',
            'start_time'      => 'required|date',
            'duration'        => 'required|date_format:H:i',
            'redeem_name'     => 'required|string',
            'redeem_location' => 'required|string',
            'qr_link'         => 'nullable|string',
            'qr_image'        => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $kodeSesi = strtoupper(Str::random(6));

        $imagePath = null;
        if ($request->hasFile('qr_image')) {
            $imagePath = $request->file('qr_image')->store('qr_images', 'public');
        }

        $session = GameSession::create([
            'session_code'    => $kodeSesi,
            'name'            => $request->name,
            'start_time'      => $request->start_time,
            'duration'        => $request->duration,
            'redeem_name'     => $request->redeem_name,
            'redeem_location' => $request->redeem_location,
            'qr_link'         => $request->qr_link,
            'qr_image_path'   => $imagePath,
            'status'          => 'upcoming',
        ]);

        if ($request->pos_list) {
            $posArray = json_decode($request->pos_list, true);
            if (is_array($posArray)) {
                foreach ($posArray as $posItem) {
                    Post::create([
                        'game_session_id' => $session->id,
                        'name'            => $posItem['name'] ?: 'Pos Default',
                        'location'        => $posItem['location'] ?: 'Belum diatur',
                        // sementara hardcode karena gak dipakai
                        'max_duration'    => '00:00:00',
                    ]);
                }
            }
        }

        return response()->json(['success' => true, 'message' => 'Sesi berhasil dibuat!', 'data' => $session], 201);
    }

    public function show($id)
    {
        $session = GameSession::with('posts')->find($id);
        if (!$session) return response()->json(['success' => false, 'message' => 'Sesi tidak ditemukan'], 404);
        return response()->json(['success' => true, 'data' => $session], 200);
    }

    public function start($id)
    {
        $session = GameSession::find($id);
        if (!$session) return response()->json(['success' => false, 'message' => 'Sesi tidak ditemukan'], 404);
        if ($session->status === 'live') return response()->json(['success' => true, 'message' => 'Sesi sudah berjalan!'], 200);

        $session->start_time = now();
        $session->status = 'live';
        $session->save();

        return response()->json(['success' => true, 'message' => 'Sesi dimulai!'], 200);
    }

    public function getLiveData($id)
    {
        $session = GameSession::with('posts')->find($id);
        if (!$session) return response()->json(['success' => false, 'message' => 'Sesi tidak ditemukan'], 404);
        $session->setRelation('posts', $session->posts->sortBy('id')->values());

        $remainingSeconds = 0;
        if ($session->start_time && $session->status === 'live') {
            $durationParts = explode(':', $session->duration);
            $hours = isset($durationParts[0]) ? (int)$durationParts[0] : 0;
            $minutes = isset($durationParts[1]) ? (int)$durationParts[1] : 0;
            $seconds = isset($durationParts[2]) ? (int)$durationParts[2] : 0;

            $totalDurationSec = ($hours * 3600) + ($minutes * 60) + $seconds;
            $waktuMulai = strtotime($session->start_time);
            $waktuSekarang = time();
            $elapsedSec = max(0, $waktuSekarang - $waktuMulai);
            $remainingSeconds = (int) ceil(max(0, $totalDurationSec - $elapsedSec));
        }

        $teams = \App\Models\Team::where('game_session_id', $id)
            ->select('id', 'name', 'major', 'total_coins')
            ->orderBy('id', 'asc')
            ->get();

        $teamPosts = \App\Models\TeamPost::whereIn('team_id', $teams->pluck('id'))
            ->select('team_id', 'post_id', 'status', 'earned_coins', 'check_in_time')
            ->get();

        $postDurations = $session->posts->pluck('max_duration', 'id');

        $groupedTeamPosts = $teamPosts->groupBy('team_id');

        $formattedTeams = $teams->map(function ($team) use ($groupedTeamPosts, $postDurations) {
            $posStatus = [];

            $myPosts = $groupedTeamPosts->get($team->id, collect());

            foreach ($myPosts as $tp) {
                $posStatus[$tp->post_id] = [
                    'status'        => $tp->status,
                    'earnedCoins'   => $tp->earned_coins,
                    'check_in_time' => $tp->check_in_time ? \Carbon\Carbon::parse($tp->check_in_time)->format('Y-m-d H:i:s') : null,
                    'max_duration'  => $postDurations[$tp->post_id] ?? '00:00:00'
                ];
            }
            return [
                'id'         => $team->id,
                'name'       => $team->name,
                'major'      => $team->major,
                'totalCoins' => $team->total_coins,
                'posStatus'  => (object)$posStatus
            ];
        });

        return response()->json(['success' => true, 'session' => $session, 'teams' => $formattedTeams, 'remaining_seconds' => $remainingSeconds]);
    }

    public function checkInPos(Request $request, $id)
    {
        $request->validate(['team_id' => 'required', 'post_id' => 'required']);

        //validasi urutan pos
        $session = GameSession::with('posts')->find($id);
        if (!$session) return response()->json(['success' => false, 'message' => 'Sesi tidak ditemukan'], 404);

        $posts = $session->posts; // Asumsi daftar pos berurutan
        $targetIndex = -1;
        foreach ($posts as $index => $post) {
            if ($post->id == $request->post_id) {
                $targetIndex = $index;
                break;
            }
        }

        // Jika bukan pos pertama (index 0), WAJIB cek pos sebelumnya!
        if ($targetIndex > 0) {
            $prevPostId = $posts[$targetIndex - 1]->id;
            $prevPostStatus = \App\Models\TeamPost::where('team_id', $request->team_id)
                ->where('post_id', $prevPostId)->first();

            if (!$prevPostStatus || $prevPostStatus->status !== 'completed') {
                return response()->json([
                    'success' => false,
                    'message' => 'DITOLAK: Tim ini belum menyelesaikan Pos sebelumnya!'
                ], 400); // Tolak
            }
        }
        // ------------------------------------------

        $teamPost = \App\Models\TeamPost::firstOrNew(['team_id' => $request->team_id, 'post_id' => $request->post_id]);
        $teamPost->status = 'active';
        $teamPost->check_in_time = now();
        $teamPost->save();

        return response()->json(['success' => true, 'message' => 'Check in berhasil!']);
    }

    public function finishPos(Request $request, $id)
    {
        $request->validate(['team_id' => 'required', 'post_id' => 'required', 'coins' => 'required|numeric']);
        $team = \App\Models\Team::find($request->team_id);
        $team->total_coins += $request->coins;
        $team->save();

        $teamPost = \App\Models\TeamPost::firstOrNew(['team_id' => $request->team_id, 'post_id' => $request->post_id]);
        $teamPost->status = 'completed';
        $teamPost->earned_coins = $request->coins;
        $teamPost->save();

        return response()->json(['success' => true, 'message' => 'Nilai berhasil disimpan!']);
    }

    public function getLeaderboard($id)
    {
        $session = \App\Models\GameSession::find($id);
        if (!$session) {
            return response()->json(['success' => false, 'message' => 'Sesi tidak ditemukan'], 404);
        }

        $totalPosts = \App\Models\Post::where('game_session_id', $id)->count();

        $teams = \App\Models\Team::where('game_session_id', $id)
            ->selectRaw('teams.*, (total_coins + redeemed_amount) as all_time_score')
            ->orderBy('all_time_score', 'desc')->get();

        $completedPosts = \App\Models\TeamPost::whereIn('team_id', $teams->pluck('id'))
            ->where('status', 'completed')
            ->selectRaw('team_id, count(*) as total_completed')
            ->groupBy('team_id')
            ->pluck('total_completed', 'team_id');


        $leaderboard = $teams->map(function ($team, $index) use ($totalPosts, $completedPosts) {
            $teamCompletedCount = $completedPosts[$team->id] ?? 0;
            $isFinished = ($totalPosts > 0 && $teamCompletedCount >= $totalPosts);

            return [
                'id'             => $team->id,
                'rank'           => $index + 1,
                'name'           => $team->name,
                'major'          => $team->major,
                'score'          => (int) $team->all_time_score,
                'balance'        => (int) $team->total_coins,
                'isRedeemed'     => (bool) $team->is_redeemed,
                'redeemedAmount' => (int) $team->redeemed_amount,
                'isFinished'     => $isFinished
            ];
        });

        return response()->json([
            'success' => true,
            'session_status' => $session->status,
            'session_name' => $session->name,
            'session_code' => $session->session_code,
            'data' => $leaderboard
        ]);
    }

    public function redeemCoins(Request $request, $id)
    {
        $request->validate(['team_id' => 'required', 'amount' => 'required|numeric|min:1']);
        $team = \App\Models\Team::where('game_session_id', $id)->where('id', $request->team_id)->first();
        if (!$team) return response()->json(['success' => false, 'message' => 'Tim tidak ditemukan'], 404);
        if ($team->total_coins < $request->amount) return response()->json(['success' => false, 'message' => 'Koin tim tidak mencukupi!'], 400);

        $team->total_coins -= $request->amount;
        $team->redeemed_amount += $request->amount;
        $team->is_redeemed = true;
        $team->save();

        return response()->json(['success' => true, 'message' => 'Koin berhasil ditukar!']);
    }

    public function update(Request $request, $id)
    {
        $session = GameSession::find($id);
        if (!$session) return response()->json(['success' => false, 'message' => 'Sesi tidak ditemukan'], 404);

        $validatedData = $request->validate([
            'name'            => 'required|string',
            'duration'        => 'required|string',
            'redeem_name'     => 'required|string',
            'redeem_location' => 'required|string',
            'qr_link'         => 'nullable|string',
            'qr_image'        => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
            'posts'           => 'nullable|array',
            'posts.*.id'      => 'nullable|integer',
            'posts.*.name'    => 'required_with:posts|string',
            'posts.*.location' => 'required_with:posts|string',
        ]);

        $updateData = collect($validatedData)->except(['qr_image', 'posts'])->toArray();

        if ($request->hasFile('qr_image')) {
            if ($session->qr_image_path && Storage::disk('public')->exists($session->qr_image_path)) {
                Storage::disk('public')->delete($session->qr_image_path);
            }
            $path = $request->file('qr_image')->store('qr_images', 'public');
            $updateData['qr_image_path'] = $path;
        }

        $session->update($updateData);

        if ($request->has('posts')) {
            $existingPostIds = $session->posts()->pluck('id')->toArray();
            $submittedPostIds = [];

            foreach ($request->posts as $postData) {
                if (isset($postData['id'])) {
                    $post = $session->posts()->find($postData['id']);
                    if ($post) {
                        $post->update(['name' => $postData['name'], 'location' => $postData['location']]);
                        $submittedPostIds[] = $post->id;
                    }
                } else {
                    $newPost = $session->posts()->create(['name' => $postData['name'], 'location' => $postData['location']]);
                    $submittedPostIds[] = $newPost->id;
                }
            }
            $postsToDelete = array_diff($existingPostIds, $submittedPostIds);
            if (!empty($postsToDelete)) {
                $session->posts()->whereIn('id', $postsToDelete)->delete();
            }
        } else {
            $session->posts()->delete();
        }

        return response()->json(['success' => true, 'message' => 'Detail sesi dan pos diperbarui!', 'data' => $session]);
    }

    public function endSession($id)
    {
        $session = GameSession::find($id);
        if (!$session) return response()->json(['success' => false, 'message' => 'Sesi tidak ditemukan'], 404);
        $session->status = 'ended';
        $session->save();
        return response()->json(['success' => true, 'message' => 'Sesi resmi ditutup!']);
    }

    public function destroySession($id)
    {
        $session = GameSession::find($id);
        if (!$session) {
            return response()->json(['success' => false, 'message' => 'Sesi tidak ditemukan'], 404);
        }

        // Hapus gambar QR dari storage jika ada
        if ($session->qr_image_path && Storage::disk('public')->exists($session->qr_image_path)) {
            Storage::disk('public')->delete($session->qr_image_path);
        }

        $session->delete();

        return response()->json(['success' => true, 'message' => 'Sesi berhasil dihapus!']);
    }

    public function studentGameplaySync(Request $request)
    {
        $sessionCode = $request->session_code;
        $teamName = $request->team_name;

        $session = GameSession::with('posts')->where('session_code', $sessionCode)->first();
        if (!$session) return response()->json(['success' => false, 'message' => 'Sesi tidak ditemukan']);

        $team = \App\Models\Team::where('game_session_id', $session->id)->where('name', $teamName)->first();
        if (!$team) return response()->json(['success' => false, 'message' => 'Tim tidak ditemukan']);

        $remainingSeconds = 0;
        if ($session->start_time && $session->status === 'live') {
            $durationParts = explode(':', $session->duration);
            $totalDurationSec = ((isset($durationParts[0]) ? (int)$durationParts[0] : 0) * 3600) + ((isset($durationParts[1]) ? (int)$durationParts[1] : 0) * 60) + (isset($durationParts[2]) ? (int)$durationParts[2] : 0);
            $elapsedSec = max(0, time() - strtotime($session->start_time));
            $remainingSeconds = (int) ceil(max(0, $totalDurationSec - $elapsedSec));
        }

        $teamPosts = \App\Models\TeamPost::where('team_id', $team->id)->get()->keyBy('post_id');
        $sessionPosts = $session->posts->sortBy('id')->values();
        $numPosts = $sessionPosts->count();
        $teams = \App\Models\Team::where('game_session_id', $session->id)
            ->orderBy('id', 'asc')
            ->pluck('id')
            ->values();
        $teamsCount = $teams->count();
        $teamIdx = $teams->search($team->id);

        // Align student route order with admin round-robin assignment.
        $routePosts = $sessionPosts;
        if ($numPosts > 0 && $teamsCount > 0 && $teamIdx !== false) {
            $chunkSize = (int) ceil($teamsCount / $numPosts);
            $chunkIndex = intdiv((int) $teamIdx, max(1, $chunkSize));
            $routePosts = collect();
            for ($stepIdx = 0; $stepIdx < $numPosts; $stepIdx++) {
                $postIdx = ($chunkIndex + $stepIdx) % $numPosts;
                $routePosts->push($sessionPosts[$postIdx]);
            }
        }

        $formattedPosts = $routePosts->map(function ($post) use ($teamPosts) {
            $tp = $teamPosts->get($post->id);
            return [
                'id' => $post->id,
                'name' => $post->name,
                'location' => $post->location,
                'max_duration' => $post->max_duration,
                'status' => $tp ? $tp->status : 'locked',
                'earned_coins' => $tp ? $tp->earned_coins : 0,
            ];
        });

        return response()->json([
            'success' => true,
            'status' => $session->status,
            'remaining_seconds' => $remainingSeconds,
            'sessionInfo' => ['name' => $session->name, 'redeem_name' => $session->redeem_name, 'redeem_location' => $session->redeem_location],
            'team' => ['total_coins' => $team->total_coins, 'emergency_code' => $team->emergency_code],
            'posts' => $formattedPosts
        ]);
    }
}
