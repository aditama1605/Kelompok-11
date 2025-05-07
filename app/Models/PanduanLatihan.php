<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PanduanLatihan extends Model
{
    protected $primaryKey = 'id_panduan_latihan';

    protected $fillable = [
        'deskripsi_latihan',
        'durasi',
        'frekuensi',
        'terapis_id_terapis',
    ];

    public function terapis()
    {
        return $this->belongsTo(Terapis::class, 'terapis_id_terapis');
    }
}



