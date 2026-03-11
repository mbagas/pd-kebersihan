<?php

namespace App\Http\Controllers;

use App\Actions\StoreOrder;
use App\Models\CustomerAddress;
use App\Models\CustomerProfile;
use App\Support\MockData;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    /**
     * Customer Dashboard - /customer
     */
    public function dashboard(): Response
    {
        $orders = MockData::customerOrders();
        $activeStatuses = MockData::activeStatuses();

        $activeOrders = array_filter($orders, fn ($o) => in_array($o['status'], $activeStatuses));
        $completedOrders = array_filter($orders, fn ($o) => $o['status'] === 'done');
        $pendingPayments = array_filter($orders, fn ($o) => $o['payment_status'] === 'unpaid');

        $stats = [
            'total_orders' => count($orders),
            'active_orders' => count($activeOrders),
            'completed_orders' => count($completedOrders),
            'pending_payments' => count($pendingPayments),
        ];

        // Recent orders (last 5)
        $recentOrders = array_slice($orders, 0, 5);

        return Inertia::render('Customer/Dashboard', [
            'stats' => $stats,
            'activeOrders' => array_values($activeOrders),
            'recentOrders' => $recentOrders,
        ]);
    }

    /**
     * Orders list - /customer/orders
     */
    public function orders(): Response
    {
        return Inertia::render('Customer/Orders', [
            'orders' => MockData::customerOrders(),
        ]);
    }

    /**
     * Order detail - /customer/orders/{order}
     */
    public function orderDetail(string $order): Response
    {
        $orders = MockData::customerOrders();
        $found = collect($orders)->firstWhere('id', (int) $order);

        if (! $found) {
            abort(404);
        }

        return Inertia::render('Customer/Orders/Show', [
            'order' => $found,
        ]);
    }

    /**
     * Addresses list - /customer/addresses
     */
    public function addresses(): Response
    {
        $addresses = auth()->user()->customerAddresses()
            ->orderByDesc('is_default')
            ->orderBy('label')
            ->get();

        return Inertia::render('Customer/Addresses', [
            'addresses' => $addresses,
        ]);
    }

    /**
     * Create address form - /customer/addresses/create
     */
    public function createAddress(): Response|RedirectResponse
    {
        $count = auth()->user()->customerAddresses()->count();

        if ($count >= 5) {
            return redirect()->route('customer.addresses')
                ->with('error', 'Maksimum 5 alamat. Hapus alamat lama untuk menambahkan yang baru.');
        }

        return Inertia::render('Customer/Addresses/Form', [
            'address' => null,
        ]);
    }

    /**
     * Store address
     */
    public function storeAddress(Request $request): RedirectResponse
    {
        $user = auth()->user();

        if ($user->customerAddresses()->count() >= 5) {
            return back()->withErrors(['limit' => 'Maksimum 5 alamat tercapai.']);
        }

        $validated = $request->validate([
            'label' => ['required', 'string', 'max:50'],
            'address' => ['required', 'string', 'max:500'],
            'lat' => ['required', 'numeric', 'between:-90,90'],
            'lng' => ['required', 'numeric', 'between:-180,180'],
            'notes' => ['nullable', 'string', 'max:255'],
            'is_default' => ['boolean'],
        ]);

        $address = $user->customerAddresses()->create($validated);

        // Auto-set as default if first address or requested
        if ($user->customerAddresses()->count() === 1 || ($validated['is_default'] ?? false)) {
            $address->setAsDefault();
        }

        return redirect()->route('customer.addresses')
            ->with('success', 'Alamat berhasil ditambahkan');
    }

    /**
     * Edit address form - /customer/addresses/{address}/edit
     */
    public function editAddress(CustomerAddress $address): Response
    {
        if ($address->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('Customer/Addresses/Form', [
            'address' => $address,
        ]);
    }

    /**
     * Update address
     */
    public function updateAddress(Request $request, CustomerAddress $address): RedirectResponse
    {
        if ($address->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'label' => ['required', 'string', 'max:50'],
            'address' => ['required', 'string', 'max:500'],
            'lat' => ['required', 'numeric', 'between:-90,90'],
            'lng' => ['required', 'numeric', 'between:-180,180'],
            'notes' => ['nullable', 'string', 'max:255'],
            'is_default' => ['boolean'],
        ]);

        $address->update($validated);

        if ($validated['is_default'] ?? false) {
            $address->setAsDefault();
        }

        return redirect()->route('customer.addresses')
            ->with('success', 'Alamat berhasil diperbarui');
    }

    /**
     * Delete address
     */
    public function destroyAddress(CustomerAddress $address): RedirectResponse
    {
        if ($address->user_id !== auth()->id()) {
            abort(403);
        }

        $wasDefault = $address->is_default;
        $address->delete();

        // If deleted address was default, set the first remaining as default
        if ($wasDefault) {
            $firstAddress = auth()->user()->customerAddresses()->first();
            $firstAddress?->setAsDefault();
        }

        return redirect()->route('customer.addresses')
            ->with('success', 'Alamat berhasil dihapus');
    }

    /**
     * Set address as default
     */
    public function setDefaultAddress(CustomerAddress $address): RedirectResponse
    {
        if ($address->user_id !== auth()->id()) {
            abort(403);
        }

        $address->setAsDefault();

        return back()->with('success', 'Alamat default berhasil diubah');
    }

    /**
     * Profile page - /customer/profile
     */
    public function profile(): Response
    {
        $user = auth()->user();
        $profile = $user->customerProfile ?? new CustomerProfile([
            'customer_type' => 'household',
        ]);

        return Inertia::render('Customer/Profile', [
            'profile' => $profile,
        ]);
    }

    /**
     * Update profile
     */
    public function updateProfile(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'customer_type' => ['required', Rule::in(['household', 'institution'])],
            'company_name' => ['nullable', 'string', 'max:255'],
            'npwp' => ['nullable', 'string', 'max:30'],
            'pic_name' => ['nullable', 'string', 'max:255'],
            'business_type' => ['nullable', 'string', 'max:255'],
        ]);

        $user = auth()->user();

        $user->update([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
        ]);

        $user->customerProfile()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'customer_type' => $validated['customer_type'],
                'company_name' => $validated['company_name'],
                'npwp' => $validated['npwp'],
                'pic_name' => $validated['pic_name'],
                'business_type' => $validated['business_type'],
            ],
        );

        return back()->with('success', 'Profil berhasil diperbarui');
    }

    /**
     * Order form - /customer/order
     */
    public function order(Request $request): Response
    {
        $user = $request->user();

        $props = [
            'tariff' => StoreOrder::tariff(),
            'addresses' => $user->customerAddresses()
                ->orderByDesc('is_default')
                ->orderBy('label')
                ->get(),
            'profile' => $user->customerProfile,
        ];

        // Reorder prefill from session (flashed by reorder method)
        if ($request->session()->has('prefill')) {
            $props['prefill'] = $request->session()->get('prefill');
        }

        return Inertia::render('Customer/Order', $props);
    }

    /**
     * Store order - POST /customer/order
     */
    public function storeOrder(Request $request): RedirectResponse
    {
        $validated = $request->validate(StoreOrder::rules());

        (new StoreOrder)->execute($validated, $request->user());

        // TODO: Create actual order record (Issue #19 - Order Schema)
        // For now, redirect to orders list with success message
        return redirect()->route('customer.orders')
            ->with('success', 'Order berhasil dibuat');
    }

    /**
     * Reorder - load previous order data and redirect to order form
     */
    public function reorder(string $order): RedirectResponse
    {
        $orders = MockData::customerOrders();
        $found = collect($orders)->firstWhere('id', (int) $order);

        if (! $found) {
            abort(404);
        }

        $prefill = [
            'customer_type' => $found['customer_type'] ?? 'household',
            'name' => $found['customer_name'] ?? '',
            'phone' => $found['customer_phone'] ?? '',
            'address' => $found['customer_address'] ?? '',
            'estimated_volume' => $found['volume_estimate'] ?? 0,
            'payment_method' => $found['payment_method'] ?? 'cash',
            'notes' => $found['notes'] ?? '',
        ];

        return redirect()->route('customer.order')->with('prefill', $prefill);
    }

    /**
     * Upload payment proof (stub)
     */
    public function uploadPaymentProof(Request $request, string $order)
    {
        return back()->with('success', 'Bukti pembayaran berhasil diunggah');
    }
}
