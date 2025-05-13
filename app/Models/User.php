<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'users';
    protected $primaryKey = 'iduser';
    public $timestamps = false;

    protected $fillable = [
        'nama', 
        'email', 
        'password', 
        'role'
    ];

    protected $hidden = [
        'password'
    ];
}