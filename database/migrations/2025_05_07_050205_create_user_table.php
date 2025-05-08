<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user', function (Blueprint $table) {
               $table->id('iduser');
                $table->string('nama', 255);
                $table->string('email', 255)->unique();
                $table->string('password', 100);
                $table->enum('role', ['pasien', 'terapis']);
                $table->timestamps(); // Tetap disimpan untuk created_at dan updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user');
    }
};
