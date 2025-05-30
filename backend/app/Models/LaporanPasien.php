<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LaporanPasien extends Model
{
    use HasFactory;

    protected $table = 'laporan_pasiens'; // Specify the correct table name
    protected $primaryKey = 'id_laporan_pasien';

    protected $fillable = [
        'keluhan_pasien',
        'jadwal_terapi_id_jadwal_terapi',
        'payment_id_payment',
        'panduan_latihan_id_panduan_latihan',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relasi ke model JadwalTerapi
    public function jadwalTerapi()
    {
        return $this->belongsTo(JadwalTerapi::class, 'jadwal_terapi_id_jadwal_terapi', 'id_jadwal_terapi');
    }

    // Relasi ke model Payment
    public function payment()
    {
        return $this->belongsTo(Payment::class, 'payment_id_payment', 'id_payment');
    }

    // Relasi ke model PanduanLatihan
    public function panduanLatihan()
    {
        return $this->belongsTo(PanduanLatihan::class, 'panduan_latihan_id_panduan_latihan', 'id_panduan_latihan');
    }
}