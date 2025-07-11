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
        Schema::create('panduan_latihans', function (Blueprint $table) {
            $table->id('id_panduan_latihan');
            $table->string('nama_latihan', 45);
            $table->string('file_latihan')->nullable(); // Changed from gambar_latihan to file_latihan
            $table->longText('deskripsi_latihan');
            $table->unsignedBigInteger('terapis_id_terapis');
            $table->timestamps();

            $table->foreign('terapis_id_terapis')
                  ->references('id_terapis')
                  ->on('terapis')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('panduan_latihans');
    }
};