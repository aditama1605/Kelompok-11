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
        Schema::create('laporan_perkembangan', function (Blueprint $table) {
            $table->id('id_laporan_perkembangan');
            $table->text('ringkasan_perkembangan');
            $table->date('tanggal_laporan');
            $table->string('gambar_perkembangan');
            $table->unsignedBigInteger('laporan_pasiens_id_laporan_pasiens');
            $table->foreign('laporan_pasiens_id_laporan_pasiens')->references('id_laporan_pasien')->on('laporan_pasiens');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('laporan_perkembangan');
    }
};
