<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\User;
use App\Status;
use App\Quote;

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

    public function show(User $user)
    {
        $quotes = Quote::where('user_id', $user->id)->get();

        $user['quotes'] = $quotes;

        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ['user' => $user]
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
