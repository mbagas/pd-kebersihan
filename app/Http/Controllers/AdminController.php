<?php

namespace App\Http\Controllers;

use App\Support\MockData;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    private function getWeeklyChartData(): array
    {
        $days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
        $data = [];

        foreach ($days as $day) {
            $orders = rand(2, 8);
            $data[] = [
                'day' => $day,
                'orders' => $orders,
                'revenue' => $orders * rand(150000, 400000),
            ];
        }

        return $data;
    }

    public function dashboard(): Response
    {
        $orders = MockData::generateOrders(25);
        $today = now()->format('Y-m-d');

        $todayOrders = array_filter($orders, fn ($o) => str_starts_with($o['created_at'], $today));
        $pendingOrders = array_filter($orders, fn ($o) => $o['status'] === 'pending');
        $todayRevenue = array_sum(array_map(fn ($o) => $o['payment_status'] === 'paid' ? $o['total_amount'] : 0, $todayOrders));

        $petugas = MockData::petugas();
        $pendingSetoran = array_sum(array_map(fn ($p) => $p['saldo_hutang'], $petugas));

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_order_hari_ini' => count($todayOrders),
                'order_pending' => count($pendingOrders),
                'pendapatan_hari_ini' => $todayRevenue,
                'setoran_pending' => $pendingSetoran,
            ],
            'weeklyChart' => $this->getWeeklyChartData(),
            'recentOrders' => array_slice($orders, 0, 5),
        ]);
    }

    public function dispatch(Request $request): Response
    {
        $orders = MockData::generateOrders(25);
        $petugas = MockData::petugas();

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $orders = array_filter($orders, fn ($o) => $o['status'] === $request->status);
        }

        // Filter by customer type
        if ($request->has('customer_type') && $request->customer_type !== 'all') {
            $orders = array_filter($orders, fn ($o) => $o['customer_type'] === $request->customer_type);
        }

        // Filter by date
        if ($request->has('date') && $request->date) {
            $orders = array_filter($orders, fn ($o) => str_starts_with($o['scheduled_at'] ?? '', $request->date));
        }

        // Re-index array
        $orders = array_values($orders);

        // Pagination
        $page = $request->get('page', 1);
        $perPage = 10;
        $total = count($orders);
        $offset = ($page - 1) * $perPage;
        $paginatedOrders = array_slice($orders, $offset, $perPage);

        // Filter petugas yang aktif dan punya armada
        $availablePetugas = array_values(array_filter($petugas, fn ($p) => $p['status_aktif'] && $p['armada']));

        return Inertia::render('Admin/Dispatch', [
            'orders' => [
                'data' => $paginatedOrders,
                'meta' => [
                    'current_page' => (int) $page,
                    'last_page' => (int) ceil($total / $perPage),
                    'per_page' => $perPage,
                    'total' => $total,
                ],
            ],
            'petugas' => $availablePetugas,
            'filters' => [
                'status' => $request->get('status', 'all'),
                'customer_type' => $request->get('customer_type', 'all'),
                'date' => $request->get('date', ''),
            ],
        ]);
    }

    public function kasir(Request $request): Response
    {
        $orders = MockData::generateOrders(25);
        $petugas = MockData::petugas();

        // Transfer orders pending verification
        $transferOrders = array_values(array_filter($orders, fn ($o) => $o['payment_method'] === 'transfer' &&
            $o['payment_status'] === 'pending_verification' &&
            $o['bukti_transfer']
        ));

        // Cash orders that have been collected but not deposited
        $cashPendingDeposit = array_values(array_filter($orders, fn ($o) => $o['payment_method'] === 'cash' &&
            $o['cash_collection_status'] === 'collected'
        ));

        // Group cash pending by petugas for easier setoran
        $cashByPetugas = [];
        foreach ($cashPendingDeposit as $order) {
            if ($order['petugas']) {
                $petugasId = $order['petugas']['id'];
                if (! isset($cashByPetugas[$petugasId])) {
                    $cashByPetugas[$petugasId] = [
                        'petugas' => $order['petugas'],
                        'orders' => [],
                        'total_amount' => 0,
                    ];
                }
                $cashByPetugas[$petugasId]['orders'][] = $order;
                $cashByPetugas[$petugasId]['total_amount'] += $order['total_amount'];
            }
        }
        $cashByPetugas = array_values($cashByPetugas);

        // Mock setoran history with linked orders
        $setoranHistory = [
            [
                'id' => 1,
                'petugas_id' => 2,
                'petugas' => $petugas[1],
                'jumlah' => 250000,
                'tanggal' => '2026-02-15',
                'keterangan' => 'Setoran 2 order tunai',
                'order_count' => 2,
                'created_at' => '2026-02-15 16:00:00',
            ],
            [
                'id' => 2,
                'petugas_id' => 3,
                'petugas' => $petugas[2],
                'jumlah' => 150000,
                'tanggal' => '2026-02-14',
                'keterangan' => 'Setoran 1 order tunai',
                'order_count' => 1,
                'created_at' => '2026-02-14 11:00:00',
            ],
            [
                'id' => 3,
                'petugas_id' => 5,
                'petugas' => $petugas[4],
                'jumlah' => 300000,
                'tanggal' => '2026-02-13',
                'keterangan' => 'Setoran 3 order tunai',
                'order_count' => 3,
                'created_at' => '2026-02-13 14:30:00',
            ],
        ];

        // Calculate totals
        $totalPendingTransfer = array_sum(array_map(fn ($o) => $o['total_amount'], $transferOrders));
        $totalPendingCash = array_sum(array_map(fn ($o) => $o['total_amount'], $cashPendingDeposit));

        return Inertia::render('Admin/Kasir', [
            'transferOrders' => $transferOrders,
            'cashByPetugas' => $cashByPetugas,
            'setoranHistory' => $setoranHistory,
            'summary' => [
                'pending_transfer_count' => count($transferOrders),
                'pending_transfer_amount' => $totalPendingTransfer,
                'pending_cash_count' => count($cashPendingDeposit),
                'pending_cash_amount' => $totalPendingCash,
            ],
        ]);
    }

    public function laporan(Request $request): Response
    {
        $orders = MockData::generateOrders(25);
        $mitra = MockData::mitra();

        // Filter by date range
        $startDate = $request->get('start_date', now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->get('end_date', now()->format('Y-m-d'));

        $filteredOrders = array_filter($orders, function ($o) use ($startDate, $endDate) {
            $orderDate = substr($o['created_at'], 0, 10);

            return $orderDate >= $startDate && $orderDate <= $endDate && $o['status'] === 'done';
        });

        $totalOrders = count($filteredOrders);
        $totalRevenue = array_sum(array_map(fn ($o) => $o['total_amount'], $filteredOrders));
        $totalVolume = array_sum(array_map(fn ($o) => $o['volume_actual'] ?? $o['volume_estimate'], $filteredOrders));

        // Breakdown per mitra
        $mitraBreakdown = [];
        foreach ($mitra as $m) {
            $mitraOrders = array_filter($filteredOrders, fn ($o) => $o['petugas'] && $o['petugas']['mitra_id'] === $m['id']
            );
            $mitraBreakdown[] = [
                'mitra' => $m,
                'total_orders' => count($mitraOrders),
                'total_revenue' => array_sum(array_map(fn ($o) => $o['total_amount'], $mitraOrders)),
                'total_volume' => array_sum(array_map(fn ($o) => $o['volume_actual'] ?? $o['volume_estimate'], $mitraOrders)),
            ];
        }

        return Inertia::render('Admin/Laporan', [
            'summary' => [
                'total_orders' => $totalOrders,
                'total_revenue' => $totalRevenue,
                'total_volume' => $totalVolume,
            ],
            'mitraBreakdown' => $mitraBreakdown,
            'orders' => array_values($filteredOrders),
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }
}
