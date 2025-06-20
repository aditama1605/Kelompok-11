<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LaporanPasien;
use App\Models\JadwalTerapi;
use App\Models\PanduanLatihan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class LaporanPasienController extends Controller
{
    public function index()
    {
        $laporanPasiens = LaporanPasien::with(['jadwalTerapi.user', 'jadwalTerapi.terapis.user', 'panduanLatihan.terapis.user'])->get();
        return response()->json([
            'status' => 'success',
            'data' => $laporanPasiens
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'keluhan_pasien' => 'required|string',
            'jadwal_terapi_id_jadwal_terapi' => 'required|exists:jadwal_terapi,id_jadwal_terapi',
            'panduan_latihan_id_panduan_latihan' => 'required|exists:panduan_latihans,id_panduan_latihan',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();
            
            $laporanPasien = LaporanPasien::create([
                'keluhan_pasien' => $request->keluhan_pasien,
                'jadwal_terapi_id_jadwal_terapi' => $request->jadwal_terapi_id_jadwal_terapi,
                'panduan_latihan_id_panduan_latihan' => $request->panduan_latihan_id_panduan_latihan,
            ]);

            DB::commit();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Laporan pasien berhasil dibuat',
                'data' => $laporanPasien->load(['jadwalTerapi.user', 'jadwalTerapi.terapis.user', 'panduanLatihan.terapis.user'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal membuat laporan pasien: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $laporanPasien = LaporanPasien::with(['jadwalTerapi.user', 'jadwalTerapi.terapis.user', 'panduanLatihan.terapis.user'])->find($id);

        if (!$laporanPasien) {
            return response()->json([
                'status' => 'error',
                'message' => 'Laporan pasien tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $laporanPasien
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $laporanPasien = LaporanPasien::find($id);

        if (!$laporanPasien) {
            return response()->json([
                'status' => 'error',
                'message' => 'Laporan pasien tidak ditemukan'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'keluhan_pasien' => 'sometimes|required|string',
            'jadwal_terapi_id_jadwal_terapi' => 'sometimes|required|exists:jadwal_terapi,id_jadwal_terapi',
            'panduan_latihan_id_panduan_latihan' => 'sometimes|required|exists:panduan_latihans,id_panduan_latihan',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();
            
            $laporanPasien->update($request->only([
                'keluhan_pasien',
                'jadwal_terapi_id_jadwal_terapi',
                'panduan_latihan_id_panduan_latihan',
            ]));

            DB::commit();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Laporan pasien berhasil diperbarui',
                'data' => $laporanPasien->load(['jadwalTerapi.user', 'jadwalTerapi.terapis.user', 'panduanLatihan.terapis.user'])
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memperbarui laporan pasien: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        $laporanPasien = LaporanPasien::find($id);

        if (!$laporanPasien) {
            return response()->json([
                'status' => 'error',
                'message' => 'Laporan pasien tidak ditemukan'
            ], 404);
        }

        try {
            DB::beginTransaction();
            
            $laporanPasien->delete();
            
            DB::commit();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Laporan pasien berhasil dihapus'
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menghapus laporan pasien: ' . $e->getMessage()
            ], 500);
        }
    }
}