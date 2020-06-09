<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Quote;
use App\User;
use App\Notification;
use App\Communication;
use Auth;
use OneSignal;

class CommunicationsController extends Controller
{
    public function show(Quote $quote)
    {
        $communications = Communication::where('quote_id', $quote->id)->get();
     
        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ['communications' => $communications]
        ], 200);
    }

    public function store(Request $request, Quote $quote)
    {
        $quote->can_edit = true;
        $quote->save();

        $communication = new Communication();
        $communication->body = $request->body;
        $communication->user_id = Auth::id();
        $communication->quote_id = $quote->id;
        
        if ( $communication->save() ) {

            $notification = new Notification();
            $notification->title = "Commentaire ajouté";
            $notification->content = "Un commentaire a été ajouté dans la conversation";
            $notification->user_id = Auth::id();
            $notification->quote_id = $quote->id;

            if ( !Auth::user()->admin ) {
                $notification->admin = true;
            }

            if ( $notification->save() ) {
                if ( Auth::user()->admin ) {
                    $parameters = [
                        'headings' => [
                            'en' => 'Communication added',
                            'fr' => 'Commentaire ajouté'
                        ],
                        'contents' => [
                            'en' => 'A quote request has been created',
                            'fr' => 'Commentaire ajouté dans la conversation'
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
                } else {
                    $admins = User::where('admin', true)->get();
    
                    foreach ( $admins as $admin ) {
                        $parameters = [
                            'headings' => [
                                'en' => 'Communication added',
                                'fr' => 'Commentaire ajouté'
                            ],
                            'contents' => [
                                'en' => 'A quote request has been created',
                                'fr' => 'Commentaire ajouté dans la conversation'
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
                                    "value" => $admin->id
                                ]
                            ],
                            'included_segments' => ['All']
                        ];
        
                        OneSignal::sendNotificationCustom($parameters);
                    }
                }
            }

        }

        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ['communication' => $communication]
        ], 200);
    }
}
