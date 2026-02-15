<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArmadaController extends Controller
{
    private function getMockMitra(): array
    {
        return [
            ['id' => 1, 'nama' => 'UPT Kebersihan Pusat', 'tipe' => 'internal'],
            ['id' => 2, 'nama' => 'CV. Bersih Jaya', 'tipe' => 'external'],
            ['id' => 3, 'nama' => 'CV. Maju Bersama', 'tipe' => 'external'],
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

    public function index(Request $request): Response
    {
        $armada = $this->getMockArmada();
        $mitra = $this->getMockMitra();
        
        // Search
        if ($request->has('search') && $request->search) {
            $search = strtolower($request->search);
            $armada = array_filter($armada, fn($a) => 
                str_contains(strtolower($a['plat_nomor']), $search)
            );
        }
        
        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $armada = array_filter($armada, fn($a) => $a['status'] === $request->status);
        }
        
        // Pagination
        $page = $request->get('page', 1);
        $perPage = 10;
        $total = count($armada);
        $armada = array_values($armada);
        $offset = ($page - 1) * $perPage;
        $paginatedArmada = array_slice($armada, $offset, $perPage);

        return Inertia::render('Admin/Master/Armada/Index', [
            'armada' => [
                'data' => $paginatedArmada,
                'meta' => [
                    'current_page' => (int) $page,
                    'last_page' => (int) ceil($total / $perPage),
                    'per_page' => $perPage,
                    'total' => $total,
                ],
            ],
            'mitra' => $mitra,
            'filters' => [
                'search' => $request->get('search', ''),
                'status' => $request->get('status', 'all'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        return redirect()->route('admin.armada.index')->with('success', 'Armada berhasil ditambahkan');
    }

    public function update(Request $request, string $id)
    {
        return redirect()->route('admin.armada.index')->with('success', 'Armada berhasil diperbarui');
    }

    public function destroy(string $id)
    {
        return redirect()->route('admin.armada.index')->with('success', 'Armada berhasil dihapus');
    }
}
