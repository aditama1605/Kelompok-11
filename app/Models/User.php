<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class User extends Authenticatable
{
    protected $primaryKey = 'iduser';

    protected $fillable = [
        'nama',
        'email',
        'password',
        'role',
        'jadwal_terapi_id_jadwal_terapi',
    ];

    protected $hidden = [
        'password',
    ];


}
