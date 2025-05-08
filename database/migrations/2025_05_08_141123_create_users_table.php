<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id('iduser'); // Primary key: "id"
            $table->string('nama'); // Nama lengkap user
            $table->string('email')->unique(); // Email harus unik
            $table->string('password'); // Password yang dienkripsi
            $table->enum('role', ['pasien', 'terapis']); // Role: pasien atau terapis
            $table->timestamps(); // created_at dan updated_at
        });
    }

    public function down()
    {
        Schema::dropIfExists('users');
    }
}
