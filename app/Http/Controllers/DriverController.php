<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DriverController extends Controller
{
    /**
     * Mock data for driver tasks
     */
    private function getMockTasks(): array
    {
        return [
            [
                'id' => 1,
                'order_number' => 'ORD-2026-0001',
                'customer_name' => 'Budi Santoso',
                'customer_type' => 'household',
                'customer_address' => 'Jl. Raden Intan No. 45, Tanjung Karang, Bandar Lampung',
                'customer_phone' => '081234567890',
                'latitude' => -5.4295,
                'longitude' => 105.2619,
                'volume_estimate' => 4,
                'status' => 'assigned',
                'notes' => 'Rumah warna biru, pagar hitam',
                'payment_method' => 'cash',
                'total_amount' => 400000,
                'scheduled_at' => '2026-02-17 09:00:00',
                'created_at' => '2026-02-16 14:00:00',
                'armada' => [
                    'id' => 1,
                    'plat_nomor' => 'BE 1234 AB',
                    'kapasitas' => 6,
                ],
            ],
            [
                'id' => 2,
                'order_number' => 'ORD-2026-0002',
                'customer_name' => 'PT. Maju Jaya',
                'customer_type' => 'institution',
                'customer_address' => 'Jl. Kartini No. 88, Teluk Betung, Bandar Lampung',
                'customer_phone' => '082345678901',
                'customer_npwp' => '12.345.678.9-012.345',
                'latitude' => -5.4512,
                'longitude' => 105.2701,
                'volume_estimate' => 8,
                'status' => 'on_the_way',
                'notes' => 'Gedung 3 lantai, masuk dari pintu belakang',
                'payment_method' => 'transfer',
                'total_amount' => 1200000,
                'scheduled_at' => '2026-02-17 11:00:00',
                'started_at' => '2026-02-17 10:30:00',
                'created_at' => '2026-02-16 15:00:00',
                'armada' => [
                    'id' => 1,
                    'plat_nomor' => 'BE 1234 AB',
                    'kapasitas' => 6,
                ],
            ],
            [
                'id' => 3,
                'order_number' => 'ORD-2026-0003',
                'customer_name' => 'Siti Aminah',
                'customer_type' => 'household',
                'customer_address' => 'Jl. Diponegoro No. 12, Kedaton, Bandar Lampung',
                'customer_phone' => '083456789012',
                'latitude' => -5.3891,
                'longitude' => 105.2456,
                'volume_estimate' => 3,
                'status' => 'arrived',
                'payment_method' => 'cash',
                'total_amount' => 300000,
                'scheduled_at' => '2026-02-17 14:00:00',
                'started_at' => '2026-02-17 13:30:00',
                'arrived_at' => '2026-02-17 13:55:00',
                'gps_arrival_lat' => -5.3892,
                'gps_arrival_lng' => 105.2457,
                'gps_valid' => true,
                'created_at' => '2026-02-16 16:00:00',
                'armada' => [
                    'id' => 1,
                    'plat_nomor' => 'BE 1234 AB',
                    'kapasitas' => 6,
                ],
            ],
            [
                'id' => 4,
                'order_number' => 'ORD-2026-0004',
                'customer_name' => 'Ahmad Hidayat',
                'customer_type' => 'household',
                'customer_address' => 'Jl. Teuku Umar No. 77, Sukarame, Bandar Lampung',
                'customer_phone' => '084567890123',
                'latitude' => -5.3756,
                'longitude' => 105.3012,
                'volume_estimate' => 5,
                'status' => 'processing',
                'payment_method' => 'cash',
                'total_amount' => 500000,
                'scheduled_at' => '2026-02-17 16:00:00',
                'started_at' => '2026-02-17 15:30:00',
                'arrived_at' => '2026-02-17 15:50:00',
                'gps_valid' => true,
                'foto_sebelum' => ['/storage/evidence/before-4-1.jpg'],
                'created_at' => '2026-02-16 17:00:00',
                'armada' => [
                    'id' => 1,
                    'plat_nomor' => 'BE 1234 AB',
                    'kapasitas' => 6,
                ],
            ],
        ];
    }

    /**
     * Mock data for completed tasks (riwayat)
     */
    private function getMockRiwayat(): array
    {
        return [
            [
                'id' => 10,
                'order_number' => 'ORD-2026-0010',
                'customer_name' => 'Dewi Lestari',
                'customer_type' => 'household',
                'customer_address' => 'Jl. Ahmad Yani No. 55, Tanjung Karang',
                'customer_phone' => '085678901234',
                'volume_estimate' => 4,
                'volume_actual' => 3.5,
                'status' => 'done',
                'payment_method' => 'cash',
                'total_amount' => 350000,
                'completed_at' => '2026-02-16 11:30:00',
                'created_at' => '2026-02-15 14:00:00',
            ],
            [
                'id' => 11,
                'order_number' => 'ORD-2026-0011',
                'customer_name' => 'CV. Berkah Abadi',
                'customer_type' => 'institution',
                'customer_address' => 'Jl. Gatot Subroto No. 100, Teluk Betung',
                'customer_phone' => '086789012345',
                'volume_estimate' => 10,
                'volume_actual' => 9,
                'status' => 'done',
                'payment_method' => 'transfer',
                'total_amount' => 1350000,
                'completed_at' => '2026-02-16 15:00:00',
                'created_at' => '2026-02-15 16:00:00',
            ],
            [
                'id' => 12,
                'order_number' => 'ORD-2026-0012',
                'customer_name' => 'Hendra Wijaya',
                'customer_type' => 'household',
                'customer_address' => 'Jl. Pangeran Antasari No. 23, Kedaton',
                'customer_phone' => '087890123456',
                'volume_estimate' => 5,
                'volume_actual' => 5,
                'status' => 'done',
                'payment_method' => 'cash',
                'total_amount' => 500000,
                'completed_at' => '2026-02-15 10:00:00',
                'created_at' => '2026-02-14 09:00:00',
            ],
        ];
    }

    /**
     * Job List - /app/tugas
     */
    public function index(Request $request): Response
    {
        $tasks = $this->getMockTasks();
        $filter = $request->get('filter', 'today');

        // Filter by today if needed
        if ($filter === 'today') {
            $today = date('Y-m-d');
            $tasks = array_filter($tasks, function ($task) use ($today) {
                $scheduledDate = isset($task['scheduled_at']) 
                    ? date('Y-m-d', strtotime($task['scheduled_at'])) 
                    : date('Y-m-d', strtotime($task['created_at']));
                return $scheduledDate === $today;
            });
        }

        return Inertia::render('Driver/Tugas/Index', [
            'tasks' => array_values($tasks),
            'filter' => $filter,
        ]);
    }

    /**
     * Job Detail - /app/tugas/:id
     */
    public function show(string $id): Response
    {
        $tasks = array_merge($this->getMockTasks(), $this->getMockRiwayat());
        $task = collect($tasks)->firstWhere('id', (int) $id);

        if (!$task) {
            abort(404);
        }

        // Get tarif for calculation
        $tarif = [
            'household' => 100000,
            'institution' => 150000,
        ];

        return Inertia::render('Driver/Tugas/Show', [
            'task' => $task,
            'tarif' => $tarif[$task['customer_type']],
            'armadaKapasitas' => $task['armada']['kapasitas'] ?? 6,
        ]);
    }

    /**
     * Riwayat - /app/riwayat
     */
    public function riwayat(Request $request): Response
    {
        $riwayat = $this->getMockRiwayat();
        $dateFilter = $request->get('date');

        if ($dateFilter) {
            $riwayat = array_filter($riwayat, function ($task) use ($dateFilter) {
                return date('Y-m-d', strtotime($task['completed_at'])) === $dateFilter;
            });
        }

        // Calculate summary
        $summary = [
            'total_order' => count($riwayat),
            'total_volume' => array_sum(array_column($riwayat, 'volume_actual')),
            'total_cod' => array_sum(array_map(function ($task) {
                return $task['payment_method'] === 'cash' ? $task['total_amount'] : 0;
            }, $riwayat)),
        ];

        return Inertia::render('Driver/Riwayat', [
            'riwayat' => array_values($riwayat),
            'summary' => $summary,
            'dateFilter' => $dateFilter,
        ]);
    }

    /**
     * Profil - /app/profil
     */
    public function profil(): Response
    {
        // Mock driver profile with COD balance
        $profile = [
            'id' => 1,
            'nama' => auth()->user()->name ?? 'Driver Test',
            'kontak' => '081234567890',
            'email' => auth()->user()->email ?? 'driver@test.com',
            'mitra' => [
                'id' => 1,
                'nama' => 'UPT Kebersihan Pusat',
                'tipe' => 'internal',
            ],
            'armada' => [
                'id' => 1,
                'plat_nomor' => 'BE 1234 AB',
                'kapasitas' => 6,
            ],
            'saldo_hutang' => 850000, // COD yang belum disetor
            'total_tugas_selesai' => 47,
            'total_volume' => 185.5,
        ];

        return Inertia::render('Driver/Profil', [
            'profile' => $profile,
        ]);
    }

    /**
     * Update task status (mock)
     */
    public function updateStatus(Request $request, string $id)
    {
        // In real implementation, this would update the database
        return back()->with('success', 'Status berhasil diperbarui');
    }

    /**
     * Submit work completion (mock)
     */
    public function complete(Request $request, string $id)
    {
        // In real implementation, this would:
        // 1. Validate photos
        // 2. Save volume actual
        // 3. Calculate total
        // 4. Update payment status
        return redirect()->route('driver.tugas')->with('success', 'Tugas berhasil diselesaikan');
    }
}
