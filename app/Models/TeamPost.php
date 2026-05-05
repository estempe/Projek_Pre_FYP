<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamPost extends Model
{
    use HasFactory;

    protected $table = 'team_posts';

    protected $fillable = [
        'team_id',
        'post_id',
        'status',
        'earned_coins',
        'check_in_time',
    ];
}
