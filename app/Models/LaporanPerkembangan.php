<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LaporanPerkembangan extends Model
{
    use HasFactory;

    protected $table = 'laporan_perkembangan';
    protected $primaryKey = 'id_laporan_perkembangan';

    protected $fillable = [
        'ringkasan_perkembangan',
        'tanggal_laporan',
        'laporan_pasiens_id_laporan_pasiens'
    ];

   
}