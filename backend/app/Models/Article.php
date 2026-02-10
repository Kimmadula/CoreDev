<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Article extends Model
{
    protected $fillable = ['section_id', 'sub_section_id', 'title', 'slug', 'content', 'sort_order'];

    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class);
    }

    public function subSection(): BelongsTo
    {
        return $this->belongsTo(SubSection::class);
    }
}
