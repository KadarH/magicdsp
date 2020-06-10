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

        if ( $quote->save() ) {

            $notification = new Notification();
            $notification->title = "Demande refusée";
            $notification->content = "La demande de devis a été refusée";
            $notification->user_id = Auth::id();
            $notification->quote_id = $quote->id;
            $notification->admin = false;

            if ( $notification->save() ) {
                $parameters = [
                    'headings' => [
                        'en' => 'Quote refused',
                        'fr' => 'Demande de devis refusée'
                    ],
                    'contents' => [
                        'en' => 'A quote request has been refused',
                        'fr' => 'La demande de devis a été refusée'
                    ],
                    'big_picture' => 'https://push.tqz.be/img/logo_small.png',
                    'ios_attachments' => [
                        "id" => "https://push.tqz.be/img/logo_small.png"
                    ],
                    'chrome_web_badge' => 'https://push.tqz.be/img/badge.png',
                    'ios_badgeType'  => 'Increase',
                    'ios_badgeCount' => 1,
                    'filters' => [
                        [
                            "field" => "tag", 
                            "key" => "user_id", 
                            "relation" => "=", 
                            "value" => $quote->user_id
                        ]
                    ],
                    'included_segments' => ['All']
                ];

                OneSignal::sendNotificationCustom($parameters);
            }
        }

        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ''
        ],200);
    }
}
