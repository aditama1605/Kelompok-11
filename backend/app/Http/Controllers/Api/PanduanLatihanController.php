<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PanduanLatihan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;

class PanduanLatihanController extends Controller
{
    /**
     * Display a listing of the panduan latihan.
     */
    public function index(): JsonResponse
    {
        $panduanLatihan = PanduanLatihan::with('terapis')->get();
        return response()->json([
            'status' => 'success',
            'data' => $panduanLatihan,
        ], 200);
    }

    /**
     * Store a newly created panduan latihan in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nama_latihan' => 'required|string|max:45',
            'gambar_latihan' => 'required|string|max:255', // Asumsi string untuk path file
            'deskripsi_latihan' => 'required|string',
            'durasi' => 'required|date_format:H:i:s',
            'frekuensi' => 'required|string|max:45',
            'terapis_id_terapis' => 'required|exists:terapis,id_terapis',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $panduanLatihan = PanduanLatihan::create($request->only([
            'nama_latihan',
            'gambar_latihan',
            'deskripsi_latihan',
            'durasi',
            'frekuensi',
            'terapis_id_terapis',
        ]));

        return response()->json([
            'status' => 'success',
            'message' => 'Panduan Latihan created successfully',
            'data' => $panduanLatihan->load('terapis'),
        ], 201);
    }

    /**
     * Display the specified panduan latihan.
     */
    public function show($id): JsonResponse
    {
        $panduanLatihan = PanduanLatihan::with('terapis')->find($id);

        if (!$panduanLatihan) {
            return response()->json([
                'status' => 'error',
                'message' => 'Panduan Latihan not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $panduanLatihan,
        ], 200);
    }

    /**
     * Update the specified panduan latihan in storage.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $panduanLatihan = PanduanLatihan::find($id);

        if (!$panduanLatihan) {
            return response()->json([
                'status' => 'error',
                'message' => 'Panduan Latihan not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nama_latihan' => 'sometimes|required|string|max:45',
            'gambar_latihan' => 'sometimes|required|string|max:255',
            'deskripsi_latihan' => 'sometimes|required|string',
            'durasi' => 'sometimes|required|date_format:H:i:s',
            'frekuensi' => 'sometimes|required|string|max:45',
            'terapis_id_terapis' => 'sometimes|required|exists:terapis,id_terapis',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $panduanLatihan->update($request->only([
            'nama_latihan',
            'gambar_latihan',
            'deskripsi_latihan',
            'durasi',
            'frekuensi',
            'terapis_id_terapis',
        ]));

        return response()->json([
            'status' => 'success',
            'message' => 'Panduan Latihan updated successfully',
            'data' => $panduanLatihan->load('terapis'),
        ], 200);
    }

    /**
     * Remove the specified panduan latihan from storage.
     */
    public function destroy($id): JsonResponse
    {
        $panduanLatihan = PanduanLatihan::find($id);

        if (!$panduanLatihan) {
            return response()->json([
                'status' => 'error',
                'message' => 'Panduan Latihan not found',
            ], 404);
        }

        $panduanLatihan->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Panduan Latihan deleted successfully',
        ], 200);
    }
}