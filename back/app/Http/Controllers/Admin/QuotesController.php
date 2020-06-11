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
            $notification->title = "FROM ADMIN - Demande refusée - ID:".$quote->id;
            $notification->content = "FROM ADMIN - La demande de devis a été refusée - ID:".$quote->id;
            $notification->user_id = Auth::id();
            $notification->quote_id = $quote->id;
            $notification->admin = false;

            if ( $notification->save() ) {
                $parameters = [
                    'headings' => [
                        'en' => 'FROM ADMIN - Quote refused - ID:'.$quote->id,
                        'fr' => 'FROM ADMIN - Demande de devis refusée - ID:'.$quote->id
                    ],
                    'contents' => [
                        'en' => 'FROM ADMIN - A quote request has been refused - ID:'.$quote->id,
                        'fr' => 'FROM ADMIN - La demande de devis a été refusée - ID:'.$quote->id
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
