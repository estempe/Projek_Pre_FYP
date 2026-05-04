<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\GameSession;
use Illuminate\Support\Str;



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
        // 1. Validasi input (wajib diisi sesuai permintaanmu)
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

        // 3. Simpan ke database
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

        return response()->json([
            'success' => true,
            'message' => 'Sesi berhasil dibuat!',
            'data'    => $session
        ], 201);
    }

    // Fungsi menampilkan detail sesi
    public function show($id)
    {
        $session = GameSession::find($id);
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
}