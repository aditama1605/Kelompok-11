<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\LaporanPerkembanganController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('laporan-perkembangan', [LaporanPerkembanganController::class, 'index']);
Route::get('laporan-perkembangan/{id}', [LaporanPerkembanganController::class, 'show']);
Route::post('laporan-perkembangan', [LaporanPerkembanganController::class, 'store']);
Route::put('laporan-perkembangan/{id}', [LaporanPerkembanganController::class, 'update']);
Route::delete('laporan-perkembangan/{id}', [LaporanPerkembanganController::class, 'destroy']);
