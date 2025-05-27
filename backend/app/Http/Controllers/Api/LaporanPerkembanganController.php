<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LaporanPerkembangan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;

class LaporanPerkembanganController extends Controller
{
    /**
     * Display a listing of the laporan perkembangan.
     */
    public function index(): JsonResponse
    {
        $laporanPerkembangan = LaporanPerkembangan::with('laporanPasien')->get();
        return response()->json([
            'status' => 'success',
            'data' => $laporanPerkembangan,
        ], 200);
    }

    /**
     * Store a newly created laporan perkembangan in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'ringkasan_perkembangan' => 'required|string',
            'tanggal_laporan' => 'required|date',
            'gambar_perkembangan' => 'required|string|max:255', // Asumsi string untuk path file
            'laporan_pasiens_id_laporan_pasiens' => 'required|exists:laporan_pasiens,id_laporan_pasien',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $laporanPerkembangan = LaporanPerkembangan::create($request->only([
            'ringkasan_perkembangan',
            'tanggal_laporan',
            'gambar_perkembangan',
            'laporan_pasiens_id_laporan_pasiens',
        ]));

        return response()->json([
            'status' => 'success',
            'message' => 'Laporan Perkembangan created successfully',
            'data' => $laporanPerkembangan->load('laporanPasien'),
        ], 201);
    }

    /**
     * Display the specified laporan perkembangan.
     */
    public function show($id): JsonResponse
    {
        $laporanPerkembangan = LaporanPerkembangan::with('laporanPasien')->find($id);

        if (!$laporanPerkembangan) {
            return response()->json([
                'status' => 'error',
                'message' => 'Laporan Perkembangan not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $laporanPerkembangan,
        ], 200);
    }

    /**
     * Update the specified laporan perkembangan in storage.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $laporanPerkembangan = LaporanPerkembangan::find($id);

        if (!$laporanPerkembangan) {
            return response()->json([
                'status' => 'error',
                'message' => 'Laporan Perkembangan not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'ringkasan_perkembangan' => 'sometimes|required|string',
            'tanggal_laporan' => 'sometimes|required|date',
            'gambar_perkembangan' => 'sometimes|required|string|max:255',
            'laporan_pasiens_id_laporan_pasiens' => 'sometimes|required|exists:laporan_pasiens,id_laporan_pasien',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $laporanPerkembangan->update($request->only([
            'ringkasan_perkembangan',
            'tanggal_laporan',
            'gambar_perkembangan',
            'laporan_pasiens_id_laporan_pasiens',
        ]));

        return response()->json([
            'status' => 'success',
            'message' => 'Laporan Perkembangan updated successfully',
            'data' => $laporanPerkembangan->load('laporanPasien'),
        ], 200);
    }

    /**
     * Remove the specified laporan perkembangan from storage.
     */
    public function destroy($id): JsonResponse
    {
        $laporanPerkembangan = LaporanPerkembangan::find($id);

        if (!$laporanPerkembangan) {
            return response()->json([
                'status' => 'error',
                'message' => 'Laporan Perkembangan not found',
            ], 404);
        }

        $laporanPerkembangan->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Laporan Perkembangan deleted successfully',
        ], 200);
    }
}