<?php
use Illuminate\Support\Facades\Route;
use App\Models\Table_Soal;

Route::get('/soal', function () {
    return Table_Soal::all();
});

