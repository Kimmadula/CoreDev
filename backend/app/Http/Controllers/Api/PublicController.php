<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use App\Models\Product;

use App\Models\Section;

use App\Models\Article;

class PublicController extends Controller
{
  public function search(\Illuminate\Http\Request $request)
  {
    $query = $request->input('q');
    if (!$query)
      return response()->json([]);

    $results = [];

    // 1. Products
    $products = Product::where('name', 'LIKE', "%{$query}%")->limit(3)->get();
    foreach ($products as $p) {
      $results[] = [
        'type' => 'Product',
        'title' => $p->name,
        'link' => "/product/{$p->slug}",
      ];
    }

    // 2. Sections (Need product slug for link)
    $sections = Section::with('product')->where('title', 'LIKE', "%{$query}%")->limit(5)->get();
    foreach ($sections as $s) {
      if ($s->product) {
        $results[] = [
          'type' => 'Section',
          'title' => $s->title,
          'subtitle' => "in " . $s->product->name,
          'link' => "/product/{$s->product->slug}?section={$s->id}",
        ];
      }
    }

    // 3. SubSections
    $subSections = \App\Models\SubSection::with('section.product')->where('title', 'LIKE', "%{$query}%")->limit(5)->get();
    foreach ($subSections as $sub) {
      if ($sub->section && $sub->section->product) {
        $results[] = [
          'type' => 'Topic',
          'title' => $sub->title,
          'subtitle' => "in " . $sub->section->product->name,
          'link' => "/product/{$sub->section->product->slug}?article=" . ($sub->articles()->first()->id ?? '') // Best effort link
        ];
      }
    }

    // 4. Articles
    $articles = Article::with('subSection.section.product', 'section.product')->where('title', 'LIKE', "%{$query}%")->limit(8)->get();
    foreach ($articles as $a) {
      // Article can belong to subSection OR section (legacy)
      $prodSlug = null;
      if ($a->subSection && $a->subSection->section && $a->subSection->section->product) {
        $prodSlug = $a->subSection->section->product->slug;
      } elseif ($a->section && $a->section->product) {
        $prodSlug = $a->section->product->slug;
      }

      if ($prodSlug) {
        $results[] = [
          'type' => 'Article',
          'title' => $a->title,
          'link' => "/product/{$prodSlug}?article={$a->id}",
        ];
      }
    }

    return response()->json(array_slice($results, 0, 20)); // Limit total results
  }

  public function products()
  {

    return Product::orderBy('name')->get();

  }

  public function product($slug)
  {

    return Product::where('slug', $slug)->firstOrFail();

  }

  public function productSections($slug)
  {

    $product = Product::where('slug', $slug)->firstOrFail();

    return $product->sections()->with(['subSections.articles'])->orderBy('title')->get();

  }

  public function section($slug)
  {
    return Section::with('product')->where('slug', $slug)->firstOrFail();
  }

  public function sectionArticles($slug)
  {

    $section = Section::where('slug', $slug)->firstOrFail();

    return $section->articles()->orderBy('title')->get();

  }

  public function article($slug)
  {

    return Article::with('section.product')->where('slug', $slug)->firstOrFail();

  }

}

