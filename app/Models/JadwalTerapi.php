<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JadwalTerapi extends Model
{
    protected $table = 'jadwal_terapi';
    protected $primaryKey = 'id_jadwal_terapi';
    public $timestamps = true;

    protected $fillable = [
        'tanggal',
        'jadwal_terapi',
        'terapis_id',
        'user_id',
        'jenis_layanan', // pakai tanda kutip karena ada spasi
        'alamat',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'jadwal_terapi' => 'datetime',
    ];

    public function terapis()
    {
        return $this->belongsTo(Terapis::class, 'terapis_id', 'id_terapis');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'iduser');
    }
}
