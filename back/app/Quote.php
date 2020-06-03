<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Quote extends Model
{
    protected $guarded = [];

    public function tasks()
    {
        return $this->hasMany('App\Task');
    }

    public function user()
    {
        return $this->belongsTo('App\User');
    }
}
