<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\TerapisController;
use App\Http\Controllers\Api\JadwalTerapiController;
use App\Http\Controllers\api\PanduanLatihanController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\LaporanPasienController;
use App\Http\Controllers\api\LaporanPerkembanganController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('payment', PaymentController::class);
Route::apiResource('terapis', TerapisController::class);
Route::apiResource('jadwal-terapi', JadwalTerapiController::class);
Route::apiResource('panduan-latihan', PanduanLatihanController::class);

Route::apiResource('users', UserController::class);
Route::apiResource('laporan-pasien', LaporanPasienController::class);
Route::apiResource('laporan-perkembangan', LaporanPerkembanganController::class);


