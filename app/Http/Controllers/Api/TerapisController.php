<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Terapis;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TerapisController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $terapis = Terapis::all();
        return response()->json($terapis);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'tanggal_mulai' => 'required|date',
        ]);

        $terapis = Terapis::create($validatedData);
        return response()->json($terapis, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $terapis = Terapis::findOrFail($id);
        return response()->json($terapis);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'tanggal_mulai' => 'required|date',
        ]);

        $terapis = Terapis::findOrFail($id);
        $terapis->update($validatedData);
        return response()->json($terapis);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $terapis = Terapis::findOrFail($id);
        $terapis->delete();
        return response()->json(null, 204);
    }
}