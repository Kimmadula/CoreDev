<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SubSection;
use App\Models\Section;

class SubSectionAdminController extends Controller
{
    /**
     * Display a listing of all sub sections.
     */
    public function index()
    {
        // Eager load section and potential product for context
        return SubSection::with('section.product')->orderBy('title')->get();
    }

    /**
     * Store a newly created sub section in database.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'section_id' => 'required|exists:sections,id',
            'title' => 'required|string|max:255',
            'slug' => 'required|string',
            'sort_order' => 'nullable|integer',
        ]);

        // Check unique constraint (slug unique per section)
        $exists = SubSection::where('section_id', $validated['section_id'])
            ->where('slug', $validated['slug'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Slug already exists for this section'
            ], 422);
        }

        return SubSection::create($validated);
    }

    /**
     * Update the specified sub section in database.
     */
    public function update(Request $request, SubSection $subSection)
    {
        $validated = $request->validate([
            'section_id' => 'sometimes|required|exists:sections,id',
            'title' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string',
            'sort_order' => 'nullable|integer',
        ]);

        // Check unique constraint if slug is being updated
        if (isset($validated['slug']) && $validated['slug'] !== $subSection->slug) {
            $section_id = $validated['section_id'] ?? $subSection->section_id;
            $exists = SubSection::where('section_id', $section_id)
                ->where('slug', $validated['slug'])
                ->where('id', '!=', $subSection->id)
                ->exists();

            if ($exists) {
                return response()->json([
                    'message' => 'Slug already exists for this section'
                ], 422);
            }
        }

        $subSection->update($validated);
        return $subSection;
    }

    /**
     * Remove the specified sub section from database.
     */
    public function destroy(SubSection $subSection)
    {
        $subSection->delete();
        return response()->noContent();
    }
}
