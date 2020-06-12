<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Garage;

class GaragesController extends Controller
{
    protected function validateRequest()
    {
        return request()->validate([
            'name' => 'nullable',
            'google_calendar' => 'nullable',
            'opening' => 'nullable',
            'status_id' => 'nullable'
        ]);
    }

    public function show(Garage $garage)
    {
        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ['garage' => $garage]
        ], 200); 
    }

    public function store()
    {
        $data = $this->validateRequest();

        $garage = Garage::create($data);

        $garage = Garage::where('id', $garage->id)->first();

        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ['garage' => $garage]
        ], 200);
    }

    public function update(Request $request, Garage $garage)
    {
        $data = $this->validateRequest();

        $garage->update($data);

        $garage = Garage::where('id', $garage->id)->first();

        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ['gara$garage' => $garage]
        ], 200); 
    }

    public function destroy(Garage $garage)
    {
        $garage->delete();
  
        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ''
        ], 200);
    }
}
