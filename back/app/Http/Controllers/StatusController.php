<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Status;

class StatusController extends Controller
{
    public function index()
    {
        $status = Status::get();

        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ['status' => $status]
        ], 200);
    }

    public function show(Status $status)
    {
        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ['status' => $status]
        ], 200);
    }
}
