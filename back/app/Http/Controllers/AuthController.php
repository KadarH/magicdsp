<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use Auth;
use App\Status;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Mail\PasswordReset;
use Illuminate\Support\Facades\Mail;

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
            $user['status'] = Status::where('id', $user->status_id)->first();

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

    public function register(Request $request)
    {
        $dataToValidate = [
            'firstname' => 'required',
            'lastname' => 'required',
            'address' => 'required',
            'phone_number' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required',
            'status_id' => 'required'
        ];

        if ( $request->status_id == 2 || $request->status_id == 3 ) {
            $dataToValidate['vat_number'] = 'required';
        }

        $request->validate($dataToValidate);

        $user = new User();
        $user->firstname = $request->firstname;
        $user->lastname = $request->lastname;
        $user->address = $request->address;
        $user->phone_number = $request->phone_number;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->status_id = $request->status_id;

        if ( !empty($request->vat_number) ) {
            $user->vat_number = $request->vat_number;
        }

        if ( $user->save() ) {
            if ( Auth::attempt(['email' => $request->email, 'password' => $request->password]) ) {
                $user = Auth::user();

                $user = User::where('email', $request->email)->first();

                if ( !$user || !Hash::check($request->password, $user->password) ) {
                    return response([
                        'message' => ['These credentials do not match our records.']
                    ], 404);
                }
            
                $token = $user->createToken($user->email)->plainTextToken;
                $user['status'] = Status::where('id', $user->status_id)->first();

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
    }

    public function passwordForgot(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $user = User::where('email', $request->email)->first();
        
        if ( !empty($user) ) {
            $user->password_reset_at = date('Y-m-d H:i:s');
            $user->password_reset_token = Str::random(200);
            $user->save();

            Mail::to($user->email)->send(new PasswordReset($user));

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
            ], 400);
        }
    }

    public function passwordReset($token)
    {
        if ( empty($token) ) {
            return response()->json([
                'success' => false,
                'message' => '',
                'data' => ''
            ], 400);
        }

        $user = User::where('password_reset_token', $token)->first();

        if ( !empty($user) ) {
            $diff = Carbon::now()->diffInMinutes(Carbon::parse($user->password_reset_at));

            if ( $diff < 60 ) {
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
                ], 400);
            }
        } else {
            return response()->json([
                'success' => false,
                'message' => '',
                'data' => ''
            ], 400);
        }
    }

    public function passwordNew(Request $request)
    {
        $request->validate([
            'password' => 'required',
            'token' => 'required'
        ]);

        $user = User::where('password_reset_token', $request->token)->first();

        if ( !empty($user) ) {
            $diff = Carbon::now()->diffInMinutes(Carbon::parse($user->password_reset_at));

            if ( $diff < 60 ) {
                $user->password = Hash::make($request->password);
                $user->password_reset_at = null;
                $user->password_reset_token = null;
                $user->save();

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
                ], 400);
            }
        } else {
            return response()->json([
                'success' => false,
                'message' => '',
                'data' => ''
            ], 400);
        }
    }
}
