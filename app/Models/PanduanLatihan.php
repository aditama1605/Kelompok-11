<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PanduanLatihan extends Model
{
    protected $table = 'panduan_latihans';
    protected $primaryKey = 'id_panduan_latihan';
    public $timestamps = true;

    protected $fillable = [
        'deskripsi_latihan',
        'durasi',
        'frekuensi',
        'terapis_id_terapis',
    ];

    protected $casts = [
        'durasi' => 'datetime:H:i:s',
    ];

    public function terapis()
    {
        return $this->belongsTo(Terapis::class, 'terapis_id_terapis', 'id_terapis');
    }
}