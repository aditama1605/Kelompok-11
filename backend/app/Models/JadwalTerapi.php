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
        'jadwal_terapi',
        'terapis_id',
        'user_id',
        'jenis_layanan',
        'alamat',
        'status',
        'nominal_payment',
        'bukti_pembayaran',
    ];

    protected $casts = [
        'jadwal_terapi' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'jenis_layanan' => 'string',
        'status' => 'string',
        'nominal_payment' => 'decimal:2',
    ];

    // Relasi ke model Terapis
    public function terapis()
    {
        return $this->belongsTo(Terapis::class, 'terapis_id', 'id_terapis');
    }

    // Relasi ke model User (pasien)
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'iduser');
    }
}