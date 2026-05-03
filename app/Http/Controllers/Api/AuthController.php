<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // 1. Pastikan frontend mengirim username dan password
        $request->validate([
            'username' => 'required',
            'password' => 'required'
        ]);

        // 2. Cari panitia berdasarkan username
        $user = User::where('username', $request->username)->first();

        // 3. Jika username tidak ketemu ATAU password salah
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Username atau password salah nih!'
            ], 401);
        }

        // 4. Jika sukses, buatkan Token Kunci Masuk (Sanctum)
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil!',
            'data'    => $user,
            'token'   => $token
        ], 200);
    }
}