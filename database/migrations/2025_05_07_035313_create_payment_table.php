<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('payment', function (Blueprint $table) {
            $table->id('id_payment');
            $table->string('status_payment', 45);
            $table->decimal('nominal_payment', 10, 2);
            $table->date('tanggal_payment');
            $table->string('bukti_pembayaran'); // filegambar
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('payment');
    }
};
