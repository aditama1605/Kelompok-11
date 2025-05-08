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
            $table->date('tanggal')->nullable();
            $table->dateTime('jadwal_terapi')->nullable(); // Changed to datetime for full date and time
            $table->unsignedBigInteger('terapis_id'); // Renamed for consistency
            $table->unsignedBigInteger('user_id'); // Renamed for consistency
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
