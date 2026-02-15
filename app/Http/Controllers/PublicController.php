<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicController extends Controller
{
    public function home(): Response
    {
        return Inertia::render('Public/Home');
    }

    public function order(): Response
    {
        // TODO: Fetch tariff from database (Issue #16)
        $tariff = [
            'household' => 150000,
            'institution' => 200000,
        ];

        return Inertia::render('Public/Order', [
            'tariff' => $tariff,
        ]);
    }

    public function storeOrder(Request $request)
    {
        // TODO: Implement order creation logic
        return redirect()->route('tracking')->with('success', 'Order berhasil dibuat');
    }

    public function tracking(): Response
    {
        return Inertia::render('Public/Tracking');
    }
}
