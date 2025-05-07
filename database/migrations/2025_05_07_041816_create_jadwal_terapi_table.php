<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('jadwal_terapi', function (Blueprint $table) {
            $table->id('id_jadwal_terapi');
            $table->date('tanggal')->nullable();
            $table->date('jadwal_terapi')->nullable(); // opsional: ubah ke 'datetime' jika butuh waktu juga
            $table->unsignedBigInteger('terapis_id_terapis');
            $table->timestamps();

            $table->foreign('terapis_id_terapis')->references('id_terapis')->on('terapis')->onDelete('cascade');
        });
    }

    public function down(): void {
        Schema::dropIfExists('jadwal_terapi');
    }
};

