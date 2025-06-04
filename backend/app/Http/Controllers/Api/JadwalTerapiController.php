<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JadwalTerapi;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

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
            'jadwal_terapi' => 'required|date|after:now',
            'terapis_id' => 'required|exists:terapis,id_terapis',
            'user_id' => 'required|exists:users,iduser',
            'jenis_layanan' => 'required|in:Home Visit,Online',
            'alamat' => 'required_if:jenis_layanan,Home Visit|string|nullable',
            'bukti_pembayaran' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors(),
            ], 422);
        }

        if ($request->user_id != auth()->user()->iduser) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized: Anda hanya dapat membuat jadwal untuk diri sendiri',
            ], 403);
        }

        // Set nominal_payment based on jenis_layanan
        $nominal_payment = $request->jenis_layanan === 'Online' ? 30000 : 200000;

        // Handle file upload for bukti_pembayaran
        $filePath = null;
        if ($request->hasFile('bukti_pembayaran')) {
            $file = $request->file('bukti_pembayaran');
            $filePath = $file->store('bukti_pembayaran', 'public');
        }

        $jadwalTerapi = JadwalTerapi::create([
            'jadwal_terapi' => $request->jadwal_terapi,
            'terapis_id' => $request->terapis_id,
            'user_id' => $request->user_id,
            'jenis_layanan' => $request->jenis_layanan,
            'alamat' => $request->alamat,
            'status' => 'Menunggu Konfirmasi',
            'nominal_payment' => $nominal_payment,
            'bukti_pembayaran' => $filePath,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Jadwal Terapi berhasil dibuat',
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
                'message' => 'Jadwal Terapi tidak ditemukan',
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
                'message' => 'Jadwal Terapi tidak ditemukan',
            ], 404);
        }

        $isPasien = auth()->user()->role === 'pasien' && $jadwalTerapi->user_id == auth()->user()->iduser;
        $isTerapis = auth()->user()->role === 'terapis' && $jadwalTerapi->terapis->iduser == auth()->user()->iduser;

        if (!$isPasien && !$isTerapis) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized: Anda tidak memiliki akses untuk mengedit jadwal ini',
            ], 403);
        }

        if ($isPasien) {
            $validator = Validator::make($request->all(), [
                'jadwal_terapi' => 'sometimes|required|date|after:now',
                'terapis_id' => 'sometimes|required|exists:terapis,id_terapis',
                'user_id' => 'sometimes|required|exists:users,iduser',
                'jenis_layanan' => 'sometimes|required|in:Home Visit,Online',
                'alamat' => 'required_if:jenis_layanan,Home Visit|string|nullable',
                'bukti_pembayaran' => 'sometimes|file|mimes:jpg,jpeg,png,pdf|max:2048',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors(),
                ], 422);
            }

            if ($request->has('user_id') && $request->user_id != auth()->user()->iduser) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized: Anda hanya dapat mengedit jadwal untuk diri sendiri',
                ], 403);
            }

            $data = $request->only([
                'jadwal_terapi',
                'terapis_id',
                'user_id',
                'jenis_layanan',
                'alamat',
            ]);

            // Update nominal_payment if jenis_layanan changes
            if ($request->has('jenis_layanan')) {
                $data['nominal_payment'] = $request->jenis_layanan === 'Online' ? 30000 : 200000;
            }

            // Handle bukti_pembayaran update
            if ($request->hasFile('bukti_pembayaran')) {
                if ($jadwalTerapi->bukti_pembayaran) {
                    Storage::disk('public')->delete($jadwalTerapi->bukti_pembayaran);
                }
                $data['bukti_pembayaran'] = $request->file('bukti_pembayaran')->store('bukti_pembayaran', 'public');
            }

            $jadwalTerapi->update($data);
        } else {
            $validator = Validator::make($request->all(), [
                'status' => 'required|in:Menunggu Konfirmasi,Diterima,Selesai',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $jadwalTerapi->update(['status' => $request->status]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Jadwal Terapi berhasil diperbarui',
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
                'message' => 'Jadwal Terapi tidak ditemukan',
            ], 404);
        }

        if ($jadwalTerapi->bukti_pembayaran) {
            Storage::disk('public')->delete($jadwalTerapi->bukti_pembayaran);
        }

        $jadwalTerapi->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Jadwal Terapi berhasil dihapus',
        ], 200);
    }
}