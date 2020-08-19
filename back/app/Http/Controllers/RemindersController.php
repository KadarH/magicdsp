<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Quote;
use App\Mail\Reminders\Meeting;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class RemindersController extends Controller
{
    public function meeting()
    {
        $tomorrowStart = Carbon::now()->add(1, 'day')->format('Y-m-d 00:00:00');
        $tomorrowEnd = Carbon::now()->add(1, 'day')->format('Y-m-d 23:59:59');

        $quotes = Quote::where([
            ['meeting_date', '>', $tomorrowStart],
            ['meeting_date', '<', $tomorrowEnd],
        ])->get();

        if ( !$quotes->isEmpty() ) {
            foreach ( $quotes as $quote ) {
                Mail::to($quote->user->email)->send(new Meeting($quote));
            }
        }
    }
}
