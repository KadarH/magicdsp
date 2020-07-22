<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\CarBrand;

class CarBrandsController extends Controller
{
    public function index()
    {
        $brands = CarBrand::get();

        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ['brands' => $brands]
        ], 200);
    }

    public function show(CarBrand $brand)
    {
        $brand->models = $brand->models;

        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ['brand' => $brand]
        ], 200);
    }
}
