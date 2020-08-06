<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('login', 'AuthController@login');
Route::get('logout', 'AuthController@logout');
Route::post('register', 'AuthController@register');
Route::post('password/forgot', 'AuthController@passwordForgot');
Route::get('password/reset/{token}', 'AuthController@passwordReset');
Route::post('password/new', 'AuthController@passwordNew');

Route::middleware('auth:sanctum')->group(function() {

    // Brands
    Route::get('brands', 'CarBrandsController@index');
    Route::get('brands/{brand}', 'CarBrandsController@show');

    // Models
    Route::get('models', 'CarModelsController@index');

    // Quotes
    Route::get('quotes', 'QuotesController@index');
    Route::get('quotes/{quote}', 'QuotesController@show');
    Route::post('quotes', 'QuotesController@store');
    Route::patch('quotes/{quote}', 'QuotesController@update');
    Route::patch('quotes/{quote}/meetings', 'QuotesController@meetings');
    Route::delete('quotes/{quote}', 'QuotesController@destroy');
    Route::patch('quotes/{quote}/accept', 'QuotesController@accept');
    Route::patch('quotes/{quote}/refuse', 'QuotesController@refuse');

    // Communications
    Route::get('communications/{quote}', 'CommunicationsController@show');
    Route::post('communications/{quote}', 'CommunicationsController@store');

    // Notifications
    Route::get('notifications', 'NotificationsController@index');
    Route::patch('notifications/{notification}/read', 'NotificationsController@read');
    Route::delete('notifications', 'NotificationsController@delete');

    // Status
    Route::get('status', 'StatusController@index');
    Route::get('status/{status}', 'StatusController@show');

    // Garages
    Route::get('garages', 'GaragesController@index');
    Route::get('garages/{garage}/availabilities', 'GaragesController@availabilities');

    // Strokes
    Route::get('strokes', 'StrokesController@index');

    // Tasks
    Route::get('tasks', 'TasksController@index');
    Route::get('tasks/{task}', 'TasksController@show');
    Route::post('tasks', 'TasksController@store');
    Route::patch('tasks/{task}', 'TasksController@update');
    Route::delete('tasks/{task}', 'TasksController@destroy');
    Route::post('tasks/upload/picture', 'TasksController@uploadPicture');
    Route::post('tasks/delete/picture', 'TasksController@deletePicture');

    Route::middleware('isAdmin')->prefix('admin')->group(function() {
        // Garages
        Route::get('garages/{garage}', 'Admin\GaragesController@show');
        Route::post('garages', 'Admin\GaragesController@store');
        Route::patch('garages/{garage}', 'Admin\GaragesController@update');
        Route::delete('garages/{garage}', 'Admin\GaragesController@destroy');

        // Users
        Route::get('users', 'Admin\UsersController@index');
        Route::get('users/{user}', 'Admin\UsersController@show');
        Route::patch('users/{user}', 'Admin\UsersController@update');
        Route::delete('users/{user}', 'Admin\UsersController@delete');
        Route::get('users/status/{status}/quotes', 'Admin\UsersController@statusQuotes');
    });

});