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

            $table->foreign('jadwal_terapi_id_jadwal_terapi')
                  ->references('id_jadwal_terapi')->on('jadwal_terapi')->onDelete('cascade');


            $table->foreign('panduan_latihan_id_panduan_latihan')
                  ->references('id_panduan_latihan')->on('panduan_latihans')->onDelete('cascade');
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
