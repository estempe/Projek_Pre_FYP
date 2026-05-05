<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Team;
use App\Models\GameSession;
use Illuminate\Support\Str;

class TeamController extends Controller
{
    // API 1: Mengecek apakah kode sesi yang dimasukkan Mahasiswa valid
    public function checkSession(Request $request)
    {
        $request->validate([
            'session_code' => 'required|string'
        ]);

        // Cari sesi berdasarkan kode (mengabaikan huruf besar/kecil)
        $session = GameSession::where('session_code', strtoupper($request->session_code))->first();

        if ($session) {
            return response()->json(['status' => 'found', 'data' => $session], 200);
        }

        return response()->json(['status' => 'not_found'], 404);
    }

    // API 2: Menyimpan Tim Mahasiswa baru ke database
    public function store(Request $request)
    {
        if (!$request->session_code || !$request->team_name || !$request->team_major) {
            return response()->json(['status' => 'invalid_input'], 400);
        }

        $session = GameSession::where('session_code', strtoupper($request->session_code))->first();
        if (!$session) {
            return response()->json(['status' => 'session_not_found'], 404);
        }

        // Cek apakah nama tim sudah dipakai di sesi ini
        $existingTeam = Team::where('game_session_id', $session->id)
                            ->where('name', $request->team_name)
                            ->first();

        if ($existingTeam) {
            return response()->json(['status' => 'team_exists'], 400);
        }

        // Buat Kode Darurat (Emergency Code)
        $emergencyCode = strtoupper(Str::random(6));

        $team = Team::create([
            'game_session_id' => $session->id,
            'name'            => $request->team_name,
            'major'           => $request->team_major,
            'total_coins'     => 0,
            'emergency_code'  => $emergencyCode
        ]);

        return response()->json([
            'status' => 'team_created',
            'data'   => $team
        ], 201);
    }

    // API 3: Menghapus Tim (Fitur Kick/Delete di Waiting Room Superadmin)
    public function destroy($id)
    {
        $team = Team::find($id);
        if (!$team) {
            return response()->json(['success' => false, 'message' => 'Tim tidak ditemukan'], 404);
        }

        $team->delete();
        
        return response()->json(['success' => true, 'message' => 'Tim berhasil dihapus dari permainan.']);
    }
}