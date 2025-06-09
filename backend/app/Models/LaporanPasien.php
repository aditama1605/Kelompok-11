<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LaporanPasien extends Model
{
    use HasFactory;

    protected $table = 'laporan_pasiens';
    protected $primaryKey = 'id_laporan_pasien';

    protected $fillable = [
        'jadwal_terapi_id_jadwal_terapi',
        'keluhan_pasien',
        'panduan_latihan_id_panduan_latihan',
    ];

    public function jadwalTerapi()
    {
        return $this->belongsTo(JadwalTerapi::class, 'jadwal_terapi_id_jadwal_terapi', 'id_jadwal_terapi');
    }

    public function panduanLatihan()
    {
        return $this->belongsTo(PanduanLatihan::class, 'panduan_latihan_id_panduan_latihan', 'id_panduan_latihan');
    }

    public function laporanPerkembangan()
    {
        return $this->hasMany(LaporanPerkembangan::class, 'laporan_pasiens_id_laporan_pasiens', 'id_laporan_pasien');
    }
}