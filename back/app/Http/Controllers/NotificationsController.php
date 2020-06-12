<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Notification;

class NotificationsController extends Controller
{
    public function index()
    {
        $notifications = Notification::orderBy('created_at', 'DESC')->get();

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
}
