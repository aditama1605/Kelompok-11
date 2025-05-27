<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Terapis;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class TerapisController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $terapis = Terapis::all();
            return response()->json([
                'status' => 'success',
                'data' => $terapis,
                'message' => 'Terapis list retrieved successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve terapis list',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'nama' => 'required|string|max:255',
                'spesialisasi' => 'nullable|string|max:255',
                'foto' => 'nullable|image|max:2048',
                'tanggal_mulai' => 'nullable|date',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $data = $request->only(['nama', 'spesialisasi', 'tanggal_mulai']);

            if ($request->hasFile('foto')) {
                $file = $request->file('foto');
                $timestamp = now()->format('YmdHis');
                $extension = $file->getClientOriginalExtension();
                $filename = "fototerapis_{$timestamp}.{$extension}";
                $data['foto'] = $file->storeAs('terapis_photos', $filename, 'public');
            }

            $terapis = Terapis::create($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Terapis created successfully',
                'data' => $terapis,
                'file_url' => $terapis->foto ? asset('storage/' . $terapis->foto) : null,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create terapis',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $terapis = Terapis::findOrFail($id);
            return response()->json([
                'status' => 'success',
                'data' => $terapis,
                'file_url' => $terapis->foto ? asset('storage/' . $terapis->foto) : null,
                'message' => 'Terapis retrieved successfully',
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terapis not found',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve terapis',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $terapis = Terapis::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'nama' => 'sometimes|required|string|max:255',
                'spesialisasi' => 'sometimes|required|string|max:255',
                'foto' => 'nullable|image|max:2048',
                'tanggal_mulai' => 'sometimes|required|date',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $data = $request->only(['nama', 'spesialisasi', 'tanggal_mulai']);

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

            return response()->json([
                'status' => 'success',
                'message' => 'Terapis updated successfully',
                'data' => $terapis,
                'file_url' => $terapis->foto ? asset('storage/' . $terapis->foto) : null,
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terapis not found',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update terapis',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $terapis = Terapis::findOrFail($id);

            if ($terapis->foto) {
                Storage::disk('public')->delete($terapis->foto);
            }

            $terapis->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Terapis deleted successfully',
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terapis not found',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete terapis',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}