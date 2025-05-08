<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LaporanPasien extends Model
{
    use HasFactory;

    protected $table = 'laporan_pasien';
    protected $primaryKey = 'id_laporan_pasien';

    protected $fillable = [
        'keluhan_pasien',
        'jadwal_terapi_id_jadwal_terapi',
        'payment_id_payment',
        'panduan_latihan_id_panduan_latihan'
    ];

    public function jadwalTerapi()
    {
        return $this->belongsTo(JadwalTerapi::class, 'jadwal_terapi_id_jadwal_terapi');
    }

    public function payment()
    {
        return $this->belongsTo(Payment::class, 'payment_id_payment');
    }

    public function panduanLatihan()
    {
        return $this->belongsTo(PanduanLatihan::class, 'panduan_latihan_id_panduan_latihan');
    }
}
