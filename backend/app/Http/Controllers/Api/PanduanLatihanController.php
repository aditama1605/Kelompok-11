<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PanduanLatihan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PanduanLatihanController extends Controller
{
    public function index()
    {
        $panduanLatihans = PanduanLatihan::with('terapis.user')->get();
        return response()->json([
            'status' => 'success',
            'data' => $panduanLatihans
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama_latihan' => 'required|string|max:255',
            'deskripsi_latihan' => 'required|string',
            'file_latihan' => 'required|file|mimes:pdf,jpeg,png|max:10240', // Updated to match frontend
            'terapis_id_terapis' => 'required|exists:terapis,id_terapis',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $file = $request->file('file_latihan');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('panduan_latihan', $fileName, 'public');

            $panduanLatihan = PanduanLatihan::create([
                'nama_latihan' => $request->nama_latihan,
                'deskripsi_latihan' => $request->deskripsi_latihan,
                'file_latihan' => $fileName,
                'terapis_id_terapis' => $request->terapis_id_terapis,
            ]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Panduan latihan berhasil dibuat',
                'data' => $panduanLatihan->load('terapis.user')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal membuat panduan latihan: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $panduanLatihan = PanduanLatihan::with('terapis.user')->find($id);

        if (!$panduanLatihan) {
            return response()->json([
                'status' => 'error',
                'message' => 'Panduan latihan tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $panduanLatihan
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $panduanLatihan = PanduanLatihan::find($id);

        if (!$panduanLatihan) {
            return response()->json([
                'status' => 'error',
                'message' => 'Panduan latihan tidak ditemukan'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nama_latihan' => 'sometimes|required|string|max:255',
            'deskripsi_latihan' => 'sometimes|required|string',
            'file_latihan' => 'sometimes|file|mimes:pdf,jpeg,png|max:10240',
            'terapis_id_terapis' => 'sometimes|required|exists:terapis,id_terapis',
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
                'nama_latihan',
                'deskripsi_latihan',
                'terapis_id_terapis',
            ]);

            if ($request->hasFile('file_latihan')) {
                if ($panduanLatihan->file_latihan) {
                    Storage::disk('public')->delete('panduan_latihan/' . $panduanLatihan->file_latihan);
                }

                $file = $request->file('file_latihan');
                $fileName = time() . '_' . $file->getClientOriginalName();
                $filePath = $file->storeAs('panduan_latihan', $fileName, 'public');
                $data['file_latihan'] = $fileName;
            }

            $panduanLatihan->update($data);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Panduan latihan berhasil diperbarui',
                'data' => $panduanLatihan->load('terapis.user')
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memperbarui panduan latihan: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        $panduanLatihan = PanduanLatihan::find($id);

        if (!$panduanLatihan) {
            return response()->json([
                'status' => 'error',
                'message' => 'Panduan latihan tidak ditemukan'
            ], 404);
        }

        try {
            DB::beginTransaction();

            if ($panduanLatihan->file_latihan) {
                Storage::disk('public')->delete('panduan_latihan/' . $panduanLatihan->file_latihan);
            }

            $panduanLatihan->delete();

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Panduan latihan berhasil dihapus'
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menghapus panduan latihan: ' . $e->getMessage()
            ], 500);
        }
    }
}