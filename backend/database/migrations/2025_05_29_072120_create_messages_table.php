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
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('sender_id'); // ID pengirim (pasien/terapis)
            $table->string('sender_role'); // Role pengirim (pasien/terapis)
            $table->unsignedBigInteger('receiver_id'); // ID penerima (pasien/terapis)
            $table->text('message');
            $table->string('conversation_id')->index(); // ID percakapan unik (misal: "pasien_X_terapis_Y")
            $table->timestamps();

            // Opsional: Foreign keys jika Anda memiliki tabel user dan terapis terpisah
            // $table->foreign('sender_id')->references('id')->on('users')->onDelete('cascade');
            // $table->foreign('receiver_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};