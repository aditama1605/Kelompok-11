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
            'tanggal_payment' => 'required|date',
            'bukti_pembayaran' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // max 2MB
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        try {
            // Simpan file gambar ke public/bukti_pembayaran
            if ($request->hasFile('bukti_pembayaran')) {
                $file = $request->file('bukti_pembayaran');
                $filename = time() . '_' . $file->getClientOriginalName();
                $file->move(public_path('bukti_pembayaran'), $filename);
            }

            $payment = Payment::create([
                'status_payment' => $request->status_payment,
                'nominal_payment' => $request->nominal_payment,
                'tanggal_payment' => $request->tanggal_payment,
                'bukti_pembayaran' => $filename ?? null,
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Payment berhasil ditambahkan',
                'data' => $payment
            ], 201);
        } catch (\Exception $e) {
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
            'tanggal_payment' => 'sometimes|date',
            'bukti_pembayaran' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        try {
            $data = $request->only(['status_payment', 'nominal_payment', 'tanggal_payment']);

            if ($request->hasFile('bukti_pembayaran')) {
                $file = $request->file('bukti_pembayaran');
                $filename = time() . '_' . $file->getClientOriginalName();
                $file->move(public_path('bukti_pembayaran'), $filename);
                $data['bukti_pembayaran'] = $filename;
            }

            $payment->update($data);

            return response()->json([
                'status' => true,
                'message' => 'Payment berhasil diperbarui',
                'data' => $payment
            ], 200);
        } catch (\Exception $e) {
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