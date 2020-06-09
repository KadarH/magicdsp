<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Quote;
use App\Task;
use App\Garage;
use App\User;
use App\Notification;
use Auth;
use Spatie\GoogleCalendar\Event;
use Carbon\Carbon;
use OneSignal;

class QuotesController extends Controller
{
    protected function validateRequest()
    {
        return request()->validate([
            'brand' => 'nullable',
            'model' => 'nullable',
            'doors' => 'nullable',
            'year' => 'nullable',
            'plate_number' => 'nullable'
        ]);
    }

    public function index(Request $request)
    {
        if ( $request->type ) {
            if ( Auth::user()->admin ) {
                $quotes = Quote::where($request->type, true)->orderBy('created_at', 'DESC')->get();
            } else {
                $quotes = Quote::where($request->type, true)->where('user_id', Auth::id())->orderBy('created_at', 'DESC')->get();
            }
        } else {
            if ( Auth::user()->admin ) {
                $quotes = Quote::orderBy('created_at', 'DESC')->get();
            } else {
                $quotes = Quote::where('user_id', Auth::id())->orderBy('created_at', 'DESC')->get();
            }
        }

        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ['quotes' => $quotes]
        ],200);
    }

    public function show(Quote $quote)
    {
        $tasks = Task::where('quote_id', $quote->id)->get();

        if ( !empty($tasks) ) {
            $totalPrice = 0;
            $totalDuration = 0;

            foreach ( $tasks as $key => $task ) {
                if ( !empty($task['price']) ) {
                    $totalPrice = $totalPrice + $task['price'];
                }

                if ( !empty($task['duration']) ) {
                    $totalDuration = $totalDuration + $task['duration'];
                }

                if ( !Auth::user()->admin ) {
                    unset($tasks[$key]['price']);
                    unset($tasks[$key]['duration']);
                }

                $tasks[$key]['picture'] = asset('storage/tasks/' . $task->picture);
            }
        }

        $quote['tasks'] = $tasks;
        $quote['price'] = $totalPrice;
        $quote['duration'] = $totalDuration;

        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ['quote' => $quote]
        ],200);
    }

    public function store(Request $request)
    {
        $data = $this->validateRequest();

        $data['user_id'] = Auth::id();
        $quote = Quote::create($data);

        if ( !empty($request->tasks) ) {
            foreach ( $request->tasks as $task ) {
                $newTask = new Task();
                $newTask->description = $task['description'];
                $newTask->picture = $task['picture'];
                $newTask->stroke_id = $task['stroke_id'];
                $newTask->quote_id = $quote->id;
                $newTask->save();
            }
        }

        $quote = Quote::where('id', $quote->id)->first();

        $notification = new Notification();
        $notification->title = "Demande créée";
        $notification->content = "Une demande de devis a été créée";
        $notification->user_id = Auth::id();
        $notification->quote_id = $quote->id;
        $notification->admin = true;
        
        if ( $notification->save() ) {
            $admins = User::where('admin', true)->get();

            foreach ( $admins as $admin ) {
                $parameters = [
                    'headings' => [
                        'en' => 'Quote created',
                        'fr' => 'Demande créée'
                    ],
                    'contents' => [
                        'en' => 'A quote request has been created',
                        'fr' => 'Une demande de devis a été créée'
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

        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ['quote' => $quote]
        ],200);
    }

    public function update(Request $request, Quote $quote)
    {
        $data = $this->validateRequest();

        $quote->update($data);

        if ( !empty($request->tasks) ) {

            foreach ( $request->tasks as $task ) {
                if ( empty($task['id']) ) {
                    $newTask = new Task();
                    $newTask->description = $task['description'];
                    $newTask->picture = $task['picture'];
                    $newTask->stroke_id = $task['stroke_id'];
                    $newTask->quote_id = $quote->id;

                    if ( !empty($quote->price) ) {
                        $newTask->price = $quote->price;
                    }
                    if ( !empty($quote->duration) ) {
                        $newTask->duration = $quote->duration;
                    }

                    $newTask->save();
                } else {
                    $editTask = Task::where('id', $task['id'])->first();
                    $editTask->description = $task['description'];

                    if ( !empty($task['price']) ) {
                        $editTask->price = $task['price'];
                    }
                    if ( !empty($task['duration']) ) {
                        $editTask->duration = $task['duration'];
                    }
                    
                    $editTask->stroke_id = $task['stroke_id'];
                    $editTask->save();
                }
            }

        }

        $quote = Quote::where('id', $quote->id)->first();

        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ['quote' => $quote]
        ], 200); 
    }

    public function accept(Quote $quote)
    {
        $quote->can_edit = false;
        $quote->waiting = false;
        $quote->accepted = true;
        $quote->refused = false;
        $quote->save();

        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ''
        ],200);
    }

    public function meetings(Request $request, Quote $quote) {
        $quote->meeting_date = Carbon::parse($request->date . ' ' . $request->hour);
        $quote->garage_id = $request->garage_id;
        $quote->save();

        // Get total duration of tasks
        $totalDuration = 0;
        if ( !empty($quote->tasks) ) {
            foreach( $quote->tasks as $task ) {
                $totalDuration = $totalDuration + $task->duration;
            }
        }

        $garage = Garage::where('id', $request->garage_id)->first();
        $garage->google_calendar = unserialize($garage->google_calendar);

        // Get all events from google calendar
        $calendars = [];
        foreach ( $garage->google_calendar as $calendar ) {
            $calendars[$calendar['id']] = Event::get(Carbon::createFromDate($request->date.' 00:00:00'), Carbon::createFromDate($request->date.' 23:59:59'), [], $calendar['id']);
        }

        // Check if event already exist with this hour
        $googleCalendarIdToCreateEvent = '';
        foreach ( $calendars as $key => $calendar ) {

            if ( empty($googleCalendarIdToCreateEvent) ) {

                if ( $calendar->isEmpty() ) {
                    $googleCalendarIdToCreateEvent = $key;
                } else {
                    $tmp = 0;
                    foreach ( $calendar as $event ) {
                        $startHour = Carbon::createFromDate($event->start->dateTime)->format('Y-m-d H:i');
                        $endHour = Carbon::createFromDate($event->end->dateTime)->format('Y-m-d H:i');
                        $requestFrom = Carbon::createFromDate($request->date . ' ' . $request->hour)->format('Y-m-d H:i');
                        $requestTo = Carbon::createFromDate($request->date . ' ' . $request->hour)->addMinute($totalDuration)->format('Y-m-d H:i');

                        if ( $requestFrom < $startHour && $requestTo > $startHour ) {
                            $tmp++;
                        }
                        if ( $requestFrom < $endHour && $requestTo > $endHour ) {
                            $tmp++;
                        }
                        if ( $requestFrom >= $startHour && $requestTo <= $endHour ) {
                            $tmp++;
                        }
                    }
                    if ( empty($tmp) ) {
                        $googleCalendarIdToCreateEvent = $key;
                    }
                }

            }

        }

        if ( !empty($googleCalendarIdToCreateEvent) ) {
            Event::create([
                'name' => 'RDV demande '.$quote->id,
                'startDateTime' => Carbon::parse($request->date . ' ' . $request->hour),
                'endDateTime' => Carbon::parse($request->date . ' ' . $request->hour)->addMinute($totalDuration),
                'description' => '<b>Nom</b> : '.$quote->user->lastname.'<br><b>Prénom</b> : '.$quote->user->firstname.'<br><b>Marque du véhicule</b> : '.$quote->brand.'<br><b>Modèle du véhicule</b> : '.$quote->model.'<br><b>Numéro de plaque</b> : '.$quote->plate_number.''
            ], $googleCalendarIdToCreateEvent);
    
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

    public function destroy(Quote $quote)
    {
        $quote->delete();
  
        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ''
        ], 200);
    }
}
