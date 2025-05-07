<?php

namespace App\Http\Controllers\Api;

use App\Models\LaporanPerkembangan;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class LaporanPerkembanganController extends Controller
{
    // Mendapatkan semua laporan perkembangan
    public function index()
    {
        return response()->json(LaporanPerkembangan::all());
    }

    // Mendapatkan laporan perkembangan berdasarkan ID
    public function show($id)
    {
        $laporanPerkembangan = LaporanPerkembangan::find($id);

        if (!$laporanPerkembangan) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        return response()->json($laporanPerkembangan);
    }

    // Menyimpan laporan perkembangan baru
    public function store(Request $request)
    {
        $request->validate([
            'ringkasan_perkembangan' => 'required',
            'tanggal_laporan' => 'required|date',
            'laporan_pasiens_id_laporan_pasiens' => 'required|exists:laporan_pasiens,id_laporan_pasiens'
        ]);

        $laporanPerkembangan = LaporanPerkembangan::create($request->all());
        return response()->json($laporanPerkembangan, 201);
    }

    // Memperbarui laporan perkembangan
    public function update(Request $request, $id)
    {
        $laporanPerkembangan = LaporanPerkembangan::findOrFail($id);
        $laporanPerkembangan->update($request->all());
        return response()->json($laporanPerkembangan, 200);
    }

    // Menghapus laporan perkembangan
    public function destroy($id)
    {
        LaporanPerkembangan::destroy($id);
        return response()->json(null, 204);
    }
}
