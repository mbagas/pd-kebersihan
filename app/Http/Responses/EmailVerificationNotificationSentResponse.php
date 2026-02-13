<?php

namespace App\Http\Responses;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\EmailVerificationNotificationSentResponse as EmailVerificationNotificationSentResponseContract;
use Symfony\Component\HttpFoundation\Response;

class EmailVerificationNotificationSentResponse implements EmailVerificationNotificationSentResponseContract
{
    public function toResponse($request): Response
    {
        $user = $request->user();

        // If user is already verified, redirect to role-based dashboard
        if ($user->hasVerifiedEmail()) {
            $home = match ($user->role) {
                User::ROLE_ADMIN => route('admin.dashboard'),
                User::ROLE_DRIVER => route('driver.tugas'),
                User::ROLE_AUDITOR => route('auditor.dashboard'),
                default => route('home'),
            };

            return $request->wantsJson()
                ? new JsonResponse([], 202)
                : redirect($home);
        }

        // Redirect back to verification notice for unverified users
        return $request->wantsJson()
            ? new JsonResponse([], 202)
            : back()->with('status', 'verification-link-sent');
    }
}
