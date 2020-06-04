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
            if ( !$calendar->isEmpty() ) {
                foreach ( $calendar as $event ) {

                    $start = Carbon::parse($event->start->dateTime);
                    $end = Carbon::parse($event->end->dateTime);

                    $diffInMinutes = $start->diffInMinutes($end);
                    $diffInMinutes = $diffInMinutes / 30;

                    if ( $diffInMinutes == 1 ) {
                        if( $openings[$key][Carbon::parse($event->start->dateTime)->format('H:i')]['status'] == 'opened' ) {
                            $openings[$key][Carbon::parse($event->start->dateTime)->format('H:i')]['status'] = 'reserved';
                        }
                    } else {
                        if( $openings[$key][Carbon::parse($event->start->dateTime)->format('H:i')]['status'] == 'opened' ) {
                            $openings[$key][Carbon::parse($event->start->dateTime)->format('H:i')]['status'] = 'reserved';
                        }

                        $diffInMinutes--;

                        $startIncemented = Carbon::parse($event->start->dateTime);
                        while ( $diffInMinutes != 0 ) {
                            $startIncemented = Carbon::parse($startIncemented)->addMinute(30)->format('H:i');

                            if( $openings[$key][$startIncemented]['status'] == 'opened' ) {
                                $openings[$key][$startIncemented]['status'] = 'reserved';
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
                    if ( $finalOpening[$hour]['status'] != 'opened' ) {
                        $finalOpening[$hour] = $status; 
                    }
                }

            }
        }

        foreach ( $finalOpening as $hour => $status ) {
            $taskHourNumber = $totalDuration / 30;

            if ( $finalOpening[Carbon::parse($request->date . ' ' . $hour)->addMinute($totalDuration)->format('H:i')]['status'] != 'opened' ) {
                $heurequicoince = Carbon::parse($request->date . ' ' . $hour)->addMinute($totalDuration)->format('H:i');

                while ( $taskHourNumber != 1 ) {
                    if ( $finalOpening[Carbon::parse($heurequicoince)->subMinutes(30)->format('H:i')]['status'] == 'closed' ) {
                        $finalOpening[Carbon::parse($heurequicoince)->subMinutes(30)->format('H:i')]['status'] = 'closed';
                    } elseif ( $finalOpening[Carbon::parse($heurequicoince)->subMinutes(30)->format('H:i')]['status'] == 'reserved' ) {
                        $finalOpening[Carbon::parse($heurequicoince)->subMinutes(30)->format('H:i')]['status'] = 'reserved';
                    } else {
                        $finalOpening[Carbon::parse($heurequicoince)->subMinutes(30)->format('H:i')]['status'] = 'too_short';
                    }

                    $heurequicoince = Carbon::parse($heurequicoince)->subMinutes(30)->format('H:i');
                    $taskHourNumber--;
                }
            }
        }

        unset($garage->google_calendar);
        unset($garage->opening);

        foreach ( $finalOpening as $key => $opening ) {
            $tmp = $request->date. ' ' . $key;

            if ( Date('Y-m-d H:i', strtotime('+24 hours')) >= $tmp  ) {
                if ( $opening['status'] == 'opened' ) {
                    $finalOpening[$key]['status'] = 'reserved';
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
