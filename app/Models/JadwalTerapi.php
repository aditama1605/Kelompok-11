<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JadwalTerapi extends Model
{
    use HasFactory;

    protected $table = 'jadwal_terapi';
    protected $primaryKey = 'id_jadwal_terapi';

    protected $fillable = [
        'tanggal',
        'jadwal_terapi',
        'terapis_id_terapis',
    ];

    public function terapis()
    {
        return $this->belongsTo(Terapis::class, 'terapis_id_terapis');
    }

    public function user()
{
    return $this->belongsTo(User::class, 'user_iduser');
}
}

