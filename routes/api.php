<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\TerapisController;
use App\Http\Controllers\Api\JadwalTerapiController;
use App\Http\Controllers\api\PanduanLatihanController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\LaporanPasienController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



Route::apiResource('payment', PaymentController::class);
Route::apiResource('terapis', TerapisController::class);
Route::apiResource('jadwal-terapi', JadwalTerapiController::class);
Route::apiResource('panduan-latihan', PanduanLatihanController::class);

Route::prefix('user')->group(function () {
    Route::get('/', [UserController::class, 'index']);
    Route::post('/', [UserController::class, 'store']);
    Route::get('/{id}', [UserController::class, 'show']);
    Route::put('/{id}', [UserController::class, 'update']);
    Route::delete('/{id}', [UserController::class, 'destroy']);
});

Route::apiResource('laporan-pasien', LaporanPasienController::class);


