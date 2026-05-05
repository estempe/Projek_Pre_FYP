<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
<<<<<<< HEAD
{
    Schema::create('team_posts', function (Blueprint $table) {
        $table->id();
        $table->foreignId('team_id')->constrained('teams')->onDelete('cascade');
        $table->foreignId('post_id')->constrained('posts')->onDelete('cascade');
        $table->enum('status', ['completed', 'active', 'locked','reward'])->default('locked');
        $table->integer('earned_coins')->default(0); 
        $table->timestamp('check_in_time')->nullable(); 
        $table->timestamps();
    });
}
=======
    {
        Schema::create('team_posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_id')->constrained('teams')->onDelete('cascade');
            $table->foreignId('post_id')->constrained('posts')->onDelete('cascade');
            
            // Ubah tipe data enum menjadi string biasa
            $table->string('status')->default('ready'); 
            
            $table->integer('earned_coins')->default(0); 
            $table->timestamp('check_in_time')->nullable(); 
            $table->timestamps();
        });
    }
>>>>>>> seany

    public function down(): void
    {
        Schema::dropIfExists('team_posts');
    }
};