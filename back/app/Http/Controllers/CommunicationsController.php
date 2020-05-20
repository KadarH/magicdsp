<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Quote;
use App\Communication;
use Auth;

class CommunicationsController extends Controller
{
    public function show(Quote $quote)
    {
        $communications = Communication::where('quote_id', $quote->id)->get();
     
        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ['communications' => $communications]
        ],200);
    }

    public function store(Request $request, Quote $quote)
    {
        $communication = new Communication();
        $communication->body = $request->body;
        $communication->user_id = Auth::id();
        $communication->quote_id = $quote->id;
        $communication->save();

        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ['communication' => $communication]
        ],200);
    }
}
