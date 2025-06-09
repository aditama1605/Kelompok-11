<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class PanduanLatihan extends Model
{
    use HasFactory;

    protected $table = 'panduan_latihans';
    protected $primaryKey = 'id_panduan_latihan';

    protected $fillable = [
        'nama_latihan',
        'file_latihan',
        'deskripsi_latihan',
        'terapis_id_terapis',
    ];

    /**
     * Relationship dengan Terapis
     */
    public function terapis()
    {
        return $this->belongsTo(Terapis::class, 'terapis_id_terapis', 'id_terapis');
    }

    /**
     * Get the full URL of the file
     */
    public function getFileLatihanUrlAttribute()
    {
        return $this->file_latihan ? Storage::url('panduan_latihan/' . $this->file_latihan) : null;
    }
}