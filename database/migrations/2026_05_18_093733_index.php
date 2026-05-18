<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        //  Index pada tabel team_posts
        Schema::table('team_posts', function (Blueprint $table) {
            // index agar 1 tim tidak punya 2 data untuk pos yang sama 
            $table->unique(['team_id', 'post_id'], 'idx_team_post_unique');
            
            // Index biasa untuk mempercepat pencarian status pos
            $table->index(['team_id', 'status'], 'idx_team_status');
        });

        //  Index pada tabel teams
        Schema::table('teams', function (Blueprint $table) {
            $table->index(['game_session_id', 'name'], 'idx_session_team_name');
        });
    }

    public function down()
    {
        Schema::table('team_posts', function (Blueprint $table) {
            $table->dropUnique('idx_team_post_unique');
            $table->dropIndex('idx_team_status');
        });

        Schema::table('teams', function (Blueprint $table) {
            $table->dropIndex('idx_session_team_name');
        });
    }
};