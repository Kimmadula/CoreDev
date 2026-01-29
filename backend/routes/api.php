<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PublicController;
use App\Http\Controllers\Api\Admin\ProductAdminController;
use App\Http\Controllers\Api\Admin\SectionAdminController;
use App\Http\Controllers\Api\Admin\ArticleAdminController;
 
// PUBLIC
Route::get('/products', [PublicController::class, 'products']);
Route::get('/products/{slug}', [PublicController::class, 'product']);
Route::get('/products/{slug}/sections', [PublicController::class, 'productSections']);
Route::get('/sections/{slug}/articles', [PublicController::class, 'sectionArticles']);
Route::get('/articles/{slug}', [PublicController::class, 'article']);
 
// ADMIN (protected)
Route::middleware('admin.key')->prefix('admin')->group(function () {
  Route::get('/products', [ProductAdminController::class, 'index']);
  Route::post('/products', [ProductAdminController::class, 'store']);
  Route::put('/products/{id}', [ProductAdminController::class, 'update']);
  Route::delete('/products/{id}', [ProductAdminController::class, 'destroy']);
  
  Route::get('/sections', [SectionAdminController::class, 'index']);
  Route::post('/sections', [SectionAdminController::class, 'store']);
  Route::put('/sections/{id}', [SectionAdminController::class, 'update']);
  Route::delete('/sections/{id}', [SectionAdminController::class, 'destroy']);
  
  Route::get('/articles', [ArticleAdminController::class, 'index']);
  Route::post('/articles', [ArticleAdminController::class, 'store']);
  Route::put('/articles/{id}', [ArticleAdminController::class, 'update']);
  Route::delete('/articles/{id}', [ArticleAdminController::class, 'destroy']);
});

 
