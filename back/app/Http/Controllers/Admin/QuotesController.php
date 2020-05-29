<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Quote;

class QuotesController extends Controller
{
    public function refuse(Quote $quote) 
    {
        $quote->can_edit = false;
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
