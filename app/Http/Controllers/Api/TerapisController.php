<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Terapis;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class TerapisController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json([
            'status' => true,
            'message' => 'Data semua terapis',
            'data' => Terapis::all()
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'tanggal_mulai' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $terapis = Terapis::create($request->all());
            return response()->json([
                'status' => true,
                'message' => 'Terapis berhasil ditambahkan',
                'data' => $terapis
            ], 201);
        } catch (\Exception $e) {
            Log::error('Gagal menambahkan terapis: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Gagal menambahkan terapis',
                'errors' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $terapis = Terapis::find($id);

        if (!$terapis) {
            return response()->json([
                'status' => false,
                'message' => 'Data terapis tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Data terapis',
            'data' => $terapis
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $terapis = Terapis::find($id);

        if (!$terapis) {
            return response()->json([
                'status' => false,
                'message' => 'Data terapis tidak ditemukan'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'tanggal_mulai' => 'sometimes|date',
        ]);

        if ($validator->fails()) {
            Log::error('Validasi gagal saat memperbarui terapis ID ' . $id . ': ' . json_encode($validator->errors()));
            return response()->json([
                'status' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $terapis->update($request->all());
            return response()->json([
                'status' => true,
                'message' => 'Terapis berhasil diperbarui',
                'data' => $terapis
            ], 200);
        } catch (\Exception $e) {
            Log::error('Gagal memperbarui terapis ID ' . $id . ': ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Gagal memperbarui terapis',
                'errors' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $terapis = Terapis::find($id);

        if (!$terapis) {
            return response()->json([
                'status' => false,
                'message' => 'Data terapis tidak ditemukan'
            ], 404);
        }

        try {
            $terapis->delete();
            return response()->json([
                'status' => true,
                'message' => 'Terapis berhasil dihapus'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Gagal menghapus terapis ID ' . $id . ': ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Gagal menghapus terapis',
                'errors' => $e->getMessage()
            ], 500);
        }
    }
}