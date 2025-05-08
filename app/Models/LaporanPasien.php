<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LaporanPasien extends Model
{
    protected $table = 'laporan_pasiens';
    protected $primaryKey = 'id_laporan_pasien';
    public $timestamps = true;

    protected $fillable = [
        'keluhan_pasien',
        'jadwal_terapi_id_jadwal_terapi',
        'payment_id_payment',
        'panduan_latihan_id_panduan_latihan',
    ];

    public function jadwalTerapi()
    {
        return $this->belongsTo(JadwalTerapi::class, 'jadwal_terapi_id_jadwal_terapi', 'id_jadwal_terapi');
    }

    public function payment()
    {
        return $this->belongsTo(Payment::class, 'payment_id_payment', 'id_payment');
    }

    public function panduanLatihan()
    {
        return $this->belongsTo(PanduanLatihan::class, 'panduan_latihan_id_panduan_latihan', 'id_panduan_latihan');
    }
}