<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;


class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles)
    {

        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!in_array($user->role, $roles)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Forbidden. You do not have the right role.',
                ], 403);
            }
            return $next($request);

        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Please login first.',
            ], 401);
        }
    }
}
