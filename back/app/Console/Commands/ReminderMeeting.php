<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Quote;
use App\Mail\Reminders\Meeting;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class ReminderMeeting extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reminder:meeting';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send reminder meeting email to user';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
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
