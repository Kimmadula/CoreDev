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
            'sub_section_id' => 'required|exists:sub_sections,id',
            'section_id' => 'nullable|exists:sections,id',
            'title' => 'required|string|max:255',
            'slug' => 'required|string|unique:articles,slug',
            'content' => 'required|string',
            'sort_order' => 'integer|min:0',
        ]);

        return Article::create($validated);
    }

    /**
     * Update the specified article in database.
     */
    public function update(Request $request, Article $article)
    {
        try {
            $validated = $request->validate([
                'sub_section_id' => 'sometimes|required|exists:sub_sections,id',
                'section_id' => 'nullable|exists:sections,id',
                'title' => 'sometimes|required|string|max:255',
                'slug' => 'sometimes|required|string|unique:articles,slug,' . $article->id,
                'content' => 'sometimes|required|string',
                'sort_order' => 'sometimes|integer|min:0',
            ]);

            $article->update($validated);
            return $article;
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Article Update Error: ' . $e->getMessage());
            return response()->json(['message' => $e->getMessage()], 500);
        }
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
