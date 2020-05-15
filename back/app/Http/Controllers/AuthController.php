<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if ( Auth::attempt(['email' => $request->email, 'password' => $request->password]) ) {
            $user = Auth::user();

            $user = User::where('email', $request->email)->first();

            if ( !$user || !Hash::check($request->password, $user->password) ) {
                return response([
                    'message' => ['These credentials do not match our records.']
                ], 404);
            }
        
            $token = $user->createToken($user->email)->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => '',
                'data' => ['token' => $token, 'user' => $user]
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => ['identifiants incorrects'],
                'data' => ''
            ], 400);
        }
    }

    public function logout()
    {
        $user = Auth::user();
        $user->tokens()->delete();
        Auth::logout();

        return response()->json([
            'success' => true,
            'message' => '',
            'data' => []
        ], 200);
    }
}
