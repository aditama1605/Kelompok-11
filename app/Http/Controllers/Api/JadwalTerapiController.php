<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JadwalTerapi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class JadwalTerapiController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => true,
            'message' => 'Data semua jadwal terapi',
            'data' => JadwalTerapi::with('terapis')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'tanggal' => 'required|date',
            'jadwal_terapi' => 'required|date',
            'terapis_id' => 'required|exists:terapis,id_terapis',
            'user_id' => 'required|exists:users,iduser',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        $jadwal = JadwalTerapi::create($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Jadwal terapi berhasil ditambahkan',
            'data' => $jadwal
        ]);
    }

    public function show($id)
    {
        $jadwal = JadwalTerapi::with('terapis')->find($id);

        if (!$jadwal) {
            return response()->json(['status' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        return response()->json(['status' => true, 'data' => $jadwal]);
    }

    public function update(Request $request, $id)
    {
        $jadwal = JadwalTerapi::find($id);
        if (!$jadwal) {
            return response()->json(['status' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $validator = Validator::make($request->all(), [
            'tanggal' => 'sometimes|date',
            'jadwal_terapi' => 'sometimes|date',
            'terapis_id' => 'sometimes|exists:terapis,id_terapis',
            'user_id' => 'sometimes|exists:users,iduser',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        $jadwal->update($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Jadwal terapi berhasil diperbarui',
            'data' => $jadwal
        ]);
    }

    public function destroy($id)
    {
        $jadwal = JadwalTerapi::find($id);
        if (!$jadwal) {
            return response()->json(['status' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $jadwal->delete();

        return response()->json(['status' => true, 'message' => 'Jadwal terapi berhasil dihapus']);
    }
}