<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    use HasFactory;

    protected $fillable = [
        'game_session_id',
        'name',
        'major',
        'total_coins',
        'is_redeemed',
        'redeemed_amount',
        'emergency_code',
    ];
}