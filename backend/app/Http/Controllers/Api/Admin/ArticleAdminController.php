<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Article;
use App\Models\Section;

class ArticleAdminController extends Controller
{
    /**
     * Display a listing of all articles.
     */
    public function index()
    {
        return Article::with('section')->orderBy('title')->get();
    }

    /**
     * Store a newly created article in database.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'section_id' => 'required|exists:sections,id',
            'title' => 'required|string|max:255',
            'slug' => 'required|string|unique:articles,slug',
            'content' => 'required|string',
        ]);

        return Article::create($validated);
    }

    /**
     * Update the specified article in database.
     */
    public function update(Request $request, Article $article)
    {
        $validated = $request->validate([
            'section_id' => 'sometimes|required|exists:sections,id',
            'title' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|unique:articles,slug,' . $article->id,
            'content' => 'sometimes|required|string',
        ]);

        $article->update($validated);
        return $article;
    }

    /**
     * Remove the specified article from database.
     */
    public function destroy(Article $article)
    {
        $article->delete();
        return response()->noContent();
    }
}
