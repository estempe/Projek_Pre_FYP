<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\GameSession;
use App\Models\Post;
use App\Models\Team;
use App\Models\TeamPost;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. BUAT AKUN SUPERADMIN & PIC
        User::create([
            'name'     => 'Bapak Superadmin',
            'username' => 'superadmin',
            'password' => Hash::make('password123'),
            'role'     => 'superadmin',
        ]);

        User::create([
            'name'     => 'Kakak PIC',
            'username' => 'pic1',
            'password' => Hash::make('password123'),
            'role'     => 'pic',
        ]);

        // 2. BUAT SESI 1 (STATUS: LIVE)
        $sessionLive = GameSession::create([
            'name'            => 'PRE FYP B30 - BATCH 1',
            'session_code'    => 'LIVE99',
            'start_time'      => now()->subMinutes(30), // Dimulai 30 menit lalu
            'duration'        => '02:00',
            'redeem_name'     => 'Kasir Utama',
            'redeem_location' => 'Lantai 1, Hall A',
            'status'          => 'live',
        ]);

        // Buat 3 Pos untuk Sesi Live
        $pos1 = Post::create(['game_session_id' => $sessionLive->id, 'name' => 'Pos Lapangan', 'location' => 'Lapangan Basket', 'max_duration' => '00:15']);
        $pos2 = Post::create(['game_session_id' => $sessionLive->id, 'name' => 'Pos Lab', 'location' => 'Lab Komputer 2', 'max_duration' => '00:15']);
        $pos3 = Post::create(['game_session_id' => $sessionLive->id, 'name' => 'Pos Kelas', 'location' => 'Ruang 404', 'max_duration' => '00:15']);

        // Buat 3 Tim untuk Sesi Live
        $team1 = Team::create(['game_session_id' => $sessionLive->id, 'name' => 'JagonyaBinus', 'major' => 'Computer Science', 'total_coins' => 150, 'emergency_code' => 'ABC111']);
        $team2 = Team::create(['game_session_id' => $sessionLive->id, 'name' => 'SehatSehatMaba', 'major' => 'Business Management', 'total_coins' => 80, 'emergency_code' => 'DEF222']);
        $team3 = Team::create(['game_session_id' => $sessionLive->id, 'name' => 'TimHore', 'major' => 'Information Systems', 'total_coins' => 0, 'emergency_code' => 'GHI333']);

        // Simulasi History (Tim 1 sudah selesai di Pos 1 dan Pos 2)
        TeamPost::create(['team_id' => $team1->id, 'post_id' => $pos1->id, 'status' => 'completed', 'earned_coins' => 100]);
        TeamPost::create(['team_id' => $team1->id, 'post_id' => $pos2->id, 'status' => 'completed', 'earned_coins' => 50]);
        // Simulasi History (Tim 2 baru selesai di Pos 1)
        TeamPost::create(['team_id' => $team2->id, 'post_id' => $pos1->id, 'status' => 'completed', 'earned_coins' => 80]);


        // 3. BUAT SESI 2 (STATUS: UPCOMING / WAITING ROOM)
        $sessionUpcoming = GameSession::create([
            'name'            => 'PRE FYP B30 - BATCH 2',
            'session_code'    => 'WAIT55',
            'start_time'      => now()->addDays(1), // Dimulai besok
            'duration'        => '01:30',
            'redeem_name'     => 'Meja Panitia',
            'redeem_location' => 'Lantai 3',
            'status'          => 'upcoming',
        ]);

        // Buat 2 Pos untuk Sesi Upcoming
        Post::create(['game_session_id' => $sessionUpcoming->id, 'name' => 'Pos Audisi', 'location' => 'Auditorium', 'max_duration' => '00:20']);
        Post::create(['game_session_id' => $sessionUpcoming->id, 'name' => 'Pos Kantin', 'location' => 'Food Court', 'max_duration' => '00:10']);

        // Buat 2 Tim yang sedang menunggu di Waiting Room
        Team::create(['game_session_id' => $sessionUpcoming->id, 'name' => 'MabaKeren', 'major' => 'Creative Communication', 'total_coins' => 0, 'emergency_code' => 'JKL444']);
        Team::create(['game_session_id' => $sessionUpcoming->id, 'name' => 'RajinBelajar', 'major' => 'Accounting', 'total_coins' => 0, 'emergency_code' => 'MNO555']);
    }
}