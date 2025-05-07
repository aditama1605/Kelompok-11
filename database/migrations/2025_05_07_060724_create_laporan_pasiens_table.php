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
        Schema::create('laporan_pasiens', function (Blueprint $table) {
            $table->id('id_laporan_pasien');
            $table->longText('keluhan_pasien');
            $table->unsignedBigInteger('jadwal_terapi_id_jadwal_terapi');
            $table->unsignedBigInteger('payment_id_payment');
            $table->unsignedBigInteger('panduan_latihan_id_panduan_latihan');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('laporan_pasiens');
    }
};
