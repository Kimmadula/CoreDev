<?php 

namespace App\Http\Controllers\Api;
 
use App\Http\Controllers\Controller;

use App\Models\Product;

use App\Models\Section;

use App\Models\Article;
 
class PublicController extends Controller

{

  public function products() {

    return Product::orderBy('name')->get();

  }
 
  public function product($slug) {

    return Product::where('slug', $slug)->firstOrFail();

  }
 
  public function productSections($slug) {

    $product = Product::where('slug', $slug)->firstOrFail();

    return $product->sections()->orderBy('title')->get();

  }
 
  public function sectionArticles($slug) {

    $section = Section::where('slug', $slug)->firstOrFail();

    return $section->articles()->orderBy('title')->get();

  }
 
  public function article($slug) {

    return Article::where('slug', $slug)->firstOrFail();

  }

}

 