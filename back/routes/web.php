<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('calendar', function () {
    $tmp = [
        [
            'name' => 'prestations Jonathan',
            'id' => '0ijel6fr9raodpin50r648346s@group.calendar.google.com'
        ],
        [
            'name' => 'Tournai - 1',
            'id' => 'rm3e6l1ac4ba5edmnv1ddar7j4@group.calendar.google.com'
        ]
    ];

    echo serialize($tmp);
    die();
});

Route::get('opening', function () {
    $tmp = [
        0 => [
            '09:00' => 'closed',
            '09:30' => 'closed',
            '10:00' => 'closed',
            '10:30' => 'closed',
            '11:00' => 'closed',
            '11:30' => 'closed',
            '12:00' => 'closed',
            '12:30' => 'closed',
            '13:00' => 'closed',
            '13:30' => 'closed',
            '14:00' => 'closed',
            '14:30' => 'closed',
            '15:00' => 'closed',
            '15:30' => 'closed',
            '16:00' => 'closed',
            '16:30' => 'closed',
            '17:00' => 'closed',
            '17:30' => 'closed'
        ],
        1 => [
            '09:00' => 'opened',
            '09:30' => 'opened',
            '10:00' => 'opened',
            '10:30' => 'opened',
            '11:00' => 'opened',
            '11:30' => 'opened',
            '12:00' => 'closed',
            '12:30' => 'closed',
            '13:00' => 'opened',
            '13:30' => 'opened',
            '14:00' => 'opened',
            '14:30' => 'opened',
            '15:00' => 'opened',
            '15:30' => 'opened',
            '16:00' => 'opened',
            '16:30' => 'opened',
            '17:00' => 'opened',
            '17:30' => 'opened'
        ],
        2 => [
            '09:00' => 'opened',
            '09:30' => 'opened',
            '10:00' => 'opened',
            '10:30' => 'opened',
            '11:00' => 'opened',
            '11:30' => 'opened',
            '12:00' => 'closed',
            '12:30' => 'closed',
            '13:00' => 'opened',
            '13:30' => 'opened',
            '14:00' => 'opened',
            '14:30' => 'opened',
            '15:00' => 'opened',
            '15:30' => 'opened',
            '16:00' => 'opened',
            '16:30' => 'opened',
            '17:00' => 'opened',
            '17:30' => 'opened'
        ],
        3 => [
            '09:00' => 'opened',
            '09:30' => 'opened',
            '10:00' => 'opened',
            '10:30' => 'opened',
            '11:00' => 'opened',
            '11:30' => 'opened',
            '12:00' => 'closed',
            '12:30' => 'closed',
            '13:00' => 'opened',
            '13:30' => 'opened',
            '14:00' => 'opened',
            '14:30' => 'opened',
            '15:00' => 'opened',
            '15:30' => 'opened',
            '16:00' => 'opened',
            '16:30' => 'opened',
            '17:00' => 'opened',
            '17:30' => 'opened'
        ],
        4 => [
            '09:00' => 'opened',
            '09:30' => 'opened',
            '10:00' => 'opened',
            '10:30' => 'opened',
            '11:00' => 'opened',
            '11:30' => 'opened',
            '12:00' => 'closed',
            '12:30' => 'closed',
            '13:00' => 'opened',
            '13:30' => 'opened',
            '14:00' => 'opened',
            '14:30' => 'opened',
            '15:00' => 'opened',
            '15:30' => 'opened',
            '16:00' => 'opened',
            '16:30' => 'opened',
            '17:00' => 'opened',
            '17:30' => 'opened'
        ],
        5 => [
            '09:00' => 'opened',
            '09:30' => 'opened',
            '10:00' => 'opened',
            '10:30' => 'opened',
            '11:00' => 'opened',
            '11:30' => 'opened',
            '12:00' => 'closed',
            '12:30' => 'closed',
            '13:00' => 'opened',
            '13:30' => 'opened',
            '14:00' => 'opened',
            '14:30' => 'opened',
            '15:00' => 'opened',
            '15:30' => 'opened'
        ],
        6 => [
            '09:00' => 'opened',
            '09:30' => 'opened',
            '10:00' => 'opened',
            '10:30' => 'opened',
            '11:00' => 'opened',
            '11:30' => 'opened'
        ]
    ];

    echo serialize($tmp);
    die();
});