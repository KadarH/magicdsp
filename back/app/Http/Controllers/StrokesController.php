<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Stroke;

class StrokesController extends Controller
{
    public function index()
    {
        $strokes = Stroke::get();

        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ['strokes' => $strokes]
        ], 200);
    }
}
