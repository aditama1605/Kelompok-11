<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LaporanPerkembangan extends Model
{
    use HasFactory;

    protected $table = 'laporan_perkembangan'; // Specify the correct table name
    protected $primaryKey = 'id_laporan_perkembangan';

    protected $fillable = [
        'ringkasan_perkembangan',
        'tanggal_laporan',
        'gambar_perkembangan',
        'laporan_pasiens_id_laporan_pasiens',
    ];

    protected $casts = [
        'tanggal_laporan' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relasi ke model LaporanPasien
    public function laporanPasien()
    {
        return $this->belongsTo(LaporanPasien::class, 'laporan_pasiens_id_laporan_pasiens', 'id_laporan_pasien');
    }
}