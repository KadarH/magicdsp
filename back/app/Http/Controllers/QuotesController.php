<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;
use App\Quote;
use App\Task;
use Auth;

class QuotesController extends Controller
{
    protected function validateRequest()
    {
        return request()->validate([
            'brand' => 'nullable',
            'model' => 'nullable',
            'doors' => 'nullable'
        ]);
    }

    public function index(Request $request)
    {
        if ( $request->type ) {
            $quotes = Quote::where($request->type, true)->orderBy('created_at', 'DESC')->get();
        } else {
            $quotes = Quote::get();
        }

        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ['quotes' => $quotes],
        ],200);
    }

    public function show(Quote $quote)
    {
        $tasks = Task::where('quote_id', $quote->id)->get();

        if ( !empty($tasks) ) {
            foreach ( $tasks as $key => $task ) {
                $tasks[$key]['picture'] = asset('storage/tasks/' . $task->picture);
            }
        }

        $quote['tasks'] = $tasks;

        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ['quote' => $quote],
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
                $newTask->quote_id = $quote->id;
                $newTask->save();
            }

        }

        $quote = Quote::where('id', $quote->id)->first();

        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ['quote' => $quote],
        ],200);
    }

    public function update(Quote $quote)
    {
        $data = $this->validateRequest();
        
        $quote->update($data);
        $quote = Quote::where('id', $quote->id)->first();

        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ['quote' => $quote],
        ], 200); 
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
