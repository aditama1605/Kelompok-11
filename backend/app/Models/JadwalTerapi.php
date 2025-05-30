<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class JadwalTerapi extends Model
{
    use HasFactory;

    protected $table = 'jadwal_terapi'; // Specify the correct table name
    protected $primaryKey = 'id_jadwal_terapi';

    protected $fillable = [
        'tanggal',
        'jadwal_terapi',
        'terapis_id',
        'user_id',
        'jenis_layanan',
        'alamat',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'jadwal_terapi' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'jenis_layanan' => 'string',
    ];

    // Relasi ke model Terapis
    public function terapis()
    {
        return $this->belongsTo(Terapis::class, 'terapis_id', 'id_terapis');
    }

    // Relasi ke model User
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'iduser');
    }
}