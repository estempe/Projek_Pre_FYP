<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\GameSession;
use Illuminate\Support\Str;
use App\Models\Post; // 👈 1. Ubah GamePos menjadi Post


class GameSessionController extends Controller
{
    // Fungsi untuk mengambil semua daftar sesi
    public function index(Request $request)
    {
        // Ambil semua sesi dari database, urutkan berdasarkan waktu mulai terdekat
        $sessions = GameSession::orderBy('start_time', 'asc')->get();

        return response()->json([
            'success' => true,
            'message' => 'Berhasil mengambil daftar sesi',
            'data'    => $sessions
        ], 200);
    }

    public function store(Request $request)
    {
        // 1. Validasi input
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

        // 2. Logika Upload Gambar
        $imagePath = null;
        if ($request->hasFile('qr_image')) {
            // Menyimpan gambar ke folder storage/app/public/qr_codes
            $imagePath = $request->file('qr_image')->store('qr_codes', 'public');
        }

        // 3. Simpan ke database (Sesi)
        $session = GameSession::create([
            'session_code'    => $kodeSesi,
            'name'            => $request->name,
            'start_time'      => $request->start_time,
            'duration'        => $request->duration,
            'redeem_name'     => $request->redeem_name,
            'redeem_location' => $request->redeem_location,
            'qr_link'         => $request->qr_link,
            'qr_image_path'   => $imagePath,
            'status'          => 'upcoming', // Status awal
        ]);

        // --- LOGIKA MENYIMPAN DAFTAR POS ---
        if ($request->pos_list) {
            // Ubah teks JSON dari React menjadi Array PHP
            $posArray = json_decode($request->pos_list, true);

            if (is_array($posArray)) {
                foreach ($posArray as $posItem) {
                    Post::create([ // 👈 2. Gunakan Model Post
                        'game_session_id' => $session->id, 
                        'name'            => $posItem['name'] ?: 'Pos Default', 
                        'location'        => $posItem['location'] ?: 'Belum diatur',
                        'max_duration'    => $posItem['duration'] ?: '00:00', // 👈 3. Ubah nama kolom jadi max_duration
                    ]);
                }
            }
        }
        
        return response()->json([
            'success' => true,
            'message' => 'Sesi berhasil dibuat!',
            'data'    => $session
        ], 201);
    }

    // Fungsi menampilkan detail sesi beserta daftar pos-nya
    public function show($id)
    {
        // Gunakan with('posts') untuk memanggil relasi yang baru kita buat
        $session = GameSession::with('posts')->find($id);
        
        if (!$session) {
            return response()->json(['success' => false, 'message' => 'Sesi tidak ditemukan'], 404);
        }
        return response()->json(['success' => true, 'data' => $session], 200);
    }

    // Fungsi untuk memulai sesi (ubah status jadi live)
    public function start($id)
    {
        $session = GameSession::find($id);
        if (!$session) {
            return response()->json(['success' => false, 'message' => 'Sesi tidak ditemukan'], 404);
        }

        $session->status = 'live';
        $session->save();

        return response()->json(['success' => true, 'message' => 'Sesi dimulai!'], 200);
    }

    // --- FUNGSI UNTUK HALAMAN SESSION LIVE ---

    // 1. Mengambil data Sesi, Pos, dan Tim secara bersamaan
    public function getLiveData($id)
    {
        $session = GameSession::with('posts')->find($id);
        if (!$session) {
            return response()->json(['success' => false, 'message' => 'Sesi tidak ditemukan'], 404);
        }

        // Ambil semua tim di sesi ini
        $teams = \App\Models\Team::where('game_session_id', $id)->get();
        // Ambil semua riwayat pos dari tim-tim tersebut
        $teamPosts = \App\Models\TeamPost::whereIn('team_id', $teams->pluck('id'))->get();

        // Gabungkan data agar strukturnya persis seperti yang diminta React
        $formattedTeams = $teams->map(function($team) use ($teamPosts) {
            $posStatus = [];
            foreach($teamPosts->where('team_id', $team->id) as $tp) {
                $posStatus[$tp->post_id] = [
                    'state'       => $tp->status, // 'completed', 'active', 'locked'
                    'earnedCoins' => $tp->earned_coins,
                    'countdown'   => '00:00' // Placeholder
                ];
            }
            return [
                'id'         => $team->id,
                'name'       => $team->name,
                'major'      => $team->major,
                'totalCoins' => $team->total_coins,
                'posStatus'  => (object)$posStatus // Ubah jadi Object JSON
            ];
        });

        return response()->json([
            'success' => true,
            'session' => $session,
            'teams'   => $formattedTeams
        ]);
    }

    // 2. Fungsi saat Superadmin / PIC menekan tombol "Selesai" dan memberi koin
    public function finishPos(Request $request, $id)
    {
        $request->validate([
            'team_id' => 'required',
            'post_id' => 'required',
            'coins'   => 'required|numeric'
        ]);

        // Tambah koin ke total koin Tim
        $team = \App\Models\Team::find($request->team_id);
        $team->total_coins += $request->coins;
        $team->save();

        // Catat di Riwayat Pos Tim
        $teamPost = \App\Models\TeamPost::firstOrNew([
            'team_id' => $request->team_id,
            'post_id' => $request->post_id
        ]);
        $teamPost->status = 'completed';
        $teamPost->earned_coins = $request->coins;
        $teamPost->save();

        return response()->json(['success' => true, 'message' => 'Nilai berhasil disimpan!']);
    }

    // --- FUNGSI UNTUK LEADERBOARD & REDEEM ---

    // Mengambil klasemen tim
    public function getLeaderboard($id)
    {
        // Ambil tim berdasarkan sesi, urutkan dari koin terbesar ke terkecil
        $teams = \App\Models\Team::where('game_session_id', $id)
                    ->orderBy('total_coins', 'desc')
                    ->get();

        $leaderboard = $teams->map(function($team, $index) {
            return [
                'id'             => $team->id,
                'rank'           => $index + 1,
                'name'           => $team->name,
                'major'          => $team->major,
                'score'          => $team->total_coins,
                'isRedeemed'     => $team->is_redeemed,
                'redeemedAmount' => $team->redeemed_amount
            ];
        });

        return response()->json(['success' => true, 'data' => $leaderboard]);
    }

    // Fungsi memotong koin saat tim menukar hadiah
    public function redeemCoins(Request $request, $id)
    {
        $request->validate([
            'team_id' => 'required',
            'amount'  => 'required|numeric|min:1'
        ]);

        $team = \App\Models\Team::where('game_session_id', $id)->where('id', $request->team_id)->first();
        if (!$team) {
            return response()->json(['success' => false, 'message' => 'Tim tidak ditemukan'], 404);
        }

        // Cek apakah koin cukup
        if ($team->total_coins < $request->amount) {
            return response()->json(['success' => false, 'message' => 'Koin tim tidak mencukupi!'], 400);
        }

        // Proses potong koin dan ubah status
        $team->total_coins -= $request->amount;
        $team->redeemed_amount += $request->amount;
        $team->is_redeemed = true;
        $team->save();

        return response()->json(['success' => true, 'message' => 'Koin berhasil ditukar!']);
    }
}