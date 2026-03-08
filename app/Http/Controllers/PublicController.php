<?php

namespace App\Http\Controllers;

use App\Actions\StoreOrder;
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

    public function order(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        // Redirect logged-in customers to the customer order page
        if ($user && $user->isCustomer()) {
            return redirect()->route('customer.order');
        }

        $props = [
            'tariff' => StoreOrder::tariff(),
        ];

        return Inertia::render('Public/Order', $props);
    }

    public function storeOrder(Request $request): RedirectResponse
    {
        $validated = $request->validate(StoreOrder::rules());

        (new StoreOrder)->execute($validated, $request->user());

        // TODO: Create actual order record (Issue #19 - Order Schema)
        // For now, redirect with success message
        return redirect()->route('tracking')->with('success', 'Order berhasil dibuat');
    }

    public function tracking(): Response
    {
        return Inertia::render('Public/Tracking');
    }
}
