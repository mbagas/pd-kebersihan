<?php

namespace App\Http\Responses;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Laravel\Fortify\Contracts\EmailVerificationPromptResponse as EmailVerificationPromptResponseContract;
use Symfony\Component\HttpFoundation\Response;

class EmailVerificationPromptResponse implements EmailVerificationPromptResponseContract
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
                ? new JsonResponse([], 204)
                : redirect($home);
        }

        // Show verification notice page for unverified users
        return $request->wantsJson()
            ? new JsonResponse([], 204)
            : Inertia::render('auth/verify-email', [
                'status' => $request->session()->get('status'),
            ])->toResponse($request);
    }
}
