<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\LaporanPerkembangan;
use Illuminate\Http\Request;

class LaporanPerkembanganController extends Controller
{
    public function index()
    {
        return response()->json(
            LaporanPerkembangan::with('laporanPasien')->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'keterangan_perkembangan' => 'required|string',
            'laporan_pasien_id_laporan_pasien' => 'required|exists:laporan_pasiens,id_laporan_pasien',
        ]);

        $laporan = LaporanPerkembangan::create($data);
        return response()->json($laporan, 201);
    }

    public function show($id)
    {
        $laporan = LaporanPerkembangan::with('laporanPasien')->findOrFail($id);
        return response()->json($laporan);
    }

    public function update(Request $request, $id)
    {
        $laporan = LaporanPerkembangan::findOrFail($id);

        $data = $request->validate([
            'keterangan_perkembangan' => 'sometimes|string',
            'laporan_pasien_id_laporan_pasien' => 'sometimes|exists:laporan_pasiens,id_laporan_pasien',
        ]);

        $laporan->update($data);
        return response()->json($laporan);
    }

    public function destroy($id)
    {
        LaporanPerkembangan::findOrFail($id)->delete();
        return response()->json(['message' => 'Laporan perkembangan berhasil dihapus.']);
    }
}
