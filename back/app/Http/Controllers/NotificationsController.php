<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Notification;

class NotificationsController extends Controller
{
    public function index()
    {
        $notifications = Notification::get();

        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ['notifications' => $notifications]
        ], 200); 
    }
}
