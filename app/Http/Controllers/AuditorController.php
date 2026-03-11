<?php

namespace App\Http\Controllers;

use App\Support\MockData;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditorController extends Controller
{
    public function dashboard(): Response
    {
        $orders = MockData::generateOrders(150, 180);
        $currentMonth = now()->format('Y-m');

        // Filter orders bulan ini
        $monthOrders = array_filter($orders, fn ($o) => str_starts_with($o['created_at'], $currentMonth));
        $doneOrders = array_filter($monthOrders, fn ($o) => $o['status'] === 'done');

        // Stats
        $totalOrderBulanIni = count($monthOrders);
        $totalPendapatan = array_sum(array_map(fn ($o) => $o['payment_status'] === 'paid' ? $o['total_amount'] : 0, $monthOrders));
        $totalVolume = array_sum(array_map(fn ($o) => $o['status'] === 'done' ? ($o['volume_actual'] ?? $o['volume_estimate']) : 0, $monthOrders));
        $daysInMonth = now()->daysInMonth;
        $rataRataOrderPerHari = $totalOrderBulanIni > 0 ? round($totalOrderBulanIni / $daysInMonth, 1) : 0;

        // Order Distribution (Pusat vs Mitra)
        $pusatOrders = count(array_filter($doneOrders, fn ($o) => $o['petugas'] && $o['petugas']['mitra_id'] === 1));
        $mitraOrders = count($doneOrders) - $pusatOrders;

        // Monthly Revenue (6 bulan terakhir)
        $monthlyRevenue = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $monthKey = $month->format('Y-m');
            $monthLabel = $month->translatedFormat('M Y');

            $monthData = array_filter($orders, fn ($o) => str_starts_with($o['created_at'], $monthKey) && $o['payment_status'] === 'paid'
            );

            $monthlyRevenue[] = [
                'month' => $monthLabel,
                'pendapatan' => array_sum(array_map(fn ($o) => $o['total_amount'], $monthData)),
            ];
        }

        // Daily Trend (30 hari terakhir)
        $dailyTrend = [];
        for ($i = 29; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $dateKey = $date->format('Y-m-d');

            $dayOrders = array_filter($orders, fn ($o) => str_starts_with($o['created_at'], $dateKey));

            $dailyTrend[] = [
                'date' => $date->format('d M'),
                'orders' => count($dayOrders),
            ];
        }

        return Inertia::render('Audit/Dashboard', [
            'stats' => [
                'total_order_bulan_ini' => $totalOrderBulanIni,
                'total_pendapatan' => $totalPendapatan,
                'total_volume' => $totalVolume,
                'rata_rata_order_per_hari' => $rataRataOrderPerHari,
            ],
            'orderDistribution' => [
                ['name' => 'Order Pusat', 'value' => $pusatOrders, 'color' => '#3b82f6'],
                ['name' => 'Order Mitra', 'value' => $mitraOrders, 'color' => '#10b981'],
            ],
            'monthlyRevenue' => $monthlyRevenue,
            'dailyTrend' => $dailyTrend,
        ]);
    }

    public function peta(Request $request): Response
    {
        $orders = MockData::generateOrders(150, 180);

        // Filter by date range
        $startDate = $request->get('start_date', now()->subDays(30)->format('Y-m-d'));
        $endDate = $request->get('end_date', now()->format('Y-m-d'));

        $filteredOrders = array_filter($orders, function ($o) use ($startDate, $endDate, $request) {
            $orderDate = substr($o['created_at'], 0, 10);
            $inDateRange = $orderDate >= $startDate && $orderDate <= $endDate;

            // Filter by status
            if ($request->has('status') && $request->status !== 'all') {
                if ($o['status'] !== $request->status) {
                    return false;
                }
            }

            // Filter by customer type
            if ($request->has('customer_type') && $request->customer_type !== 'all') {
                if ($o['customer_type'] !== $request->customer_type) {
                    return false;
                }
            }

            return $inDateRange && $o['latitude'] && $o['longitude'];
        });

        // Map orders for frontend (only needed fields)
        $mapOrders = array_map(fn ($o) => [
            'id' => $o['id'],
            'order_number' => $o['order_number'],
            'customer_name' => $o['customer_name'],
            'customer_type' => $o['customer_type'],
            'customer_address' => $o['customer_address'],
            'latitude' => $o['latitude'],
            'longitude' => $o['longitude'],
            'volume_estimate' => $o['volume_estimate'],
            'volume_actual' => $o['volume_actual'],
            'total_amount' => $o['total_amount'],
            'status' => $o['status'],
            'created_at' => $o['created_at'],
        ], array_values($filteredOrders));

        return Inertia::render('Audit/Peta', [
            'orders' => $mapOrders,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'status' => $request->get('status', 'all'),
                'customer_type' => $request->get('customer_type', 'all'),
            ],
        ]);
    }

    public function keuangan(Request $request): Response
    {
        $orders = MockData::generateOrders(150, 180);
        $mitra = MockData::mitra();

        // Filter by date range
        $startDate = $request->get('start_date', now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->get('end_date', now()->format('Y-m-d'));

        $filteredOrders = array_filter($orders, function ($o) use ($startDate, $endDate) {
            $orderDate = substr($o['created_at'], 0, 10);

            return $orderDate >= $startDate && $orderDate <= $endDate && $o['status'] === 'done';
        });
        $filteredOrders = array_values($filteredOrders);

        // Summary
        $summary = [
            'total_pendapatan' => array_sum(array_map(fn ($o) => $o['total_amount'], $filteredOrders)),
            'total_orders' => count($filteredOrders),
            'total_volume' => array_sum(array_map(fn ($o) => $o['volume_actual'] ?? $o['volume_estimate'], $filteredOrders)),
        ];

        // Breakdown per Mitra
        $mitraBreakdown = [];
        foreach ($mitra as $m) {
            $mitraOrders = array_filter($filteredOrders, fn ($o) => $o['petugas'] && $o['petugas']['mitra_id'] === $m['id']);
            $mitraBreakdown[] = [
                'mitra_id' => $m['id'],
                'mitra_nama' => $m['nama'],
                'total_orders' => count($mitraOrders),
                'total_pendapatan' => array_sum(array_map(fn ($o) => $o['total_amount'], $mitraOrders)),
                'total_volume' => array_sum(array_map(fn ($o) => $o['volume_actual'] ?? $o['volume_estimate'], $mitraOrders)),
            ];
        }

        // Breakdown per Customer Type
        $customerTypeBreakdown = [
            [
                'customer_type' => 'household',
                'label' => 'Rumah Tangga',
                'total_orders' => count(array_filter($filteredOrders, fn ($o) => $o['customer_type'] === 'household')),
                'total_pendapatan' => array_sum(array_map(fn ($o) => $o['customer_type'] === 'household' ? $o['total_amount'] : 0, $filteredOrders)),
            ],
            [
                'customer_type' => 'institution',
                'label' => 'Instansi',
                'total_orders' => count(array_filter($filteredOrders, fn ($o) => $o['customer_type'] === 'institution')),
                'total_pendapatan' => array_sum(array_map(fn ($o) => $o['customer_type'] === 'institution' ? $o['total_amount'] : 0, $filteredOrders)),
            ],
        ];

        // Breakdown per Payment Method
        $paymentMethodBreakdown = [
            [
                'payment_method' => 'cash',
                'label' => 'Tunai',
                'total_orders' => count(array_filter($filteredOrders, fn ($o) => $o['payment_method'] === 'cash')),
                'total_pendapatan' => array_sum(array_map(fn ($o) => $o['payment_method'] === 'cash' ? $o['total_amount'] : 0, $filteredOrders)),
            ],
            [
                'payment_method' => 'transfer',
                'label' => 'Transfer',
                'total_orders' => count(array_filter($filteredOrders, fn ($o) => $o['payment_method'] === 'transfer')),
                'total_pendapatan' => array_sum(array_map(fn ($o) => $o['payment_method'] === 'transfer' ? $o['total_amount'] : 0, $filteredOrders)),
            ],
        ];

        return Inertia::render('Audit/Keuangan', [
            'summary' => $summary,
            'mitraBreakdown' => $mitraBreakdown,
            'customerTypeBreakdown' => $customerTypeBreakdown,
            'paymentMethodBreakdown' => $paymentMethodBreakdown,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }

    public function trail(Request $request): Response
    {
        $orders = MockData::generateOrders(150, 180);

        // Filter by date range
        $startDate = $request->get('start_date', now()->subDays(30)->format('Y-m-d'));
        $endDate = $request->get('end_date', now()->format('Y-m-d'));

        $filteredOrders = array_filter($orders, function ($o) use ($startDate, $endDate, $request) {
            $orderDate = substr($o['created_at'], 0, 10);
            $inDateRange = $orderDate >= $startDate && $orderDate <= $endDate;

            // Filter by status
            if ($request->has('status') && $request->status !== 'all') {
                if ($o['status'] !== $request->status) {
                    return false;
                }
            }

            // Filter by customer type
            if ($request->has('customer_type') && $request->customer_type !== 'all') {
                if ($o['customer_type'] !== $request->customer_type) {
                    return false;
                }
            }

            // Search
            if ($request->has('search') && $request->search) {
                $search = strtolower($request->search);
                $matchesSearch = str_contains(strtolower($o['order_number']), $search) ||
                    str_contains(strtolower($o['customer_name']), $search) ||
                    str_contains(strtolower($o['customer_address']), $search);
                if (! $matchesSearch) {
                    return false;
                }
            }

            return $inDateRange;
        });

        $filteredOrders = array_values($filteredOrders);

        // Pagination
        $page = $request->get('page', 1);
        $perPage = 15;
        $total = count($filteredOrders);
        $offset = ($page - 1) * $perPage;
        $paginatedOrders = array_slice($filteredOrders, $offset, $perPage);

        return Inertia::render('Audit/Trail', [
            'orders' => [
                'data' => $paginatedOrders,
                'meta' => [
                    'current_page' => (int) $page,
                    'last_page' => (int) ceil($total / $perPage),
                    'per_page' => $perPage,
                    'total' => $total,
                ],
            ],
            'filters' => [
                'search' => $request->get('search', ''),
                'status' => $request->get('status', 'all'),
                'customer_type' => $request->get('customer_type', 'all'),
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }
}
