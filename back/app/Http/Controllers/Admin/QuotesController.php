<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class QuotesController extends Controller
{
    public function index(Request $request)
    {
        if ( $request->type ) {
            $quotes = Quote::where($request->type, true)->where('user_id', Auth::id())->orderBy('created_at', 'DESC')->get();
        } else {
            $quotes = Quote::where('user_id', Auth::id())->get();
        }

        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ['quotes' => $quotes],
        ],200);
    }
}
