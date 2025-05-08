<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LaporanPerkembangan extends Model
{
    protected $primaryKey = 'id_laporan_perkembangan';

    protected $fillable = [
        'keterangan_perkembangan',
        'laporan_pasien_id_laporan_pasien',
    ];

    public function laporanPasien(): BelongsTo
    {
        return $this->belongsTo(LaporanPasien::class, 'laporan_pasien_id_laporan_pasien');
    }
}
