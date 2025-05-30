<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $table = 'payment';
    protected $primaryKey = 'id_payment';

    protected $fillable = [
        'status_payment',
        'nominal_payment',
        'tanggal_payment',
        'bukti_pembayaran',
    ];

    protected $casts = [
        'nominal_payment' => 'decimal:2',
        'tanggal_payment' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}