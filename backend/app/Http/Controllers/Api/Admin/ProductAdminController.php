<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;

class ProductAdminController extends Controller
{
    /**
     * Display a listing of all products.
     */
    public function index()
    {
        return Product::orderBy('name')->get();
    }

    /**
     * Store a newly created product in database.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:products,slug',
            'description' => 'nullable|string',
        ]);

        return Product::create($validated);
    }

    /**
     * Update the specified product in database.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|unique:products,slug,' . $product->id,
            'description' => 'nullable|string',
        ]);

        $product->update($validated);
        return $product;
    }

    /**
     * Remove the specified product from database.
     */
    public function destroy(Product $product)
    {
        $product->delete();
        return response()->noContent();
    }
}
