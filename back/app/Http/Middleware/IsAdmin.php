<?php

namespace App\Http\Middleware;

use Closure;
use Auth;

class IsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $user = Auth::user();

        if ( $user->admin ) {
            return $next($request);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'This user is not admin',
                'data' => '',
            ],200);
        }

    }
}
