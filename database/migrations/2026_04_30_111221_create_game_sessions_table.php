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
    Schema::create('game_sessions', function (Blueprint $table) {
        $table->id();
        $table->string('name'); 
        $table->string('session_code')->unique(); 
        $table->dateTime('start_time')->nullable(); 
        $table->time('duration')->nullable(); 
        $table->string('redeem_name')->default('TUKAR HADIAH'); 
        $table->string('redeem_location')->nullable(); 
        $table->string('qr_link')->nullable(); 
        $table->string('qr_image_path')->nullable(); 
        $table->string('status')->default('upcoming');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('game_sessions');
    }
};
