<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;

class PaymentController extends Controller
{
    /**
     * Display a listing of the payments.
     */
    public function index(): JsonResponse
    {
        $payments = Payment::all();

        return response()->json([
            'status' => 'success',
            'data' => $payments,
        ], 200);
    }

    /**
     * Store a newly created payment in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'status_payment' => 'required|string|max:45',
            'nominal_payment' => 'required|numeric|min:0',
            'tanggal_payment' => 'required|date',
            'bukti_pembayaran' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Simpan file jika ada
        $filePath = null;
        if ($request->hasFile('bukti_pembayaran')) {
            $filePath = $request->file('bukti_pembayaran')->store('bukti_pembayaran', 'public');
        }

        // Simpan ke database
        $payment = Payment::create([
            'status_payment' => $request->status_payment,
            'nominal_payment' => $request->nominal_payment,
            'tanggal_payment' => $request->tanggal_payment,
            'bukti_pembayaran' => $filePath,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Payment created successfully',
            'data' => $payment,
            'file_url' => $filePath ? asset('storage/' . $filePath) : null,
        ], 201);
    }

    /**
     * Display the specified payment.
     */
    public function show($id): JsonResponse
    {
        $payment = Payment::find($id);

        if (!$payment) {
            return response()->json([
                'status' => 'error',
                'message' => 'Payment not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $payment,
            'file_url' => $payment->bukti_pembayaran ? asset('storage/' . $payment->bukti_pembayaran) : null,
        ], 200);
    }

    /**
     * Update the specified payment in storage.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $payment = Payment::find($id);

        if (!$payment) {
            return response()->json([
                'status' => 'error',
                'message' => 'Payment not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'status_payment' => 'sometimes|required|string|max:45',
            'nominal_payment' => 'sometimes|required|numeric|min:0',
            'tanggal_payment' => 'sometimes|required|date',
            'bukti_pembayaran' => 'sometimes|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Simpan file jika ada upload baru
        if ($request->hasFile('bukti_pembayaran')) {
            $filePath = $request->file('bukti_pembayaran')->store('bukti_pembayaran', 'public');
            $payment->bukti_pembayaran = $filePath;
        }

        // Update field lainnya
        $payment->fill($request->only([
            'status_payment',
            'nominal_payment',
            'tanggal_payment',
        ]));

        $payment->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Payment updated successfully',
            'data' => $payment,
            'file_url' => $payment->bukti_pembayaran ? asset('storage/' . $payment->bukti_pembayaran) : null,
        ], 200);
    }

    /**
     * Remove the specified payment from storage.
     */
    public function destroy($id): JsonResponse
    {
        $payment = Payment::find($id);

        if (!$payment) {
            return response()->json([
                'status' => 'error',
                'message' => 'Payment not found',
            ], 404);
        }

        $payment->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Payment deleted successfully',
        ], 200);
    }
}
