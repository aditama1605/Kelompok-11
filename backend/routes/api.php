<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\TerapisController;
use App\Http\Controllers\Api\JadwalTerapiController;
use App\Http\Controllers\Api\PanduanLatihanController;
use App\Http\Controllers\Api\LaporanPasienController;
use App\Http\Controllers\Api\LaporanPerkembanganController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group.
|
*/

// Public routes (no authentication required)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']); // Rute baru untuk registrasi

// Protected routes (require JWT authentication)
Route::middleware('auth:api')->group(function () {
    // Logout and token refresh
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);

    // User routes (accessible by both pasien and terapis)
    Route::middleware('role:pasien,terapis')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{id}', [UserController::class, 'show']);
    });
    

    // User routes for pasien only (e.g., view own profile)
    Route::middleware('role:pasien')->group(function () {
        Route::put('/users/{id}', [UserController::class, 'update']);
    });

    // User routes for terapis only (e.g., create or delete users)
    Route::middleware('role:terapis')->group(function () {
        Route::post('/users', [UserController::class, 'store']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
    });

    Route::middleware('role:pasien,terapis')->group(function () {
        Route::get('/terapis', [TerapisController::class, 'index']); // ✅
    });


    // Payment routes (accessible by pasien for viewing/creating, terapis for managing)
    Route::middleware('role:pasien,terapis')->group(function () {
        Route::get('/payments', [PaymentController::class, 'index']);
        Route::get('/payments/{id}', [PaymentController::class, 'show']);
    });

    Route::middleware('role:pasien')->group(function () {
        Route::post('/payments', [PaymentController::class, 'store']);
        Route::put('/payments/{id}', [PaymentController::class, 'update']);
    });

    Route::middleware('role:terapis')->group(function () {
        Route::delete('/payments/{id}', [PaymentController::class, 'destroy']);
    });

    // Terapis routes (accessible by terapis only)
    Route::middleware('role:terapis')->group(function () {
        Route::post('/terapis', [TerapisController::class, 'store']);
        Route::get('/terapis/{id}', [TerapisController::class, 'show']);
        Route::put('/terapis/{id}', [TerapisController::class, 'update']);
        Route::delete('/terapis/{id}', [TerapisController::class, 'destroy']);
    });

    // Jadwal Terapi routes (accessible by both pasien and terapis)
    Route::middleware('role:pasien,terapis')->group(function () {
        Route::get('/jadwal-terapi', [JadwalTerapiController::class, 'index']);
        Route::get('/jadwal-terapi/{id}', [JadwalTerapiController::class, 'show']);
    });

    Route::middleware('role:pasien')->group(function () {
        Route::post('/jadwal-terapi', [JadwalTerapiController::class, 'store']);
        Route::put('/jadwal-terapi/{id}', [JadwalTerapiController::class, 'update']);
    });

    Route::middleware('role:terapis')->group(function () {
        Route::delete('/jadwal-terapi/{id}', [JadwalTerapiController::class, 'destroy']);
    });

    // Panduan Latihan routes (accessible by terapis for managing, pasien for viewing)
    Route::middleware('role:pasien,terapis')->group(function () {
        Route::get('/panduan-latihan', [PanduanLatihanController::class, 'index']);
        Route::get('/panduan-latihan/{id}', [PanduanLatihanController::class, 'show']);
    });

    Route::middleware('role:terapis')->group(function () {
        Route::post('/panduan-latihan', [PanduanLatihanController::class, 'store']);
        Route::put('/panduan-latihan/{id}', [PanduanLatihanController::class, 'update']);
        Route::delete('/panduan-latihan/{id}', [PanduanLatihanController::class, 'destroy']);
    });

    // Laporan Pasien routes (accessible by pasien for creating, terapis for managing)
    Route::middleware('role:pasien,terapis')->group(function () {
        Route::get('/laporan-pasien', [LaporanPasienController::class, 'index']);
        Route::get('/laporan-pasien/{id}', [LaporanPasienController::class, 'show']);
    });

    Route::middleware('role:pasien')->group(function () {
        Route::post('/laporan-pasien', [LaporanPasienController::class, 'store']);
        Route::put('/laporan-pasien/{id}', [LaporanPasienController::class, 'update']);
    });

    Route::middleware('role:terapis')->group(function () {
        Route::delete('/laporan-pasien/{id}', [LaporanPasienController::class, 'destroy']);
    });

    // Laporan Perkembangan routes (accessible by terapis for managing, pasien for viewing)
    Route::middleware('role:pasien,terapis')->group(function () {
        Route::get('/laporan-perkembangan', [LaporanPerkembanganController::class, 'index']);
        Route::get('/laporan-perkembangan/{id}', [LaporanPerkembanganController::class, 'show']);
    });

    Route::middleware('role:terapis')->group(function () {
        Route::post('/laporan-perkembangan', [LaporanPerkembanganController::class, 'store']);
        Route::put('/laporan-perkembangan/{id}', [LaporanPerkembanganController::class, 'update']);
        Route::delete('/laporan-perkembangan/{id}', [LaporanPerkembanganController::class, 'destroy']);
    });
});

// code
