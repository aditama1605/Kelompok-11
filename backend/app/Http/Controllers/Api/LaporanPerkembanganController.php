<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LaporanPerkembangan;
use App\Models\LaporanPasien;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class LaporanPerkembanganController extends Controller
{
    public function index()
    {
        $laporanPerkembangans = LaporanPerkembangan::with([
            'laporanPasien.jadwalTerapi.user',
            'laporanPasien.jadwalTerapi.terapis.user',
            'laporanPasien.panduanLatihan'
        ])->get();
        return response()->json([
            'status' => 'success',
            'data' => $laporanPerkembangans
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ringkasan_perkembangan' => 'required|string',
            'tanggal_laporan' => 'required|date',
            'file_perkembangan' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048', // Changed to nullable
            'laporan_pasiens_id_laporan_pasiens' => 'required|exists:laporan_pasiens,id_laporan_pasien',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $data = [
                'ringkasan_perkembangan' => $request->ringkasan_perkembangan,
                'tanggal_laporan' => $request->tanggal_laporan,
                'laporan_pasiens_id_laporan_pasiens' => $request->laporan_pasiens_id_laporan_pasiens,
            ];

            // Handle file upload if present
            if ($request->hasFile('file_perkembangan')) {
                $file = $request->file('file_perkembangan');
                $fileName = time() . '_' . rawurlencode($file->getClientOriginalName());
                $filePath = $file->storeAs('laporan_perkembangan', $fileName, 'public');
                $data['file_perkembangan'] = $fileName;
            }

            $laporanPerkembangan = LaporanPerkembangan::create($data);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Laporan perkembangan berhasil dibuat',
                'data' => $laporanPerkembangan->load([
                    'laporanPasien.jadwalTerapi.user',
                    'laporanPasien.jadwalTerapi.terapis.user',
                    'laporanPasien.panduanLatihan'
                ])
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal membuat laporan perkembangan: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $laporanPerkembangan = LaporanPerkembangan::with([
            'laporanPasien.jadwalTerapi.user',
            'laporanPasien.jadwalTerapi.terapis.user',
            'laporanPasien.panduanLatihan'
        ])->find($id);

        if (!$laporanPerkembangan) {
            return response()->json([
                'status' => 'error',
                'message' => 'Laporan perkembangan tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $laporanPerkembangan
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $laporanPerkembangan = LaporanPerkembangan::find($id);

        if (!$laporanPerkembangan) {
            return response()->json([
                'status' => 'error',
                'message' => 'Laporan perkembangan tidak ditemukan'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'ringkasan_perkembangan' => 'sometimes|required|string',
            'tanggal_laporan' => 'sometimes|required|date',
            'file_perkembangan' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:10240', // Changed to nullable
            'laporan_pasiens_id_laporan_pasiens' => 'sometimes|required|exists:laporan_pasiens,id_laporan_pasien',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $data = $request->only([
                'ringkasan_perkembangan',
                'tanggal_laporan',
                'laporan_pasiens_id_laporan_pasiens',
            ]);

            if ($request->hasFile('file_perkembangan')) {
                // Delete old file if it exists
                if ($laporanPerkembangan->file_perkembangan) {
                    Storage::disk('public')->delete('laporan_perkembangan/' . $laporanPerkembangan->file_perkembangan);
                }

                $file = $request->file('file_perkembangan');
                $fileName = time() . '_' . rawurlencode($file->getClientOriginalName());
                $filePath = $file->storeAs('laporan_perkembangan', $fileName, 'public');
                $data['file_perkembangan'] = $fileName;
            } elseif ($request->has('file_perkembangan') && $request->file_perkembangan === null) {
                // If file_perkembangan is explicitly set to null, remove the existing file
                if ($laporanPerkembangan->file_perkembangan) {
                    Storage::disk('public')->delete('laporan_perkembangan/' . $laporanPerkembangan->file_perkembangan);
                    $data['file_perkembangan'] = null;
                }
            }

            $laporanPerkembangan->update($data);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Laporan perkembangan berhasil diperbarui',
                'data' => $laporanPerkembangan->load([
                    'laporanPasien.jadwalTerapi.user',
                    'laporanPasien.jadwalTerapi.terapis.user',
                    'laporanPasien.panduanLatihan'
                ])
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memperbarui laporan perkembangan: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        $laporanPerkembangan = LaporanPerkembangan::find($id);

        if (!$laporanPerkembangan) {
            return response()->json([
                'status' => 'error',
                'message' => 'Laporan perkembangan tidak ditemukan'
            ], 404);
        }

        try {
            DB::beginTransaction();

            if ($laporanPerkembangan->file_perkembangan) {
                Storage::disk('public')->delete('laporan_perkembangan/' . $laporanPerkembangan->file_perkembangan);
            }

            $laporanPerkembangan->delete();

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Laporan perkembangan berhasil dihapus'
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menghapus laporan perkembangan: ' . $e->getMessage()
            ], 500);
        }
    }
}