<?php

namespace App\Http\Responses;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;
use Symfony\Component\HttpFoundation\Response;

class RegisterResponse implements RegisterResponseContract
{
    public function toResponse($request): Response
    {
        $user = $request->user();

        $home = match ($user->role) {
            User::ROLE_ADMIN => route('admin.dashboard'),
            User::ROLE_DRIVER => route('driver.tugas'),
            User::ROLE_AUDITOR => route('auditor.dashboard'),
            default => route('home'),
        };

        return $request->wantsJson()
            ? new JsonResponse([], 201)
            : redirect()->intended($home);
    }
}
