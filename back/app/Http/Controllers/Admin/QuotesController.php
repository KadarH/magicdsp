<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Quote;

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
            'data' => ['quotes' => $quotes]
        ],200);
    }

    public function accept(Quote $quote) 
    {
        $quote->waiting = false;
        $quote->accepted = true;
        $quote->refused = false;
        $quote->save();

        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ''
        ],200);
    }

    public function refuse(Quote $quote) 
    {
        $quote->waiting = false;
        $quote->accepted = false;
        $quote->refused = true;
        $quote->save();

        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ''
        ],200);
    }
}
