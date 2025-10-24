<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Meeting extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'start_time',
        'end_time',
        'attendees',
        'google_event_id',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'attendees' => 'array',
    ];

    /**
     * Get the user that owns the meeting
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
