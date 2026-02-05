<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SubSection extends Model
{
    protected $fillable = ['section_id', 'title', 'slug', 'sort_order'];

    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class);
    }

    public function articles(): HasMany
    {
        return $this->hasMany(Article::class);
    }
}
