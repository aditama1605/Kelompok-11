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
        Schema::create('jadwal_terapi', function (Blueprint $table) {
            $table->id('id_jadwal_terapi');
            $table->dateTime('jadwal_terapi');
            $table->unsignedBigInteger('terapis_id');
            $table->unsignedBigInteger('user_id');
            $table->enum('jenis_layanan', ['Home Visit', 'Online']);
            $table->longText('alamat')->nullable();
            $table->enum('status', ['Menunggu Konfirmasi', 'Diterima', 'Selesai'])->default('Menunggu Konfirmasi');
            $table->decimal('nominal_payment', 10, 2)->default(0.00); // New column for payment amount
            $table->string('bukti_pembayaran')->nullable(); // New column for proof of payment
            $table->timestamps();

            // Foreign Key Constraints
            $table->foreign('terapis_id')->references('id_terapis')->on('terapis')->onDelete('cascade');
            $table->foreign('user_id')->references('iduser')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jadwal_terapi');
    }
};