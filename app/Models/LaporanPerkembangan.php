<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LaporanPerkembangan extends Model
{
    protected $table = 'laporan_perkembangan';
    protected $primaryKey = 'id_laporan_perkembangan';
    public $timestamps = true;

    protected $fillable = [
        'ringkasan_perkembangan',
        'tanggal_laporan',
        'laporan_pasiens_id_laporan_pasiens',
    ];

    protected $casts = [
        'tanggal_laporan' => 'date',
    ];

    public function laporanPasien()
    {
        return $this->belongsTo(LaporanPasien::class, 'laporan_pasiens_id_laporan_pasiens', 'id_laporan_pasien');
    }
}