<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PublicController;
use App\Http\Controllers\Api\Admin\ProductAdminController;
use App\Http\Controllers\Api\Admin\SectionAdminController;
use App\Http\Controllers\Api\Admin\ArticleAdminController;
use App\Http\Controllers\Api\Admin\SubSectionAdminController;

// PUBLIC
Route::get('/products', [PublicController::class, 'products']);
Route::get('/products/{slug}', [PublicController::class, 'product']);
Route::get('/products/{slug}/sections', [PublicController::class, 'productSections']);
Route::get('/sections/{slug}', [PublicController::class, 'section']);
Route::get('/sections/{slug}/articles', [PublicController::class, 'sectionArticles']);
Route::get('/articles/{slug}', [PublicController::class, 'article']);
Route::get('/search', [PublicController::class, 'search']);

// ADMIN (protected)
Route::middleware('admin.key')->prefix('admin')->group(function () {
  Route::get('/products', [ProductAdminController::class, 'index']);
  Route::post('/products', [ProductAdminController::class, 'store']);
  Route::put('/products/{product}', [ProductAdminController::class, 'update']);
  Route::delete('/products/{product}', [ProductAdminController::class, 'destroy']);

  Route::get('/sections', [SectionAdminController::class, 'index']);
  Route::post('/sections', [SectionAdminController::class, 'store']);
  Route::put('/sections/{section}', [SectionAdminController::class, 'update']);
  Route::delete('/sections/{section}', [SectionAdminController::class, 'destroy']);

  Route::get('/articles', [ArticleAdminController::class, 'index']);
  Route::post('/articles', [ArticleAdminController::class, 'store']);
  Route::put('/articles/{article}', [ArticleAdminController::class, 'update']);
  Route::delete('/articles/{article}', [ArticleAdminController::class, 'destroy']);

  Route::get('/sub-sections', [SubSectionAdminController::class, 'index']);
  Route::post('/sub-sections', [SubSectionAdminController::class, 'store']);
  Route::put('/sub-sections/{subSection}', [SubSectionAdminController::class, 'update']);
  Route::delete('/sub-sections/{subSection}', [SubSectionAdminController::class, 'destroy']);
});


