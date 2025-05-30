<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('terapis', function (Blueprint $table) {
            if (!Schema::hasColumn('terapis', 'nama')) {
                $table->string('nama')->after('id_terapis');
            }
        });
    }

    public function down(): void
    {
        Schema::table('terapis', function (Blueprint $table) {
            if (Schema::hasColumn('terapis', 'nama')) {
                $table->dropColumn('nama');
            }
        });
    }
};