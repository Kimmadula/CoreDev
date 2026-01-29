<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Section;
use App\Models\Product;

class SectionAdminController extends Controller
{
    /**
     * Display a listing of all sections.
     */
    public function index()
    {
        return Section::with('product')->orderBy('title')->get();
    }

    /**
     * Store a newly created section in database.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'title' => 'required|string|max:255',
            'slug' => 'required|string',
        ]);

        // Check unique constraint (slug unique per product)
        $exists = Section::where('product_id', $validated['product_id'])
            ->where('slug', $validated['slug'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Slug already exists for this product'
            ], 422);
        }

        return Section::create($validated);
    }

    /**
     * Update the specified section in database.
     */
    public function update(Request $request, Section $section)
    {
        $validated = $request->validate([
            'product_id' => 'sometimes|required|exists:products,id',
            'title' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string',
        ]);

        // Check unique constraint if slug is being updated
        if (isset($validated['slug']) && $validated['slug'] !== $section->slug) {
            $product_id = $validated['product_id'] ?? $section->product_id;
            $exists = Section::where('product_id', $product_id)
                ->where('slug', $validated['slug'])
                ->where('id', '!=', $section->id)
                ->exists();

            if ($exists) {
                return response()->json([
                    'message' => 'Slug already exists for this product'
                ], 422);
            }
        }

        $section->update($validated);
        return $section;
    }

    /**
     * Remove the specified section from database.
     */
    public function destroy(Section $section)
    {
        $section->delete();
        return response()->noContent();
    }
}
