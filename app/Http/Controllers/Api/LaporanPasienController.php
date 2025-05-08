<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LaporanPasien;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LaporanPasienController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => true,
            'message' => 'Data semua laporan pasien',
            'data' => LaporanPasien::with(['jadwalTerapi', 'payment', 'panduanLatihan'])->get()
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'keluhan_pasien' => 'required|string',
            'jadwal_terapi_id_jadwal_terapi' => 'required|exists:jadwal_terapi,id_jadwal_terapi',
            'payment_id_payment' => 'required|exists:payment,id_payment',
            'panduan_latihan_id_panduan_latihan' => 'required|exists:panduan_latihans,id_panduan_latihan',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        $laporan = LaporanPasien::create($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Laporan pasien berhasil ditambahkan',
            'data' => $laporan
        ], 201);
    }

    public function show($id)
    {
        $laporan = LaporanPasien::with(['jadwalTerapi', 'payment', 'panduanLatihan'])->find($id);

        if (!$laporan) {
            return response()->json(['status' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        return response()->json(['status' => true, 'data' => $laporan]);
    }

    public function update(Request $request, $id)
    {
        $laporan = LaporanPasien::find($id);
        if (!$laporan) {
            return response()->json(['status' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $validator = Validator::make($request->all(), [
            'keluhan_pasien' => 'sometimes|string',
            'jadwal_terapi_id_jadwal_terapi' => 'sometimes|exists:jadwal_terapi,id_jadwal_terapi',
            'payment_id_payment' => 'sometimes|exists:payment,id_payment',
            'panduan_latihan_id_panduan_latihan' => 'sometimes|exists:panduan_latihans,id_panduan_latihan',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        $laporan->update($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Laporan pasien berhasil diperbarui',
            'data' => $laporan
        ]);
    }

    public function destroy($id)
    {
        $laporan = LaporanPasien::find($id);
        if (!$laporan) {
            return response()->json(['status' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $laporan->delete();

        return response()->json(['status' => true, 'message' => 'Laporan pasien berhasil dihapus']);
    }
}