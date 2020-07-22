<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CarBrand extends Model
{
    protected $table = 'brands';
    
    public function models()
    {
        return $this->hasMany('App\CarModel', 'brand_id');
    }
}
