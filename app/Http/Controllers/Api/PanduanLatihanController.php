<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\PanduanLatihan;
use Illuminate\Http\Request;

class PanduanLatihanController extends Controller
{
    public function index()
    {
        return response()->json(PanduanLatihan::with('terapis')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'deskripsi_latihan' => 'required|string',
            'durasi' => 'required|date_format:H:i:s',
            'frekuensi' => 'required|string|max:45',
            'terapis_id_terapis' => 'required|exists:terapis,id_terapis',
        ]);

        $new = PanduanLatihan::create($data);
        return response()->json($new, 201);
    }

    public function show($id)
    {
        $panduan = PanduanLatihan::with('terapis')->findOrFail($id);
        return response()->json($panduan);
    }

    public function update(Request $request, $id)
    {
        $panduan = PanduanLatihan::findOrFail($id);

        $data = $request->validate([
            'deskripsi_latihan' => 'sometimes|string',
            'durasi' => 'sometimes|date_format:H:i:s',
            'frekuensi' => 'sometimes|string|max:45',
            'terapis_id_terapis' => 'sometimes|exists:terapis,id_terapis',
        ]);

        $panduan->update($data);
        return response()->json($panduan);
    }

    public function destroy($id)
    {
        PanduanLatihan::findOrFail($id)->delete();
        return response()->json(['message' => 'Panduan latihan berhasil dihapus.']);
    }
}
