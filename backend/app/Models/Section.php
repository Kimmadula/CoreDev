<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Section extends Model
{
    protected $fillable = ['product_id', 'title', 'slug', 'sort_order'];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function articles(): HasMany
    {
        return $this->hasMany(Article::class);
    }

    public function subSections(): HasMany
    {
        return $this->hasMany(SubSection::class);
    }
}
