<?php

namespace App\Http\Controllers;

use App\Models\LaporanPasien;
use App\Http\Resources\LaporanPasienResource;
use Illuminate\Http\Request;

class LaporanPasienController extends Controller
{
    public function index()
    {
        return LaporanPasienResource::collection(LaporanPasien::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'keluhan_pasien' => 'required|string',
            'jadwal_terapi_id_jadwal_terapi' => 'required|exists:jadwal_terapis,id_jadwal_terapi',
            'payment_id_payment' => 'required|exists:payments,id_payment',
            'panduan_latihan_id_panduan_latihan' => 'required|exists:panduan_latihans,id_panduan_latihan',
        ]);

        $laporan = LaporanPasien::create($validated);
        return new LaporanPasienResource($laporan);
    }

    public function show($id)
    {
        $laporan = LaporanPasien::findOrFail($id);
        return new LaporanPasienResource($laporan);
    }

    public function update(Request $request, $id)
    {
        $laporan = LaporanPasien::findOrFail($id);
        $laporan->update($request->all());

        return new LaporanPasienResource($laporan);
    }

    public function destroy($id)
    {
        $laporan = LaporanPasien::findOrFail($id);
        $laporan->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }
}
