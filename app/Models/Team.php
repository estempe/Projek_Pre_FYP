<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    protected  $table = 'teams';

    protected $fillable = [
    'game_session_id',
    'name',
    'major',
    'score',
    'code',
    'is_redeemed',
    'redeemed_amount'
    ];
}
