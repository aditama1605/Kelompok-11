<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LaporanPerkembangan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LaporanPerkembanganController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => true,
            'message' => 'Data semua laporan perkembangan',
            'data' => LaporanPerkembangan::with('laporanPasien')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ringkasan_perkembangan' => 'required|string',
            'tanggal_laporan' => 'required|date',
            'laporan_pasiens_id_laporan_pasiens' => 'required|exists:laporan_pasiens,id_laporan_pasien',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        $laporan = LaporanPerkembangan::create($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Laporan perkembangan berhasil ditambahkan',
            'data' => $laporan
        ], 201);
    }

    public function show($id)
    {
        $laporan = LaporanPerkembangan::with('laporanPasien')->find($id);

        if (!$laporan) {
            return response()->json(['status' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        return response()->json(['status' => true, 'data' => $laporan]);
    }

    public function update(Request $request, $id)
    {
        $laporan = LaporanPerkembangan::find($id);
        if (!$laporan) {
            return response()->json(['status' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $validator = Validator::make($request->all(), [
            'ringkasan_perkembangan' => 'sometimes|string',
            'tanggal_laporan' => 'sometimes|date',
            'laporan_pasiens_id_laporan_pasiens' => 'sometimes|exists:laporan_pasiens,id_laporan_pasien',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        $laporan->update($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Laporan perkembangan berhasil diperbarui',
            'data' => $laporan
        ]);
    }

    public function destroy($id)
    {
        $laporan = LaporanPerkembangan::find($id);
        if (!$laporan) {
            return response()->json(['status' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $laporan->delete();

        return response()->json(['status' => true, 'message' => 'Laporan perkembangan berhasil dihapus']);
    }
}