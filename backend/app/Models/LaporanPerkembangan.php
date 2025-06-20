<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class LaporanPerkembangan extends Model
{
    use HasFactory;

    protected $table = 'laporan_perkembangan';
    protected $primaryKey = 'id_laporan_perkembangan';

    protected $fillable = [
        'ringkasan_perkembangan',
        'tanggal_laporan',
        'file_perkembangan',
        'laporan_pasiens_id_laporan_pasiens',
    ];

    protected $appends = ['file_perkembangan_url'];

    public function laporanPasien()
    {
        return $this->belongsTo(LaporanPasien::class, 'laporan_pasiens_id_laporan_pasiens', 'id_laporan_pasien');
    }

    public function getFilePerkembanganUrlAttribute()
    {
        return $this->file_perkembangan ? Storage::url('laporan_perkembangan/' . $this->file_perkembangan) : null;
    }
}

// namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
// use Illuminate\Support\Facades\Storage;

// class LaporanPerkembangan extends Model
// {
//     use HasFactory;

//     protected $table = 'laporan_perkembangan';
//     protected $primaryKey = 'id_laporan_perkembangan';

//     protected $fillable = [
//         'ringkasan_perkembangan',
//         'tanggal_laporan',
//         'file_perkembangan',
//         'laporan_pasiens_id_laporan_pasiens',
//     ];

//     /**
//      * Relationship dengan LaporanPasien
//      */
//     public function laporanPasien()
//     {
//         return $this->belongsTo(LaporanPasien::class, 'laporan_pasiens_id_laporan_pasiens', 'id_laporan_pasien');
//     }

//     /**
//      * Get the full URL of the file
//      */
//     public function getFilePerkembanganUrlAttribute()
//     {
//         return $this->file_perkembangan ? Storage::url('laporan_perkembangan/' . $this->file_perkembangan) : null;
//     }
// }