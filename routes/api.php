<?php

use Illuminate\Support\Facades\Route;
use App\Models\Table_Soal;
use App\Http\Controllers\Api\AuthController;

// Pintu untuk mengambil data soal dari database
Route::get('/soal', function () {
    return Table_Soal::all();
});

// Pintu khusus untuk Login Panitia
Route::post('/login', [AuthController::class, 'login']);