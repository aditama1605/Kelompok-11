<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $table = 'user';
    protected $primaryKey = 'iduser';

    protected $fillable = [
        'nama', 'email', 'password', 'role', 'jadwal_terapi_id_jadwal_terapi'
    ];

    protected $hidden = [
        'password',
    ];
}
