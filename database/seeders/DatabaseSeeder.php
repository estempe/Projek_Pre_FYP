<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Akun Superadmin
        User::create([
            'name' => 'Superadmin',
            'username' => 'superadmin1',
            'password' => Hash::make('password123'), // Password yang dienkripsi
            'role' => 'superadmin',
        ]);

        // Membuat Akun PIC
        User::create([
            'name' => 'Panitia PIC',
            'username' => 'pic1',
            'password' => Hash::make('password123'), // Password yang dienkripsi
            'role' => 'pic',
        ]);
    }
}