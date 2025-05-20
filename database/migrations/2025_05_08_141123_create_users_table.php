<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id('iduser'); // Primary key
            $table->string('nama');
            $table->string('email')->unique();
            $table->string('password');
            $table->enum('role', ['pasien', 'terapis']);
            $table->rememberToken(); // Untuk "remember me" jika pakai UI auth nanti
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
