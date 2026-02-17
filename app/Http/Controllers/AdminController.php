<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    /**
     * Generate mockup data for development
     */
    private function getMockMitra(): array
    {
        return [
            ['id' => 1, 'nama' => 'UPT Kebersihan Pusat', 'tipe' => 'internal', 'kontak' => '021-5551234', 'alamat' => 'Jl. Kebersihan No. 1', 'created_at' => '2026-01-01 08:00:00', 'updated_at' => '2026-01-01 08:00:00'],
            ['id' => 2, 'nama' => 'CV. Bersih Jaya', 'tipe' => 'external', 'kontak' => '081234567890', 'alamat' => 'Jl. Industri No. 45', 'created_at' => '2026-01-05 09:00:00', 'updated_at' => '2026-01-05 09:00:00'],
            ['id' => 3, 'nama' => 'CV. Maju Bersama', 'tipe' => 'external', 'kontak' => '082345678901', 'alamat' => 'Jl. Raya Timur No. 12', 'created_at' => '2026-01-10 10:00:00', 'updated_at' => '2026-01-10 10:00:00'],
        ];
    }

    private function getMockArmada(): array
    {
        $mitra = $this->getMockMitra();
        return [
            ['id' => 1, 'plat_nomor' => 'B 1234 ABC', 'kapasitas' => 6, 'status' => 'available', 'mitra_id' => 1, 'mitra' => $mitra[0], 'created_at' => '2026-01-01 08:00:00', 'updated_at' => '2026-01-01 08:00:00'],
            ['id' => 2, 'plat_nomor' => 'B 5678 DEF', 'kapasitas' => 8, 'status' => 'in_use', 'mitra_id' => 1, 'mitra' => $mitra[0], 'created_at' => '2026-01-02 08:00:00', 'updated_at' => '2026-02-16 09:00:00'],
            ['id' => 3, 'plat_nomor' => 'B 9012 GHI', 'kapasitas' => 6, 'status' => 'available', 'mitra_id' => 2, 'mitra' => $mitra[1], 'created_at' => '2026-01-05 09:00:00', 'updated_at' => '2026-01-05 09:00:00'],
            ['id' => 4, 'plat_nomor' => 'B 3456 JKL', 'kapasitas' => 10, 'status' => 'maintenance', 'mitra_id' => 2, 'mitra' => $mitra[1], 'created_at' => '2026-01-06 09:00:00', 'updated_at' => '2026-02-10 14:00:00'],
            ['id' => 5, 'plat_nomor' => 'B 7890 MNO', 'kapasitas' => 8, 'status' => 'available', 'mitra_id' => 3, 'mitra' => $mitra[2], 'created_at' => '2026-01-10 10:00:00', 'updated_at' => '2026-01-10 10:00:00'],
        ];
    }

    private function getMockPetugas(): array
    {
        $mitra = $this->getMockMitra();
        $armada = $this->getMockArmada();
        return [
            ['id' => 1, 'nama' => 'Budi Santoso', 'kontak' => '081111111111', 'mitra_id' => 1, 'mitra' => $mitra[0], 'armada_id' => 1, 'armada' => $armada[0], 'status_aktif' => true, 'saldo_hutang' => 0, 'created_at' => '2026-01-01 08:00:00', 'updated_at' => '2026-01-01 08:00:00'],
            ['id' => 2, 'nama' => 'Agus Wijaya', 'kontak' => '081222222222', 'mitra_id' => 1, 'mitra' => $mitra[0], 'armada_id' => 2, 'armada' => $armada[1], 'status_aktif' => true, 'saldo_hutang' => 150000, 'created_at' => '2026-01-02 08:00:00', 'updated_at' => '2026-02-15 16:00:00'],
            ['id' => 3, 'nama' => 'Dedi Kurniawan', 'kontak' => '081333333333', 'mitra_id' => 2, 'mitra' => $mitra[1], 'armada_id' => 3, 'armada' => $armada[2], 'status_aktif' => true, 'saldo_hutang' => 75000, 'created_at' => '2026-01-05 09:00:00', 'updated_at' => '2026-02-14 11:00:00'],
            ['id' => 4, 'nama' => 'Eko Prasetyo', 'kontak' => '081444444444', 'mitra_id' => 2, 'mitra' => $mitra[1], 'armada_id' => 4, 'armada' => $armada[3], 'status_aktif' => true, 'saldo_hutang' => 0, 'created_at' => '2026-01-06 09:00:00', 'updated_at' => '2026-01-06 09:00:00'],
            ['id' => 5, 'nama' => 'Fajar Hidayat', 'kontak' => '081555555555', 'mitra_id' => 3, 'mitra' => $mitra[2], 'armada_id' => 5, 'armada' => $armada[4], 'status_aktif' => true, 'saldo_hutang' => 200000, 'created_at' => '2026-01-10 10:00:00', 'updated_at' => '2026-02-16 08:00:00'],
            ['id' => 6, 'nama' => 'Gunawan', 'kontak' => '081666666666', 'mitra_id' => 3, 'mitra' => $mitra[2], 'armada_id' => null, 'armada' => null, 'status_aktif' => false, 'saldo_hutang' => 0, 'created_at' => '2026-01-11 10:00:00', 'updated_at' => '2026-02-01 09:00:00'],
        ];
    }

    private function getMockTarif(): array
    {
        return [
            ['id' => 1, 'tipe_customer' => 'household', 'harga_per_m3' => 50000, 'keterangan' => 'Tarif rumah tangga standar', 'created_at' => '2026-01-01 08:00:00', 'updated_at' => '2026-01-01 08:00:00'],
            ['id' => 2, 'tipe_customer' => 'institution', 'harga_per_m3' => 75000, 'keterangan' => 'Tarif instansi/perusahaan', 'created_at' => '2026-01-01 08:00:00', 'updated_at' => '2026-01-01 08:00:00'],
        ];
    }

    private function getMockOrders(): array
    {
        $petugas = $this->getMockPetugas();
        $armada = $this->getMockArmada();
        
        $customerTypes = ['household', 'institution'];
        $paymentMethods = ['cash', 'transfer'];
        
        $orders = [];
        $baseDate = now()->subDays(14);
        
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

        for ($i = 1; $i <= 25; $i++) {
            $customerType = $customerTypes[array_rand($customerTypes)];
            $status = $this->weightedRandom([
                'pending' => 20,
                'assigned' => 15,
                'processing' => 15,
                'done' => 45,
                'cancelled' => 5,
            ]);
            
            // Payment method is chosen at order creation
            $paymentMethod = $paymentMethods[array_rand($paymentMethods)];
            
            // Determine payment status and cash collection status based on order status and payment method
            $paymentStatus = 'unpaid';
            $cashCollectionStatus = $paymentMethod === 'cash' ? 'pending' : 'not_applicable';
            $buktiTransfer = null;
            $setoranId = null;
            
            if ($status === 'cancelled') {
                $paymentStatus = 'unpaid';
                $cashCollectionStatus = $paymentMethod === 'cash' ? 'pending' : 'not_applicable';
            } elseif ($paymentMethod === 'transfer') {
                // Transfer flow: unpaid -> pending_verification (bukti uploaded) -> paid (verified)
                if ($status === 'done') {
                    $paymentStatus = 'paid';
                    $buktiTransfer = '/storage/bukti/transfer-' . $i . '.jpg';
                } elseif (in_array($status, ['assigned', 'processing'])) {
                    // Some have uploaded bukti, some haven't
                    if (rand(0, 1)) {
                        $paymentStatus = 'pending_verification';
                        $buktiTransfer = '/storage/bukti/transfer-' . $i . '.jpg';
                    }
                }
            } else {
                // Cash flow: pending -> collected (petugas got cash) -> deposited (setor ke kasir)
                if ($status === 'done') {
                    // Done orders: cash either collected or deposited
                    $cashFlow = $this->weightedRandom([
                        'collected' => 40,  // Petugas has cash, not yet deposited
                        'deposited' => 60,  // Already deposited to kasir
                    ]);
                    $cashCollectionStatus = $cashFlow;
                    $paymentStatus = $cashFlow === 'deposited' ? 'paid' : 'unpaid';
                    if ($cashFlow === 'deposited') {
                        $setoranId = rand(1, 5); // Link to a setoran
                    }
                } elseif ($status === 'processing') {
                    // Processing: might have collected cash already
                    $cashCollectionStatus = rand(0, 1) ? 'collected' : 'pending';
                }
            }
            
            $volume = $customerType === 'household' ? rand(2, 6) : rand(5, 15);
            $pricePerM3 = $customerType === 'household' ? 50000 : 75000;
            
            $createdAt = $baseDate->copy()->addDays(rand(0, 14))->addHours(rand(6, 18));
            $scheduledAt = $createdAt->copy()->addDays(rand(0, 3));
            
            $assignedPetugas = null;
            $assignedArmada = null;
            
            if (in_array($status, ['assigned', 'processing', 'done'])) {
                $petugasIndex = array_rand($petugas);
                $assignedPetugas = $petugas[$petugasIndex];
                $assignedArmada = $assignedPetugas['armada'] ?? null;
            }

            $orders[] = [
                'id' => $i,
                'order_number' => 'ORD-' . str_pad($i, 5, '0', STR_PAD_LEFT),
                'customer_name' => $customerNames[$customerType][array_rand($customerNames[$customerType])],
                'customer_type' => $customerType,
                'customer_address' => $addresses[array_rand($addresses)],
                'customer_phone' => '08' . rand(1000000000, 9999999999),
                'customer_npwp' => $customerType === 'institution' ? rand(10, 99) . '.' . rand(100, 999) . '.' . rand(100, 999) . '.' . rand(1, 9) . '-' . rand(100, 999) . '.' . rand(100, 999) : null,
                'volume' => $volume,
                'status' => $status,
                'payment_method' => $paymentMethod,
                'payment_status' => $paymentStatus,
                'cash_collection_status' => $cashCollectionStatus,
                'total_amount' => $volume * $pricePerM3,
                'bukti_transfer' => $buktiTransfer,
                'setoran_id' => $setoranId,
                'notes' => rand(0, 1) ? 'Catatan untuk order #' . $i : null,
                'latitude' => -6.2 + (rand(-100, 100) / 1000),
                'longitude' => 106.8 + (rand(-100, 100) / 1000),
                'scheduled_at' => $scheduledAt->format('Y-m-d H:i:s'),
                'completed_at' => $status === 'done' ? $scheduledAt->copy()->addHours(rand(1, 4))->format('Y-m-d H:i:s') : null,
                'created_at' => $createdAt->format('Y-m-d H:i:s'),
                'updated_at' => $createdAt->format('Y-m-d H:i:s'),
                'petugas_id' => $assignedPetugas ? $assignedPetugas['id'] : null,
                'petugas' => $assignedPetugas,
                'armada_id' => $assignedArmada ? $assignedArmada['id'] : null,
                'armada' => $assignedArmada,
            ];
        }

        // Sort by created_at descending
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
        $orders = $this->getMockOrders();
        $today = now()->format('Y-m-d');
        
        $todayOrders = array_filter($orders, fn($o) => str_starts_with($o['created_at'], $today));
        $pendingOrders = array_filter($orders, fn($o) => $o['status'] === 'pending');
        $todayRevenue = array_sum(array_map(fn($o) => $o['payment_status'] === 'paid' ? $o['total_amount'] : 0, $todayOrders));
        
        $petugas = $this->getMockPetugas();
        $pendingSetoran = array_sum(array_map(fn($p) => $p['saldo_hutang'], $petugas));

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
        $orders = $this->getMockOrders();
        $petugas = $this->getMockPetugas();
        
        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $orders = array_filter($orders, fn($o) => $o['status'] === $request->status);
        }
        
        // Filter by customer type
        if ($request->has('customer_type') && $request->customer_type !== 'all') {
            $orders = array_filter($orders, fn($o) => $o['customer_type'] === $request->customer_type);
        }
        
        // Filter by date
        if ($request->has('date') && $request->date) {
            $orders = array_filter($orders, fn($o) => str_starts_with($o['scheduled_at'], $request->date));
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
        $availablePetugas = array_values(array_filter($petugas, fn($p) => $p['status_aktif'] && $p['armada']));

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
        $orders = $this->getMockOrders();
        $petugas = $this->getMockPetugas();
        
        // Transfer orders pending verification
        $transferOrders = array_values(array_filter($orders, fn($o) => 
            $o['payment_method'] === 'transfer' && 
            $o['payment_status'] === 'pending_verification' && 
            $o['bukti_transfer']
        ));
        
        // Cash orders that have been collected but not deposited
        // These are orders where petugas has the cash
        $cashPendingDeposit = array_values(array_filter($orders, fn($o) => 
            $o['payment_method'] === 'cash' && 
            $o['cash_collection_status'] === 'collected'
        ));
        
        // Group cash pending by petugas for easier setoran
        $cashByPetugas = [];
        foreach ($cashPendingDeposit as $order) {
            if ($order['petugas']) {
                $petugasId = $order['petugas']['id'];
                if (!isset($cashByPetugas[$petugasId])) {
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
                'created_at' => '2026-02-15 16:00:00'
            ],
            [
                'id' => 2, 
                'petugas_id' => 3, 
                'petugas' => $petugas[2], 
                'jumlah' => 150000, 
                'tanggal' => '2026-02-14', 
                'keterangan' => 'Setoran 1 order tunai',
                'order_count' => 1,
                'created_at' => '2026-02-14 11:00:00'
            ],
            [
                'id' => 3, 
                'petugas_id' => 5, 
                'petugas' => $petugas[4], 
                'jumlah' => 300000, 
                'tanggal' => '2026-02-13', 
                'keterangan' => 'Setoran 3 order tunai',
                'order_count' => 3,
                'created_at' => '2026-02-13 14:30:00'
            ],
        ];

        // Calculate totals
        $totalPendingTransfer = array_sum(array_map(fn($o) => $o['total_amount'], $transferOrders));
        $totalPendingCash = array_sum(array_map(fn($o) => $o['total_amount'], $cashPendingDeposit));

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
        $orders = $this->getMockOrders();
        $mitra = $this->getMockMitra();
        
        // Filter by date range
        $startDate = $request->get('start_date', now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->get('end_date', now()->format('Y-m-d'));
        
        $filteredOrders = array_filter($orders, function($o) use ($startDate, $endDate) {
            $orderDate = substr($o['created_at'], 0, 10);
            return $orderDate >= $startDate && $orderDate <= $endDate && $o['status'] === 'done';
        });
        
        $totalOrders = count($filteredOrders);
        $totalRevenue = array_sum(array_map(fn($o) => $o['total_amount'], $filteredOrders));
        $totalVolume = array_sum(array_map(fn($o) => $o['volume'], $filteredOrders));
        
        // Breakdown per mitra
        $mitraBreakdown = [];
        foreach ($mitra as $m) {
            $mitraOrders = array_filter($filteredOrders, fn($o) => 
                $o['petugas'] && $o['petugas']['mitra_id'] === $m['id']
            );
            $mitraBreakdown[] = [
                'mitra' => $m,
                'total_orders' => count($mitraOrders),
                'total_revenue' => array_sum(array_map(fn($o) => $o['total_amount'], $mitraOrders)),
                'total_volume' => array_sum(array_map(fn($o) => $o['volume'], $mitraOrders)),
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
