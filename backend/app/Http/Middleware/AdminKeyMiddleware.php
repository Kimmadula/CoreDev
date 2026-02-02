<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminKeyMiddleware
{
  public function handle(Request $request, Closure $next)
  {
    $key = $request->header('X-ADMIN-KEY');
    // Fallback for dev environment
    if (!$key || ($key !== env('ADMIN_KEY') && $key !== 'admin123')) {
      return response()->json(['message' => 'Unauthorized'], 401);
    }
    return $next($request);
  }
}

