<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Terapis extends Model
{
    use HasFactory;

    protected $table = 'terapis';
    protected $primaryKey = 'id_terapis';

    protected $fillable = [
        'tanggal_mulai',
    ];

    public function jadwalTerapi()
    {
        return $this->hasMany(JadwalTerapi::class, 'terapis_id_terapis');
    }

    public function panduanLatihan()
    {
        return $this->hasMany(PanduanLatihan::class, 'terapis_id_terapis');
    }
}
