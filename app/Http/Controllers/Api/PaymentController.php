<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payment;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => true,
            'message' => 'Data semua payment',
            'data' => Payment::all()
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'status_payment' => 'required|string|max:45',
            'nominal_payment' => 'required|numeric|min:0',
            'tanggal_payment' => 'required|date'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        try {
            $payment = Payment::create($request->all());
            return response()->json([
                'status' => true,
                'message' => 'Payment berhasil ditambahkan',
                'data' => $payment
            ], 201);
        } catch (\Exception $e) {
            Log::error('Gagal membuat payment: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Gagal menambahkan payment',
                'errors' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $payment = Payment::find($id);
        if (!$payment) {
            return response()->json(['status' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Data payment',
            'data' => $payment
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $payment = Payment::find($id);
        if (!$payment) {
            return response()->json(['status' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $validator = Validator::make($request->all(), [
            'status_payment' => 'sometimes|string|max:45',
            'nominal_payment' => 'sometimes|numeric|min:0',
            'tanggal_payment' => 'sometimes|date'
        ]);

        if ($validator->fails()) {
            Log::error('Validasi gagal saat memperbarui payment ID ' . $id . ': ' . json_encode($validator->errors()));
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        try {
            $payment->update($request->all());
            return response()->json([
                'status' => true,
                'message' => 'Payment berhasil diperbarui',
                'data' => $payment
            ], 200);
        } catch (\Exception $e) {
            Log::error('Gagal memperbarui payment ID ' . $id . ': ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Gagal memperbarui payment',
                'errors' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        $payment = Payment::find($id);
        if (!$payment) {
            return response()->json(['status' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        try {
            $payment->delete();
            return response()->json([
                'status' => true,
                'message' => 'Payment berhasil dihapus'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Gagal menghapus payment ID ' . $id . ': ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Gagal menghapus payment',
                'errors' => $e->getMessage()
            ], 500);
        }
    }
}