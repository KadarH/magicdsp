<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\GoogleCalendar\Event;
use App\Garage;
use App\Quote;
use Carbon\Carbon;

class GaragesController extends Controller
{
    public function index()
    {
        $garages = Garage::get();

        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ['garages' => $garages]
        ], 200);
    }

    public function availabilities(Request $request, Garage $garage)
    {
        $now = Date('Y-m-d H:i');
        $now24h = Date('Y-m-d H:i', strtotime('+24 hours'));

        $garage->google_calendar = unserialize($garage->google_calendar);
        $garage->opening = unserialize($garage->opening);

        // Get all events from google calendar
        $calendars = [];
        $openings = [];
        foreach ( $garage->google_calendar as $calendar ) {
            $calendars[$calendar['id']] = Event::get(Carbon::createFromDate($request->date.' 00:00:00'), Carbon::createFromDate($request->date.' 23:59:59'), [], $calendar['id']);
            $openings[$calendar['id']] = $garage->opening[Carbon::createFromDate($request->date)->dayOfWeek];
        }

        // Get total duration of tasks
        $quote = Quote::where('id', $request->quote_id)->first();
        $totalDuration = 0;
        if ( !empty($quote->tasks) ) {
            foreach( $quote->tasks as $task ) {
                $totalDuration = $totalDuration + $task->duration;
            }
        }

        foreach ( $calendars as $key => $calendar ) {
            if ( $calendar->isEmpty() ) {
            } else {
                foreach ( $calendar as $event ) {
                    $start = Carbon::parse($event->start->dateTime);
                    $end = Carbon::parse($event->end->dateTime);

                    $diffInMinutes = $start->diffInMinutes($end);
                    $diffInMinutes = $diffInMinutes / 30;

                    if ( $diffInMinutes == 1 ) {
                        if( $openings[$key][Carbon::parse($event->start->dateTime)->format('H:i')] == 'opened' ) {
                            $openings[$key][Carbon::parse($event->start->dateTime)->format('H:i')] = 'reserved';
                        }
                    } else {
                        if( $openings[$key][Carbon::parse($event->start->dateTime)->format('H:i')] == 'opened' ) {
                            $openings[$key][Carbon::parse($event->start->dateTime)->format('H:i')] = 'reserved';
                        }

                        while ( $diffInMinutes != 0 ) {
                            if( $openings[$key][Carbon::parse($event->start->dateTime)->addMinute(30)->format('H:i')] == 'opened' ) {
                                $openings[$key][Carbon::parse($event->start->dateTime)->addMinute(30)->format('H:i')] = 'reserved';
                            }

                            $diffInMinutes--;
                        }
                    }
                }
            }
        }

        $finalOpening = [];

        foreach ( $openings as $key => $opening ) {
            foreach ( $opening as $hour => $status ) {

                if ( empty($finalOpening[$hour]) ) {
                    $finalOpening[$hour] = $status;
                } else {
                    if ( $finalOpening[$hour] != 'opened' ) {
                        $finalOpening[$hour] = $status; 
                    }
                }

            }
        }

        foreach ( $finalOpening as $hour => $status ) {

            if ( !empty($finalOpening[Carbon::parse($request->date . ' ' . $hour)->addMinute($totalDuration)->format('H:i')]) ) {
                $taskHourNumber = $totalDuration / 30;

                if ( $finalOpening[Carbon::parse($request->date . ' ' . $hour)->addMinute($totalDuration)->format('H:i')] != 'opened' ) {
                    $heurequicoince = Carbon::parse($request->date . ' ' . $hour)->addMinute($totalDuration)->format('H:i');

                    while ( $taskHourNumber != 1 ) {
                        if ( $finalOpening[Carbon::parse($heurequicoince)->subMinutes(30)->format('H:i')] == 'closed' ) {
                            $finalOpening[Carbon::parse($heurequicoince)->subMinutes(30)->format('H:i')] = 'closed';
                        } elseif ( $finalOpening[Carbon::parse($heurequicoince)->subMinutes(30)->format('H:i')] == 'reserved' ) {
                            $finalOpening[Carbon::parse($heurequicoince)->subMinutes(30)->format('H:i')] = 'reserved';
                        } else {
                            $finalOpening[Carbon::parse($heurequicoince)->subMinutes(30)->format('H:i')] = 'too_short';
                        }

                        $heurequicoince = Carbon::parse($heurequicoince)->subMinutes(30)->format('H:i');
                        $taskHourNumber--;
                    }
                }
            } else {
                // $taskHourNumber = $totalDuration / 30;
                // $lastHour = array_key_last($finalOpening);
                // $lastStatus = $finalOpening[array_key_last($finalOpening)];
                // $heurequicoince = Carbon::parse($request->date . ' ' . $lastHour)->format('H:i');

                // dump($lastHour);
                // dump($lastStatus);

                // while ( $taskHourNumber != 1 ) {
                //     if ( $finalOpening[Carbon::parse($heurequicoince)->subMinutes(30)->format('H:i')] == 'closed' ) {
                //         $finalOpening[Carbon::parse($heurequicoince)->subMinutes(30)->format('H:i')] = 'closed';
                //     } elseif ( $finalOpening[Carbon::parse($heurequicoince)->subMinutes(30)->format('H:i')] == 'reserved' ) {
                //         $finalOpening[Carbon::parse($heurequicoince)->subMinutes(30)->format('H:i')] = 'reserved';
                //     } else {
                //         $finalOpening[Carbon::parse($heurequicoince)->subMinutes(30)->format('H:i')] = 'too_short';
                //     }

                //     $heurequicoince = Carbon::parse($heurequicoince)->subMinutes(30)->format('H:i');
                //     $taskHourNumber--;
                // }

                // $finalOpening[$lastHour] = 'too_short';
            }

        }

        unset($garage->google_calendar);
        unset($garage->opening);

        foreach ( $finalOpening as $key => $opening ) {
            $toto = $request->date. ' ' . $key;

            if ( $now24h >= $toto  ) {
                if ( $opening == 'opened' ) {
                    $finalOpening[$key] = 'reserved';
                }
            }
        }

        $garage->availabilities = $finalOpening;

        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ['garage' => $garage]
        ], 200);
    }
}
