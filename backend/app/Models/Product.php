<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $fillable = ['name', 'slug', 'description'];

    public function sections(): HasMany
    {
        return $this->hasMany(Section::class);
    }
}
