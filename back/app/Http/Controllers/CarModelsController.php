<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\CarModel;

class CarModelsController extends Controller
{
    public function index()
    {
        $models = CarModel::get();

        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ['models' => $models]
        ], 200);
    }
}
