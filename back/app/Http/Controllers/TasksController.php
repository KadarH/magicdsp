<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Task;
use Illuminate\Support\Facades\Storage;

class TasksController extends Controller
{
    protected function validateRequest()
    {
        return request()->validate([
            'description' => 'nullable',
            'picture' => 'nullable',
            'quote_id' => 'required'
        ]);
    }

    public function index()
    {
        $tasks = Task::get();

        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ['tasks' => $tasks]
        ],200);
    }

    public function show(Task $task)
    {
        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ['task' => $task]
        ],200);
    }

    public function store()
    {
        $data = $this->validateRequest();

        $task = Task::create($data);
        $task = Task::where('id', $task->id)->first();
        
        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ['task' => $task]
        ],200);
    }

    public function update(Task $task)
    {
        $data = $this->validateRequest();

        $task->update($data);
        $task = Task::where('id', $task->id)->first();
        
        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ['task' => $task]
        ], 200); 
    }

    public function destroy(Task $task)
    {
        Storage::disk('public')->delete('tasks/'.$task->picture);
        $task->delete();
  
        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ''
        ], 200);
    }

    public function uploadPicture(Request $request)
    {
        $file = $request->file;
        $fileNewName = time().'_'.$file->getClientOriginalName();

        Storage::disk('public')->putFileAs('tasks', $file, $fileNewName);

        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ['file' => $fileNewName]
        ], 200);
    }

    public function deletePicture(Request $request)
    {
        Storage::disk('public')->delete('tasks/'.$request->file);

        return response()->json([
            'success' => true,
            'message' => '',
            'data' => ''
        ], 200);
    }
}
