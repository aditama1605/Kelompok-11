<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Terapis;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;

class TerapisController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $terapis = Terapis::with('user')->get();
            $terapis->map(function ($item) {
                if ($item->foto) {
                    $item->file_url = asset('storage/' . $item->foto);
                }
                return $item;
            });
            return response()->json([
                'status' => 'success',
                'data' => $terapis,
                'message' => 'Daftar terapis berhasil diambil',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil daftar terapis',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:255', // Untuk users table
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'spesialisasi' => 'nullable|string|max:255',
            'foto' => 'nullable|image|max:4048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Buat akun user terlebih dahulu
        $user = User::create([
            'nama' => $request->nama,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'terapis',
        ]);

        // Buat data terapis
        $data = $request->only(['spesialisasi']);
        if ($request->hasFile('foto')) {
            $file = $request->file('foto');
            $timestamp = now()->format('YmdHis');
            $extension = $file->getClientOriginalExtension();
            $filename = "fototerapis_{$timestamp}.{$extension}";
            $data['foto'] = $file->storeAs('terapis_photos', $filename, 'public');
        }

        $terapis = Terapis::create(array_merge($data, ['iduser' => $user->iduser]));

        // Tambahkan file_url dan muat relasi user
        if ($terapis->foto) {
            $terapis->file_url = asset('storage/' . $terapis->foto);
        }
        $terapis->load('user');

        return response()->json([
            'status' => 'success',
            'message' => 'Terapis dan akun berhasil dibuat',
            'data' => $terapis,
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        try {
            $terapis = Terapis::with('user')->findOrFail($id);
            if ($terapis->foto) {
                $terapis->file_url = asset('storage/' . $terapis->foto);
            }
            return response()->json([
                'status' => 'success',
                'data' => $terapis,
                'message' => 'Terapis berhasil diambil',
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terapis tidak ditemukan',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil terapis',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


public function update(Request $request, int $id): JsonResponse
{
    try {
        $terapis = Terapis::findOrFail($id);
        $user = User::findOrFail($terapis->iduser);

        $validator = Validator::make($request->all(), [
            'nama' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->iduser . ',iduser',
            'password' => 'sometimes|string|min:8',
            'spesialisasi' => 'sometimes|string|max:255',
            'foto' => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors(),
            ], 422);
        }

        DB::beginTransaction();

        // Perbarui data user
        $userData = [];
        if ($request->has('nama')) $userData['nama'] = $request->nama;
        if ($request->has('email')) $userData['email'] = $request->email;
        if ($request->has('password')) $userData['password'] = Hash::make($request->password);
        $user->update($userData);

        // Perbarui data terapis
        $data = $request->only(['spesialisasi']);
        if ($request->hasFile('foto')) {
            if ($terapis->foto) {
                Storage::disk('public')->delete($terapis->foto);
            }
            $file = $request->file('foto');
            $timestamp = now()->format('YmdHis');
            $extension = $file->getClientOriginalExtension();
            $filename = "fototerapis_{$timestamp}.{$extension}";
            $data['foto'] = $file->storeAs('terapis_photos', $filename, 'public');
        }

        $terapis->update($data);

        DB::commit();

        // Tambahkan file_url dan muat relasi user
        if ($terapis->foto) {
            $terapis->file_url = asset('storage/' . $terapis->foto);
        }
        $terapis->load('user');

        return response()->json([
            'status' => 'success',
            'message' => 'Terapis berhasil diperbarui',
            'data' => $terapis,
        ], 200);
    } catch (ModelNotFoundException $e) {
        DB::rollBack();
        return response()->json([
            'status' => 'error',
            'message' => 'Terapis tidak ditemukan',
        ], 404);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'status' => 'error',
            'message' => 'Gagal memperbarui terapis',
            'error' => $e->getMessage(),
        ], 500);
    }
}

public function destroy(int $id): JsonResponse
{
    try {
        $terapis = Terapis::findOrFail($id);
        $user = User::findOrFail($terapis->iduser);

        DB::beginTransaction();

        // Hapus foto jika ada
        if ($terapis->foto && Storage::disk('public')->exists($terapis->foto)) {
            Storage::disk('public')->delete($terapis->foto);
        }

        // Hapus terapis dan user
        $terapis->delete();
        $user->delete();

        DB::commit();

        return response()->json([
            'status' => 'success',
            'message' => 'Terapis dan akun berhasil dihapus',
        ], 200);
        
    } catch (ModelNotFoundException $e) {
        DB::rollBack();
        return response()->json([
            'status' => 'error',
            'message' => 'Terapis tidak ditemukan',
        ], 404);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'status' => 'error',
            'message' => 'Gagal menghapus terapis: ' . $e->getMessage(),
            'error' => $e->getMessage(),
        ], 500);
    }
}
}

