<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Terapis extends Model
{
    protected $table = 'terapis';
    protected $primaryKey = 'id_terapis';
    public $timestamps = true;

    protected $fillable = [
        'tanggal_mulai',
    ];

    protected $casts = [
        'tanggal_mulai' => 'datetime',
    ];
}