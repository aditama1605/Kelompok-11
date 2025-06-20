<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Terapis extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_terapis';

    protected $fillable = [
        'iduser', 'spesialisasi', 'foto',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'iduser', 'iduser');
    }

    public function jadwalTerapi()
    {
        return $this->hasMany(JadwalTerapi::class, 'id_terapis');
    }
}