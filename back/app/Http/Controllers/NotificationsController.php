<?php

namespace App\Http\Controllers;

use App\Notification;
use Auth;

class NotificationsController extends Controller
{
    public function index()
    {
        if ( Auth::user()->admin ) {
            $notifications = Notification::where('admin', true)->orderBy('created_at', 'DESC')->get();
        } else {
            $notifications = Notification::where('user_id', Auth::id())->orderBy('created_at', 'DESC')->get();
        }

        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ['notifications' => $notifications]
        ], 200);
    }

    public function read(Notification $notification)
    {
        $notification->read = true;
        $notification->save();

        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ''
        ], 200); 
    }

    public function delete()
    {
        $notifications = Notification::where('user_id', Auth::id())->delete();

        if ( $notifications ) {
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
