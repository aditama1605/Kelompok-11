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
use App\Http\Controllers\Api\MessageController;

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
Route::post('/register', [AuthController::class, 'register']);


// Protected routes (require JWT authentication)
Route::middleware('auth:api')->group(function () {
    // Logout and token refresh
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    
    Route::prefix('chat')->group(function () {
        // Mendapatkan daftar partner chat yang pernah terlibat
        Route::get('/partners', [MessageController::class, 'getChatPartners']);

        // Mendapatkan semua pesan dalam percakapan spesifik
        // {participantId} adalah iduser dari lawan bicara
        Route::get('/messages/{participantId}', [MessageController::class, 'getConversationMessages']);

        // Mengirim pesan baru
        Route::post('/send', [MessageController::class, 'store']);

        // Mendapatkan daftar semua pasien (hanya untuk terapis)
        Route::get('/patients', [MessageController::class, 'getAllPatients']);

        // Mendapatkan daftar semua terapis (hanya untuk pasien)
        Route::get('/terapis', [MessageController::class, 'getAllTerapis']);
    });

    // User routes
    Route::middleware('role:pasien,terapis,admin')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{id}', [UserController::class, 'show']);
    });

    Route::middleware('role:pasien')->group(function () {
        Route::put('/users/{id}', [UserController::class, 'update']);
    });

    Route::middleware('role:admin')->group(function () {
        Route::post('/users', [UserController::class, 'store']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
    });

    // Terapis routes
    Route::middleware('role:admin')->group(function () {
        Route::post('/terapis', [TerapisController::class, 'store']);
        Route::put('/terapis/{id}', [TerapisController::class, 'update']);
        Route::delete('/terapis/{id}', [TerapisController::class, 'destroy']);
    });

    Route::middleware('role:pasien,terapis,admin')->group(function () {
        Route::get('/terapis', [TerapisController::class, 'index']);
        Route::get('/terapis/{id}', [TerapisController::class, 'show']);
    });

    // Payment routes
    Route::middleware('role:pasien,terapis,admin')->group(function () {
        Route::get('/payments', [PaymentController::class, 'index']);
        Route::get('/payments/{id}', [PaymentController::class, 'show']);
    });

    Route::middleware('role:pasien')->group(function () {
        Route::post('/payments', [PaymentController::class, 'store']);
        Route::put('/payments/{id}', [PaymentController::class, 'update']);
        Route::post('/jadwal-terapi/{id}/upload-bukti', [JadwalTerapiController::class, 'uploadBuktiPembayaran']);
    });

    Route::middleware('role:terapis')->group(function () {
        Route::post('/jadwal-terapi/{id}/verifikasi-pembayaran', [JadwalTerapiController::class, 'verifikasiPembayaran']);
    });

    Route::middleware('role:admin')->group(function () {
        Route::delete('/payments/{id}', [PaymentController::class, 'destroy']);
    });

    // Jadwal Terapi routes
    Route::middleware('role:pasien,terapis,admin')->group(function () {
        Route::get('/jadwal-terapi', [JadwalTerapiController::class, 'index']);
        Route::get('/jadwal-terapi/{id}', [JadwalTerapiController::class, 'show']);
    });

    Route::middleware('role:pasien')->group(function () {
        Route::post('/jadwal-terapi', [JadwalTerapiController::class, 'store']);
    });

    Route::middleware('role:pasien,terapis')->group(function () {
        Route::put('/jadwal-terapi/{id}', [JadwalTerapiController::class, 'update']);
    });

    Route::middleware('role:admin')->group(function () {
        Route::delete('/jadwal-terapi/{id}', [JadwalTerapiController::class, 'destroy']);
    });

    // Panduan Latihan routes
    Route::middleware('role:pasien,terapis,admin')->group(function () {
        Route::get('/panduan-latihan', [PanduanLatihanController::class, 'index']);
        Route::get('/panduan-latihan/{id}', [PanduanLatihanController::class, 'show']);
    });

    Route::middleware('role:terapis')->group(function () {
        Route::post('/panduan-latihan', [PanduanLatihanController::class, 'store']);
        Route::put('/panduan-latihan/{id}', [PanduanLatihanController::class, 'update']);
        Route::delete('/panduan-latihan/{id}', [PanduanLatihanController::class, 'destroy']);
    });

    // Laporan Pasien routes
    Route::middleware('role:pasien,terapis,admin')->group(function () {
        Route::get('/laporan-pasien', [LaporanPasienController::class, 'index']);
        Route::get('/laporan-pasien/{id}', [LaporanPasienController::class, 'show']);
    });

    Route::middleware('role:terapis')->group(function () {
        Route::post('/laporan-pasien', [LaporanPasienController::class, 'store']);
        Route::put('/laporan-pasien/{id}', [LaporanPasienController::class, 'update']);
    });

    Route::middleware('role:admin')->group(function () {
        Route::delete('/laporan-pasien/{id}', [LaporanPasienController::class, 'destroy']);
    });

    // Laporan Perkembangan routes
    Route::middleware('role:pasien,terapis,admin')->group(function () {
        Route::get('/laporan-perkembangan', [LaporanPerkembanganController::class, 'index']);
        Route::get('/laporan-perkembangan/{id}', [LaporanPerkembanganController::class, 'show']);
        
    });

    Route::middleware('role:pasien')->group(function () {
        Route::post('/laporan-perkembangan', [LaporanPerkembanganController::class, 'store']);
        Route::put('/laporan-perkembangan/{id}', [LaporanPerkembanganController::class, 'update']);
    });

    Route::middleware('role:admin')->group(function () {
        Route::delete('/laporan-perkembangan/{id}', [LaporanPerkembanganController::class, 'destroy']);
    });
});