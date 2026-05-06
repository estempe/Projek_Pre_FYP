<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // 1. Validasi input wajib berupa username
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        // 2. Cek apakah username dan password cocok di database
        if (!Auth::attempt($request->only('username', 'password'))) {
            return response()->json([
                'success' => false,
                'message' => 'Username atau password salah',
            ], 401);
        }

        // 3. Ambil data user yang berhasil login
        $user = User::where('username', $request->username)->first();

        // 4. Buatkan kunci akses (Token Sanctum)
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil',
            'data'    => $user,
            'token'   => $token
        ], 200);
    }
}