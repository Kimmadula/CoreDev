<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Article extends Model
{
    protected $fillable = ['section_id', 'title', 'slug', 'content'];

    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class);
    }
}
