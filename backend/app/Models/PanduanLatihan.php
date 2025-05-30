<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PanduanLatihan extends Model
{
    use HasFactory;

    protected $table = 'panduan_latihan'; // Specify the correct table name
    protected $primaryKey = 'id_panduan_latihan';

    protected $fillable = [
        'nama_latihan',
        'gambar_latihan',
        'deskripsi_latihan',
        'durasi',
        'frekuensi',
        'terapis_id_terapis',
    ];

    protected $casts = [
        'durasi' => 'datetime:H:i:s',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relasi ke model Terapis
    public function terapis()
    {
        return $this->belongsTo(Terapis::class, 'terapis_id_terapis', 'id_terapis');
    }
}