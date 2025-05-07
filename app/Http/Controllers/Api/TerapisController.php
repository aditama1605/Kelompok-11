<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Terapis;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TerapisController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => true,
            'message' => 'Data semua terapis',
            'data' => Terapis::with(['jadwalTerapi', 'panduanLatihan'])->get()
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'tanggal_mulai' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        $terapis = Terapis::create($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Terapis berhasil ditambahkan',
            'data' => $terapis
        ]);
    }

    public function show($id)
    {
        $terapis = Terapis::with(['jadwalTerapi', 'panduanLatihan'])->find($id);

        if (!$terapis) {
            return response()->json(['status' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        return response()->json(['status' => true, 'data' => $terapis]);
    }

    public function update(Request $request, $id)
    {
        $terapis = Terapis::find($id);
        if (!$terapis) {
            return response()->json(['status' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $validator = Validator::make($request->all(), [
            'tanggal_mulai' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        $terapis->update($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Terapis berhasil diperbarui',
            'data' => $terapis
        ]);
    }

    public function destroy($id)
    {
        $terapis = Terapis::find($id);
        if (!$terapis) {
            return response()->json(['status' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $terapis->delete();

        return response()->json(['status' => true, 'message' => 'Terapis berhasil dihapus']);
    }
}

