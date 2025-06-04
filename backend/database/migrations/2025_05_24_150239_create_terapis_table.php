<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('terapis', function (Blueprint $table) {
            $table->id('id_terapis');
            $table->unsignedBigInteger('iduser');
            $table->foreign('iduser')->references('iduser')->on('users')->onDelete('cascade');
            $table->string('spesialisasi')->nullable();
            $table->string('foto')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('terapis');
    }
};