<?php

namespace App\Http\Controllers;

use App\Support\MockData;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DriverController extends Controller
{
    /**
     * Job List - /app/tugas
     */
    public function index(Request $request): Response
    {
        $tasks = MockData::driverTasks();
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
        $tasks = array_merge(MockData::driverTasks(), MockData::driverRiwayat());
        $task = collect($tasks)->firstWhere('id', (int) $id);

        if (! $task) {
            abort(404);
        }

        $tarifMap = MockData::tarifMap();

        return Inertia::render('Driver/Tugas/Show', [
            'task' => $task,
            'tarif' => $tarifMap[$task['customer_type']],
            'armadaKapasitas' => $task['armada']['kapasitas'] ?? 6,
        ]);
    }

    /**
     * Riwayat - /app/riwayat
     */
    public function riwayat(Request $request): Response
    {
        $riwayat = MockData::driverRiwayat();
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
        $petugas = MockData::petugas();
        $driverPetugas = $petugas[0]; // Current driver is petugas[0]

        $profile = [
            'id' => $driverPetugas['id'],
            'nama' => auth()->user()->name ?? $driverPetugas['nama'],
            'kontak' => $driverPetugas['kontak'],
            'email' => auth()->user()->email ?? 'driver@test.com',
            'mitra' => [
                'id' => $driverPetugas['mitra']['id'],
                'nama' => $driverPetugas['mitra']['nama'],
                'tipe' => $driverPetugas['mitra']['tipe'],
            ],
            'armada' => [
                'id' => $driverPetugas['armada']['id'],
                'plat_nomor' => $driverPetugas['armada']['plat_nomor'],
                'kapasitas' => $driverPetugas['armada']['kapasitas'],
            ],
            'saldo_hutang' => 850000,
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
