<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payment;
use Illuminate\Support\Facades\Validator;

class PaymentController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => true,
            'message' => 'Data semua payment',
            'data' => Payment::all()
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'status_payment' => 'required|string|max:45',
            'nominal_payment' => 'required|numeric',
            'tanggal_payment' => 'required|date'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        $payment = Payment::create($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Payment berhasil ditambahkan',
            'data' => $payment
        ]);
    }

    public function show($id)
    {
        $payment = Payment::find($id);
        if (!$payment) {
            return response()->json(['status' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        return response()->json(['status' => true, 'data' => $payment]);
    }

    public function update(Request $request, $id)
    {
        $payment = Payment::find($id);
        if (!$payment) {
            return response()->json(['status' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $validator = Validator::make($request->all(), [
            'status_payment' => 'required|string|max:45',
            'nominal_payment' => 'required|numeric',
            'tanggal_payment' => 'required|date'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        $payment->update($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Payment berhasil diperbarui',
            'data' => $payment
        ]);
    }

    public function destroy($id)
    {
        $payment = Payment::find($id);
        if (!$payment) {
            return response()->json(['status' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $payment->delete();

        return response()->json(['status' => true, 'message' => 'Payment berhasil dihapus']);
    }
}

