<?php

namespace App\Http\Responses;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\VerifyEmailResponse as VerifyEmailResponseContract;
use Symfony\Component\HttpFoundation\Response;

class VerifyEmailResponse implements VerifyEmailResponseContract
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
            ? new JsonResponse([], 204)
            : redirect()->intended($home.'?verified=1');
    }
}
