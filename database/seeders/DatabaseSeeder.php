<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ==========================================
        // 1. Akun Super Admin
        // ==========================================
        User::create([
            'name'     => 'Super Admin',
            'username' => 'superadmin',
            'password' => Hash::make('password123'), 
            'role'     => 'superadmin', 
        ]);

        // ==========================================
        // 2. Akun 5 PIC (Penjaga Pos / Panitia)
        // ==========================================
        User::create([
            'name'     => 'PIC Pos 1',
            'username' => 'pic1',
            'password' => Hash::make('password123'), 
            'role'     => 'pic',
        ]);

        User::create([
            'name'     => 'PIC Pos 2',
            'username' => 'pic2',
            'password' => Hash::make('password123'), 
            'role'     => 'pic',
        ]);

        User::create([
            'name'     => 'PIC Pos 3',
            'username' => 'pic3',
            'password' => Hash::make('password123'), 
            'role'     => 'pic',
        ]);

        User::create([
            'name'     => 'PIC Pos 4',
            'username' => 'pic4',
            'password' => Hash::make('password123'), 
            'role'     => 'pic',
        ]);

        User::create([
            'name'     => 'PIC Kasir / Redeem', 
            'username' => 'kasir',
            'password' => Hash::make('password123'), 
            'role'     => 'pic',
        ]);
    }
}