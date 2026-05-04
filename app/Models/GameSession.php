<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GameSession extends Model
{
    use HasFactory;

    protected $table = 'game_sessions';

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

    public function posts()
    {
        return $this->hasMany(Post::class, 'game_session_id');
    }
}