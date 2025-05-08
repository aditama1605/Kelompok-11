<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PanduanLatihan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PanduanLatihanController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => true,
            'message' => 'Data semua panduan latihan',
            'data' => PanduanLatihan::with('terapis')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'deskripsi_latihan' => 'required|string',
            'durasi' => 'required|date_format:H:i:s',
            'frekuensi' => 'required|string|max:45',
            'terapis_id_terapis' => 'required|exists:terapis,id_terapis',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        $panduan = PanduanLatihan::create($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Panduan latihan berhasil ditambahkan',
            'data' => $panduan
        ], 201);
    }

    public function show($id)
    {
        $panduan = PanduanLatihan::with('terapis')->find($id);

        if (!$panduan) {
            return response()->json(['status' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        return response()->json(['status' => true, 'data' => $panduan]);
    }

    public function update(Request $request, $id)
    {
        $panduan = PanduanLatihan::find($id);
        if (!$panduan) {
            return response()->json(['status' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $validator = Validator::make($request->all(), [
            'deskripsi_latihan' => 'sometimes|string',
            'durasi' => 'sometimes|date_format:H:i:s',
            'frekuensi' => 'sometimes|string|max:45',
            'terapis_id_terapis' => 'sometimes|exists:terapis,id_terapis',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        $panduan->update($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Panduan latihan berhasil diperbarui',
            'data' => $panduan
        ]);
    }

    public function destroy($id)
    {
        $panduan = PanduanLatihan::find($id);
        if (!$panduan) {
            return response()->json(['status' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $panduan->delete();

        return response()->json(['status' => true, 'message' => 'Panduan latihan berhasil dihapus']);
    }
}