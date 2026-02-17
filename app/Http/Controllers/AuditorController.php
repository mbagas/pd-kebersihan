<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditorController extends Controller
{
    /**
     * Mock data generators (reuse from AdminController pattern)
     */
    private function getMockMitra(): array
    {
        return [
            ['id' => 1, 'nama' => 'UPT Kebersihan Pusat', 'tipe' => 'internal'],
            ['id' => 2, 'nama' => 'CV. Bersih Jaya', 'tipe' => 'external'],
            ['id' => 3, 'nama' => 'CV. Maju Bersama', 'tipe' => 'external'],
        ];
    }

    private function getMockOrders(): array
    {
        $mitra = $this->getMockMitra();
        $customerTypes = ['household', 'institution'];
        $paymentMethods = ['cash', 'transfer'];
        $statuses = ['pending', 'assigned', 'on_the_way', 'arrived', 'processing', 'done', 'cancelled'];
        
        $customerNames = [
            'household' => ['Pak Ahmad', 'Bu Siti', 'Pak Joko', 'Bu Dewi', 'Pak Hendra', 'Bu Rina', 'Pak Bambang', 'Bu Yuni', 'Pak Darmawan', 'Bu Lestari'],
            'institution' => ['PT. Maju Jaya', 'CV. Berkah Abadi', 'RS. Sehat Sentosa', 'Hotel Grand Palace', 'Mall Central', 'Universitas Nusantara', 'Bank Mandiri Cabang Utama', 'Kantor Kecamatan', 'Pabrik Tekstil Indah', 'Restoran Padang Sederhana'],
        ];
        
        $addresses = [
            'Jl. Merdeka No. 10, Kel. Sukamaju',
            'Jl. Sudirman No. 25, Kel. Cempaka',
            'Jl. Gatot Subroto No. 45, Kel. Harapan',
            'Jl. Ahmad Yani No. 88, Kel. Sejahtera',
            'Jl. Diponegoro No. 12, Kel. Makmur',
            'Jl. Imam Bonjol No. 33, Kel. Damai',
            'Jl. Veteran No. 56, Kel. Sentosa',
            'Jl. Pahlawan No. 78, Kel. Bahagia',
            'Jl. Kartini No. 99, Kel. Indah',
            'Jl. Pemuda No. 15, Kel. Jaya',
        ];

        $petugasNames = ['Budi Santoso', 'Agus Wijaya', 'Dedi Kurniawan', 'Eko Prasetyo', 'Fajar Hidayat'];
        $armadaPlats = ['B 1234 ABC', 'B 5678 DEF', 'B 9012 GHI', 'B 3456 JKL', 'B 7890 MNO'];

        $orders = [];
        $baseDate = now()->subMonths(6);
        
        // Generate 150 orders for 6 months of data
        for ($i = 1; $i <= 150; $i++) {
            $customerType = $customerTypes[array_rand($customerTypes)];
            $status = $this->weightedRandom([
                'pending' => 5,
                'assigned' => 5,
                'on_the_way' => 3,
                'arrived' => 3,
                'processing' => 4,
                'done' => 75,
                'cancelled' => 5,
            ]);
            
            $paymentMethod = $paymentMethods[array_rand($paymentMethods)];
            $paymentStatus = $status === 'done' ? 'paid' : ($status === 'cancelled' ? 'unpaid' : 'unpaid');
            
            $volume = $customerType === 'household' ? rand(2, 6) : rand(5, 15);
            $pricePerM3 = $customerType === 'household' ? 50000 : 75000;
            
            $createdAt = $baseDate->copy()->addDays(rand(0, 180))->addHours(rand(6, 18));
            $scheduledAt = $createdAt->copy()->addDays(rand(0, 3));
            
            $hasPetugas = in_array($status, ['assigned', 'on_the_way', 'arrived', 'processing', 'done']);
            $petugasIndex = array_rand($petugasNames);
            $mitraIndex = array_rand($mitra);

            $orders[] = [
                'id' => $i,
                'order_number' => 'ORD-' . str_pad($i, 5, '0', STR_PAD_LEFT),
                'customer_name' => $customerNames[$customerType][array_rand($customerNames[$customerType])],
                'customer_type' => $customerType,
                'customer_address' => $addresses[array_rand($addresses)],
                'customer_phone' => '08' . rand(1000000000, 9999999999),
                'volume' => $volume,
                'status' => $status,
                'payment_method' => $paymentMethod,
                'payment_status' => $paymentStatus,
                'total_amount' => $volume * $pricePerM3,
                'latitude' => -6.2 + (rand(-200, 200) / 1000),
                'longitude' => 106.8 + (rand(-200, 200) / 1000),
                'scheduled_at' => $scheduledAt->format('Y-m-d H:i:s'),
                'completed_at' => $status === 'done' ? $scheduledAt->copy()->addHours(rand(1, 4))->format('Y-m-d H:i:s') : null,
                'created_at' => $createdAt->format('Y-m-d H:i:s'),
                'petugas_nama' => $hasPetugas ? $petugasNames[$petugasIndex] : null,
                'mitra_nama' => $hasPetugas ? $mitra[$mitraIndex]['nama'] : null,
                'mitra_id' => $hasPetugas ? $mitra[$mitraIndex]['id'] : null,
                'armada_plat' => $hasPetugas ? $armadaPlats[$petugasIndex] : null,
                'foto_before' => $status === 'done' ? '/storage/photos/before-' . $i . '.jpg' : null,
                'foto_after' => $status === 'done' ? '/storage/photos/after-' . $i . '.jpg' : null,
                'timeline' => [
                    'assigned_at' => $hasPetugas ? $createdAt->copy()->addMinutes(rand(5, 30))->format('Y-m-d H:i:s') : null,
                    'arrived_at' => in_array($status, ['arrived', 'processing', 'done']) ? $scheduledAt->copy()->addMinutes(rand(30, 90))->format('Y-m-d H:i:s') : null,
                    'completed_at' => $status === 'done' ? $scheduledAt->copy()->addHours(rand(1, 4))->format('Y-m-d H:i:s') : null,
                ],
                'gps_validated' => $status === 'done' ? (rand(0, 10) > 2) : false,
                'notes' => rand(0, 3) === 0 ? 'Catatan untuk order #' . $i : null,
            ];
        }

        usort($orders, fn($a, $b) => strtotime($b['created_at']) - strtotime($a['created_at']));
        
        return $orders;
    }

    private function weightedRandom(array $weights): string
    {
        $total = array_sum($weights);
        $rand = rand(1, $total);
        $current = 0;
        
        foreach ($weights as $key => $weight) {
            $current += $weight;
            if ($rand <= $current) {
                return $key;
            }
        }
        
        return array_key_first($weights);
    }

    public function dashboard(): Response
    {
        $orders = $this->getMockOrders();
        $currentMonth = now()->format('Y-m');
        
        // Filter orders bulan ini
        $monthOrders = array_filter($orders, fn($o) => str_starts_with($o['created_at'], $currentMonth));
        $doneOrders = array_filter($monthOrders, fn($o) => $o['status'] === 'done');
        
        // Stats
        $totalOrderBulanIni = count($monthOrders);
        $totalPendapatan = array_sum(array_map(fn($o) => $o['payment_status'] === 'paid' ? $o['total_amount'] : 0, $monthOrders));
        $totalVolume = array_sum(array_map(fn($o) => $o['status'] === 'done' ? $o['volume'] : 0, $monthOrders));
        $daysInMonth = now()->daysInMonth;
        $rataRataOrderPerHari = $totalOrderBulanIni > 0 ? round($totalOrderBulanIni / $daysInMonth, 1) : 0;

        // Order Distribution (Pusat vs Mitra)
        $pusatOrders = count(array_filter($doneOrders, fn($o) => $o['mitra_id'] === 1));
        $mitraOrders = count($doneOrders) - $pusatOrders;
        
        // Monthly Revenue (6 bulan terakhir)
        $monthlyRevenue = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $monthKey = $month->format('Y-m');
            $monthLabel = $month->translatedFormat('M Y');
            
            $monthData = array_filter($orders, fn($o) => 
                str_starts_with($o['created_at'], $monthKey) && $o['payment_status'] === 'paid'
            );
            
            $monthlyRevenue[] = [
                'month' => $monthLabel,
                'pendapatan' => array_sum(array_map(fn($o) => $o['total_amount'], $monthData)),
            ];
        }

        // Daily Trend (30 hari terakhir)
        $dailyTrend = [];
        for ($i = 29; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $dateKey = $date->format('Y-m-d');
            
            $dayOrders = array_filter($orders, fn($o) => str_starts_with($o['created_at'], $dateKey));
            
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
        $orders = $this->getMockOrders();
        
        // Filter by date range
        $startDate = $request->get('start_date', now()->subDays(30)->format('Y-m-d'));
        $endDate = $request->get('end_date', now()->format('Y-m-d'));
        
        $filteredOrders = array_filter($orders, function($o) use ($startDate, $endDate, $request) {
            $orderDate = substr($o['created_at'], 0, 10);
            $inDateRange = $orderDate >= $startDate && $orderDate <= $endDate;
            
            // Filter by status
            if ($request->has('status') && $request->status !== 'all') {
                if ($o['status'] !== $request->status) return false;
            }
            
            // Filter by customer type
            if ($request->has('customer_type') && $request->customer_type !== 'all') {
                if ($o['customer_type'] !== $request->customer_type) return false;
            }
            
            return $inDateRange && $o['latitude'] && $o['longitude'];
        });

        // Map orders for frontend (only needed fields)
        $mapOrders = array_map(fn($o) => [
            'id' => $o['id'],
            'order_number' => $o['order_number'],
            'customer_name' => $o['customer_name'],
            'customer_type' => $o['customer_type'],
            'customer_address' => $o['customer_address'],
            'latitude' => $o['latitude'],
            'longitude' => $o['longitude'],
            'volume' => $o['volume'],
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
        $orders = $this->getMockOrders();
        $mitra = $this->getMockMitra();
        
        // Filter by date range
        $startDate = $request->get('start_date', now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->get('end_date', now()->format('Y-m-d'));
        
        $filteredOrders = array_filter($orders, function($o) use ($startDate, $endDate) {
            $orderDate = substr($o['created_at'], 0, 10);
            return $orderDate >= $startDate && $orderDate <= $endDate && $o['status'] === 'done';
        });
        $filteredOrders = array_values($filteredOrders);

        // Summary
        $summary = [
            'total_pendapatan' => array_sum(array_map(fn($o) => $o['total_amount'], $filteredOrders)),
            'total_orders' => count($filteredOrders),
            'total_volume' => array_sum(array_map(fn($o) => $o['volume'], $filteredOrders)),
        ];

        // Breakdown per Mitra
        $mitraBreakdown = [];
        foreach ($mitra as $m) {
            $mitraOrders = array_filter($filteredOrders, fn($o) => $o['mitra_id'] === $m['id']);
            $mitraBreakdown[] = [
                'mitra_id' => $m['id'],
                'mitra_nama' => $m['nama'],
                'total_orders' => count($mitraOrders),
                'total_pendapatan' => array_sum(array_map(fn($o) => $o['total_amount'], $mitraOrders)),
                'total_volume' => array_sum(array_map(fn($o) => $o['volume'], $mitraOrders)),
            ];
        }

        // Breakdown per Customer Type
        $customerTypeBreakdown = [
            [
                'customer_type' => 'household',
                'label' => 'Rumah Tangga',
                'total_orders' => count(array_filter($filteredOrders, fn($o) => $o['customer_type'] === 'household')),
                'total_pendapatan' => array_sum(array_map(fn($o) => $o['customer_type'] === 'household' ? $o['total_amount'] : 0, $filteredOrders)),
            ],
            [
                'customer_type' => 'institution',
                'label' => 'Instansi',
                'total_orders' => count(array_filter($filteredOrders, fn($o) => $o['customer_type'] === 'institution')),
                'total_pendapatan' => array_sum(array_map(fn($o) => $o['customer_type'] === 'institution' ? $o['total_amount'] : 0, $filteredOrders)),
            ],
        ];

        // Breakdown per Payment Method
        $paymentMethodBreakdown = [
            [
                'payment_method' => 'cash',
                'label' => 'Tunai',
                'total_orders' => count(array_filter($filteredOrders, fn($o) => $o['payment_method'] === 'cash')),
                'total_pendapatan' => array_sum(array_map(fn($o) => $o['payment_method'] === 'cash' ? $o['total_amount'] : 0, $filteredOrders)),
            ],
            [
                'payment_method' => 'transfer',
                'label' => 'Transfer',
                'total_orders' => count(array_filter($filteredOrders, fn($o) => $o['payment_method'] === 'transfer')),
                'total_pendapatan' => array_sum(array_map(fn($o) => $o['payment_method'] === 'transfer' ? $o['total_amount'] : 0, $filteredOrders)),
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
        $orders = $this->getMockOrders();
        
        // Filter by date range
        $startDate = $request->get('start_date', now()->subDays(30)->format('Y-m-d'));
        $endDate = $request->get('end_date', now()->format('Y-m-d'));
        
        $filteredOrders = array_filter($orders, function($o) use ($startDate, $endDate, $request) {
            $orderDate = substr($o['created_at'], 0, 10);
            $inDateRange = $orderDate >= $startDate && $orderDate <= $endDate;
            
            // Filter by status
            if ($request->has('status') && $request->status !== 'all') {
                if ($o['status'] !== $request->status) return false;
            }
            
            // Filter by customer type
            if ($request->has('customer_type') && $request->customer_type !== 'all') {
                if ($o['customer_type'] !== $request->customer_type) return false;
            }
            
            // Search
            if ($request->has('search') && $request->search) {
                $search = strtolower($request->search);
                $matchesSearch = str_contains(strtolower($o['order_number']), $search) ||
                    str_contains(strtolower($o['customer_name']), $search) ||
                    str_contains(strtolower($o['customer_address']), $search);
                if (!$matchesSearch) return false;
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
