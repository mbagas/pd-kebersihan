<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    /**
     * Mock customer orders - shared across methods for consistency.
     * Uses same data structure as DriverController mock data.
     */
    private function getMockOrders(): array
    {
        return [
            [
                'id' => 1,
                'ticket_number' => 'TKT-2026-0001',
                'status' => 'done',
                'payment_method' => 'cod',
                'payment_status' => 'paid',
                'customer_name' => 'Budi Santoso',
                'customer_type' => 'household',
                'customer_address' => 'Jl. Raden Intan No. 45, Tanjung Karang, Bandar Lampung',
                'customer_phone' => '081234567890',
                'volume_estimate' => 4,
                'volume_actual' => 3.5,
                'total_price' => 350000,
                'notes' => 'Rumah warna biru, pagar hitam',
                'scheduled_at' => '2026-02-17 09:00:00',
                'assigned_at' => '2026-02-17 09:30:00',
                'started_at' => '2026-02-17 10:00:00',
                'completed_at' => '2026-02-17 12:00:00',
                'created_at' => '2026-02-16 14:00:00',
                'officer' => [
                    'name' => 'Ahmad Supardi',
                    'phone' => '081298765432',
                ],
                'evidence' => [
                    'before' => ['/storage/evidence/before-1.jpg'],
                    'after' => ['/storage/evidence/after-1.jpg'],
                ],
            ],
            [
                'id' => 2,
                'ticket_number' => 'TKT-2026-0002',
                'status' => 'processing',
                'payment_method' => 'transfer',
                'payment_status' => 'paid',
                'customer_name' => 'Budi Santoso',
                'customer_type' => 'household',
                'customer_address' => 'Jl. Raden Intan No. 45, Tanjung Karang, Bandar Lampung',
                'customer_phone' => '081234567890',
                'volume_estimate' => 5,
                'total_price' => 500000,
                'scheduled_at' => '2026-03-05 10:00:00',
                'assigned_at' => '2026-03-05 10:15:00',
                'started_at' => '2026-03-05 11:00:00',
                'created_at' => '2026-03-04 16:00:00',
                'officer' => [
                    'name' => 'Dedi Kurniawan',
                    'phone' => '082345678901',
                ],
            ],
            [
                'id' => 3,
                'ticket_number' => 'TKT-2026-0003',
                'status' => 'assigned',
                'payment_method' => 'cod',
                'payment_status' => 'unpaid',
                'customer_name' => 'Budi Santoso',
                'customer_type' => 'household',
                'customer_address' => 'Jl. Raden Intan No. 45, Tanjung Karang, Bandar Lampung',
                'customer_phone' => '081234567890',
                'volume_estimate' => 3,
                'total_price' => 300000,
                'notes' => 'Hubungi dulu sebelum datang',
                'scheduled_at' => '2026-03-08 09:00:00',
                'assigned_at' => '2026-03-07 14:00:00',
                'created_at' => '2026-03-06 10:00:00',
                'officer' => [
                    'name' => 'Ahmad Supardi',
                    'phone' => '081298765432',
                ],
            ],
            [
                'id' => 4,
                'ticket_number' => 'TKT-2026-0004',
                'status' => 'pending',
                'payment_method' => 'transfer',
                'payment_status' => 'unpaid',
                'customer_name' => 'Budi Santoso',
                'customer_type' => 'household',
                'customer_address' => 'Jl. Diponegoro No. 12, Kedaton, Bandar Lampung',
                'customer_phone' => '081234567890',
                'volume_estimate' => 4,
                'total_price' => 400000,
                'created_at' => '2026-03-07 08:00:00',
            ],
            [
                'id' => 5,
                'ticket_number' => 'TKT-2026-0005',
                'status' => 'done',
                'payment_method' => 'cod',
                'payment_status' => 'paid',
                'customer_name' => 'Budi Santoso',
                'customer_type' => 'household',
                'customer_address' => 'Jl. Raden Intan No. 45, Tanjung Karang, Bandar Lampung',
                'customer_phone' => '081234567890',
                'volume_estimate' => 6,
                'volume_actual' => 5.5,
                'total_price' => 550000,
                'scheduled_at' => '2026-01-20 09:00:00',
                'completed_at' => '2026-01-20 12:00:00',
                'created_at' => '2026-01-19 11:00:00',
                'officer' => [
                    'name' => 'Dedi Kurniawan',
                    'phone' => '082345678901',
                ],
                'evidence' => [
                    'before' => ['/storage/evidence/before-5.jpg'],
                    'after' => ['/storage/evidence/after-5.jpg'],
                ],
            ],
        ];
    }

    /**
     * Mock customer addresses
     */
    private function getMockAddresses(): array
    {
        return [
            [
                'id' => 1,
                'user_id' => 1,
                'label' => 'Rumah',
                'address' => 'Jl. Raden Intan No. 45, Tanjung Karang, Bandar Lampung',
                'lat' => -5.4295,
                'lng' => 105.2619,
                'is_default' => true,
                'notes' => 'Rumah warna biru, pagar hitam',
                'created_at' => '2026-01-10 08:00:00',
                'updated_at' => '2026-01-10 08:00:00',
            ],
            [
                'id' => 2,
                'user_id' => 1,
                'label' => 'Kantor',
                'address' => 'Jl. Diponegoro No. 12, Kedaton, Bandar Lampung',
                'lat' => -5.3891,
                'lng' => 105.2456,
                'is_default' => false,
                'notes' => 'Gedung lantai 2, masuk dari samping',
                'created_at' => '2026-02-05 10:00:00',
                'updated_at' => '2026-02-05 10:00:00',
            ],
        ];
    }

    /**
     * Customer Dashboard - /customer
     */
    public function dashboard(): Response
    {
        $orders = $this->getMockOrders();

        $activeStatuses = ['pending', 'assigned', 'on_the_way', 'arrived', 'processing'];
        $activeOrders = array_filter($orders, fn($o) => in_array($o['status'], $activeStatuses));
        $completedOrders = array_filter($orders, fn($o) => $o['status'] === 'done');
        $pendingPayments = array_filter($orders, fn($o) => $o['payment_status'] === 'unpaid');

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
            'orders' => $this->getMockOrders(),
        ]);
    }

    /**
     * Order detail - /customer/orders/{order}
     */
    public function orderDetail(string $order): Response
    {
        $orders = $this->getMockOrders();
        $found = collect($orders)->firstWhere('id', (int) $order);

        if (!$found) {
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
        return Inertia::render('Customer/Addresses', [
            'addresses' => $this->getMockAddresses(),
        ]);
    }

    /**
     * Store address (stub)
     */
    public function storeAddress(Request $request)
    {
        return back()->with('success', 'Alamat berhasil ditambahkan');
    }

    /**
     * Update address (stub)
     */
    public function updateAddress(Request $request, string $address)
    {
        return back()->with('success', 'Alamat berhasil diperbarui');
    }

    /**
     * Delete address (stub)
     */
    public function destroyAddress(string $address)
    {
        return back()->with('success', 'Alamat berhasil dihapus');
    }

    /**
     * Profile page - /customer/profile
     */
    public function profile(): Response
    {
        // Mock profile data
        $profile = [
            'id' => 1,
            'user_id' => 1,
            'customer_type' => 'household',
            'company_name' => null,
            'npwp' => null,
            'pic_name' => null,
            'business_type' => null,
            'created_at' => '2026-01-10 08:00:00',
            'updated_at' => '2026-01-10 08:00:00',
        ];

        return Inertia::render('Customer/Profile', [
            'profile' => $profile,
        ]);
    }

    /**
     * Update profile (stub)
     */
    public function updateProfile(Request $request)
    {
        return back()->with('success', 'Profil berhasil diperbarui');
    }

    /**
     * Reorder (stub)
     */
    public function reorder(string $order)
    {
        return redirect()->route('order')->with('success', 'Data pesanan sebelumnya telah dimuat');
    }

    /**
     * Upload payment proof (stub)
     */
    public function uploadPaymentProof(Request $request, string $order)
    {
        return back()->with('success', 'Bukti pembayaran berhasil diunggah');
    }
}
