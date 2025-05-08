<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LaporanPasien extends Model
{
    protected $primaryKey = 'id_laporan_pasien';

    protected $fillable = [
        'keluhan_pasien',
        'jadwal_terapi_id_jadwal_terapi',
        'payment_id_payment',
        'panduan_latihan_id_panduan_latihan',
    ];
}
