<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\User;
use App\Status;
use App\Quote;
use Illuminate\Http\Request;

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
        $quotes = Quote::where('user_id', $user->id)->orderBy('id', 'DESC')->get();

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

    public function update(Request $request, User $user)
    {
        $user->firstname = $request->firstname;
        $user->lastname = $request->lastname;
        $user->address = $request->address;
        $user->phone_number = $request->phone_number;
        $user->email = $request->email;
        $user->vat_number = $request->vat_number;

        if ( $user->save() ) {
            $quotes = Quote::where('user_id', $user->id)->orderBy('id', 'DESC')->get();
            $user->quotes = $quotes;

            return response()->json([
                'success' => true,
                'message' => '',
                'data' => ['user' => $user]
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => '',
                'data' => ''
            ], 200);
        }
    }

    public function delete(User $user) 
    {
        if ( $user->delete() ) {
            return response()->json([
                'success' => true,
                'message' => '',
                'data' => ''
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => '',
                'data' => ''
            ], 200);
        }
    }
}
