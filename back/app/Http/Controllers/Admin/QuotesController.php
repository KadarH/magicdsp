<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Quote;

class QuotesController extends Controller
{
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
