<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Terapis extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_terapis';
    protected $table = 'terapis';

    protected $fillable = [
        'nama', // Added nama
        'spesialisasi',
        'foto',
        'tanggal_mulai',
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}