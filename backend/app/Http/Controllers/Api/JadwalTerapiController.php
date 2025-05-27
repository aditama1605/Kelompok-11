<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JadwalTerapi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;

class JadwalTerapiController extends Controller
{
    /**
     * Display a listing of the jadwal terapi.
     */
    public function index(): JsonResponse
    {
        $jadwalTerapi = JadwalTerapi::with(['terapis', 'user'])->get();
        return response()->json([
            'status' => 'success',
            'data' => $jadwalTerapi,
        ], 200);
    }

    /**
     * Store a newly created jadwal terapi in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'tanggal' => 'nullable|date',
            'jadwal_terapi' => 'nullable|date',
            'terapis_id' => 'required|exists:terapis,id_terapis',
            'user_id' => 'required|exists:users,iduser',
            'jenis_layanan' => 'required|in:Home Visit,OnWeb',
            'alamat' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $jadwalTerapi = JadwalTerapi::create($request->only([
            'tanggal',
            'jadwal_terapi',
            'terapis_id',
            'user_id',
            'jenis_layanan',
            'alamat',
        ]));

        return response()->json([
            'status' => 'success',
            'message' => 'Jadwal Terapi created successfully',
            'data' => $jadwalTerapi->load(['terapis', 'user']),
        ], 201);
    }

    /**
     * Display the specified jadwal terapi.
     */
    public function show($id): JsonResponse
    {
        $jadwalTerapi = JadwalTerapi::with(['terapis', 'user'])->find($id);

        if (!$jadwalTerapi) {
            return response()->json([
                'status' => 'error',
                'message' => 'Jadwal Terapi not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $jadwalTerapi,
        ], 200);
    }

    /**
     * Update the specified jadwal terapi in storage.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $jadwalTerapi = JadwalTerapi::find($id);

        if (!$jadwalTerapi) {
            return response()->json([
                'status' => 'error',
                'message' => 'Jadwal Terapi not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'tanggal' => 'nullable|date',
            'jadwal_terapi' => 'nullable|date',
            'terapis_id' => 'sometimes|required|exists:terapis,id_terapis',
            'user_id' => 'sometimes|required|exists:users,iduser',
            'jenis_layanan' => 'sometimes|required|in:Home Visit,OnWeb',
            'alamat' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $jadwalTerapi->update($request->only([
            'tanggal',
            'jadwal_terapi',
            'terapis_id',
            'user_id',
            'jenis_layanan',
            'alamat',
        ]));

        return response()->json([
            'status' => 'success',
            'message' => 'Jadwal Terapi updated successfully',
            'data' => $jadwalTerapi->load(['terapis', 'user']),
        ], 200);
    }

    /**
     * Remove the specified jadwal terapi from storage.
     */
    public function destroy($id): JsonResponse
    {
        $jadwalTerapi = JadwalTerapi::find($id);

        if (!$jadwalTerapi) {
            return response()->json([
                'status' => 'error',
                'message' => 'Jadwal Terapi not found',
            ], 404);
        }

        $jadwalTerapi->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Jadwal Terapi deleted successfully',
        ], 200);
    }
}