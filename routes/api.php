<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\TerapisController;
use App\Http\Controllers\Api\JadwalTerapiController;
use App\Http\Controllers\api\PanduanLatihanController;




Route::apiResource('payment', PaymentController::class);
Route::apiResource('terapis', TerapisController::class);
Route::apiResource('jadwal-terapi', JadwalTerapiController::class);
Route::apiResource('panduan-latihan', PanduanLatihanController::class);

