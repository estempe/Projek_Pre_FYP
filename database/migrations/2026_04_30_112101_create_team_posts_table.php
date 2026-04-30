<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('team_posts', function (Blueprint $table) {
        $table->id();
        $table->foreignId('team_id')->constrained('teams')->onDelete('cascade');
        $table->foreignId('post_id')->constrained('posts')->onDelete('cascade');
        $table->enum('status', ['ready', 'ongoing', 'done'])->default('ready');
        $table->integer('earned_coins')->default(0); 
        $table->timestamp('check_in_time')->nullable(); 
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('team_posts');
    }
};
