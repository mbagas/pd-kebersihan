<?php

namespace App\Http\Responses;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Symfony\Component\HttpFoundation\Response;

class LoginResponse implements LoginResponseContract
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
            ? new JsonResponse(['two_factor' => false], 200)
            : redirect()->intended($home);
    }
}
