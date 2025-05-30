<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LaporanPasien;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;

class LaporanPasienController extends Controller
{
    /**
     * Display a listing of the laporan pasien.
     */
    public function index(): JsonResponse
    {
        $laporanPasien = LaporanPasien::with(['jadwalTerapi', 'payment', 'panduanLatihan'])->get();
        return response()->json([
            'status' => 'success',
            'data' => $laporanPasien,
        ], 200);
    }

    /**
     * Store a newly created laporan pasien in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'keluhan_pasien' => 'required|string',
            'jadwal_terapi_id_jadwal_terapi' => 'required|exists:jadwal_terapi,id_jadwal_terapi',
            'payment_id_payment' => 'required|exists:payment,id_payment',
            'panduan_latihan_id_panduan_latihan' => 'required|exists:panduan_latihans,id_panduan_latihan',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $laporanPasien = LaporanPasien::create($request->only([
            'keluhan_pasien',
            'jadwal_terapi_id_jadwal_terapi',
            'payment_id_payment',
            'panduan_latihan_id_panduan_latihan',
        ]));

        return response()->json([
            'status' => 'success',
            'message' => 'Laporan Pasien created successfully',
            'data' => $laporanPasien->load(['jadwalTerapi', 'payment', 'panduanLatihan']),
        ], 201);
    }

    /**
     * Display the specified laporan pasien.
     */
    public function show($id): JsonResponse
    {
        $laporanPasien = LaporanPasien::with(['jadwalTerapi', 'payment', 'panduanLatihan'])->find($id);

        if (!$laporanPasien) {
            return response()->json([
                'status' => 'error',
                'message' => 'Laporan Pasien not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $laporanPasien,
        ], 200);
    }

    /**
     * Update the specified laporan pasien in storage.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $laporanPasien = LaporanPasien::find($id);

        if (!$laporanPasien) {
            return response()->json([
                'status' => 'error',
                'message' => 'Laporan Pasien not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'keluhan_pasien' => 'sometimes|required|string',
            'jadwal_terapi_id_jadwal_terapi' => 'sometimes|required|exists:jadwal_terapi,id_jadwal_terapi',
            'payment_id_payment' => 'sometimes|required|exists:payment,id_payment',
            'panduan_latihan_id_panduan_latihan' => 'sometimes|required|exists:panduan_latihans,id_panduan_latihan',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $laporanPasien->update($request->only([
            'keluhan_pasien',
            'jadwal_terapi_id_jadwal_terapi',
            'payment_id_payment',
            'panduan_latihan_id_panduan_latihan',
        ]));

        return response()->json([
            'status' => 'success',
            'message' => 'Laporan Pasien updated successfully',
            'data' => $laporanPasien->load(['jadwalTerapi', 'payment', 'panduanLatihan']),
        ], 200);
    }

    /**
     * Remove the specified laporan pasien from storage.
     */
    public function destroy($id): JsonResponse
    {
        $laporanPasien = LaporanPasien::find($id);

        if (!$laporanPasien) {
            return response()->json([
                'status' => 'error',
                'message' => 'Laporan Pasien not found',
            ], 404);
        }

        $laporanPasien->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Laporan Pasien deleted successfully',
        ], 200);
    }
}