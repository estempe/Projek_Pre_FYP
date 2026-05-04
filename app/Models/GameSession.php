<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GameSession extends Model
{
    protected  $table = 'game_sessions';
    
}
    use HasFactory;

    protected $fillable = [
        'name',
        'session_code',
        'start_time',
        'duration',
        'redeem_name',
        'redeem_location',
        'qr_link',
        'qr_image_path',
        'status',
    ];
}
