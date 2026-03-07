<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicController extends Controller
{
    public function home(): Response
    {
        return Inertia::render('Public/Home');
    }

    public function order(Request $request): Response
    {
        // TODO: Fetch tariff from database (Issue #16)
        $tariff = [
            'household' => 150000,
            'institution' => 200000,
        ];

        $props = [
            'tariff' => $tariff,
        ];

        $user = $request->user();

        if ($user && $user->isCustomer()) {
            $props['addresses'] = $user->customerAddresses()
                ->orderByDesc('is_default')
                ->orderBy('label')
                ->get();

            $props['profile'] = $user->customerProfile;
        }

        // Reorder prefill from session (flashed by CustomerController@reorder)
        if ($request->session()->has('prefill')) {
            $props['prefill'] = $request->session()->get('prefill');
        }

        return Inertia::render('Public/Order', $props);
    }

    public function storeOrder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'customer_type' => ['required', 'in:household,institution'],
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
            'address' => ['required', 'string', 'max:500'],
            'location' => ['required', 'array'],
            'location.lat' => ['required', 'numeric', 'between:-90,90'],
            'location.lng' => ['required', 'numeric', 'between:-180,180'],
            'company_name' => ['nullable', 'string', 'max:255'],
            'npwp' => ['nullable', 'string', 'max:30'],
            'pic_name' => ['nullable', 'string', 'max:255'],
            'business_type' => ['nullable', 'string', 'max:255'],
            'estimated_volume' => ['nullable', 'numeric', 'min:0'],
            'has_grease_trap' => ['nullable', 'boolean'],
            'payment_method' => ['required', 'in:cod,transfer'],
            'notes' => ['nullable', 'string', 'max:500'],
            'save_address' => ['nullable', 'boolean'],
            'address_label' => ['nullable', 'required_if:save_address,true', 'string', 'max:50'],
        ]);

        $user = $request->user();

        // Save new address if requested by logged-in customer
        if ($user && $user->isCustomer() && ($validated['save_address'] ?? false)) {
            $addressCount = $user->customerAddresses()->count();

            if ($addressCount < 5) {
                $user->customerAddresses()->create([
                    'label' => $validated['address_label'],
                    'address' => $validated['address'],
                    'lat' => $validated['location']['lat'],
                    'lng' => $validated['location']['lng'],
                    'is_default' => $addressCount === 0,
                ]);
            }
        }

        // TODO: Create actual order record (Issue #19 - Order Schema)
        // For now, redirect with success message
        return redirect()->route('tracking')->with('success', 'Order berhasil dibuat');
    }

    public function tracking(): Response
    {
        return Inertia::render('Public/Tracking');
    }
}
