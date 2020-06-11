<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\User;
use App\Status;

class UsersController extends Controller
{
    public function index()
    {
        $users = User::get();

        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ['users' => $users]
        ], 200);
    }

    public function statusQuotes(Status $status)
    {
        $users = User::where('status_id', $status->id)->get();
        $quotes = [];

        foreach ( $users as $user ) {
            foreach ( $user->quotes as $quote ) {
                $quotes[] = $quote;
            }
        }

        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ['quotes' => $quotes]
        ], 200);
    }
}
